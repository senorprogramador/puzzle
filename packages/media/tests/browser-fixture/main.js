import {
  cropImage,
  createImageVariants,
  createVideoPoster,
  readVideoMetadata,
  resizeImage,
} from "../../dist/browser/index.js";

const canvasBlob = (canvas, type) =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Chromium failed to encode a test image."));
    }, type);
  });

const makeImage = async (width, height) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D context is unavailable.");
  context.fillStyle = "#d23b4a";
  context.fillRect(0, 0, Math.floor(width / 2), height);
  return canvasBlob(canvas, "image/png");
};

const makeVideo = async () => {
  // MediaRecorder output can omit the WebM Duration element and report Infinity.
  const response = await fetch("/tests/fixtures/finite-duration.webm");
  if (!response.ok) {
    return { blob: null, reason: "The finite-duration WebM fixture is unavailable." };
  }
  const file = await response.blob();
  return { blob: new Blob([file], { type: "video/webm" }) };
};

const trackObjectUrls = async (run, abortOnCreate) => {
  const originalCreate = Object.getOwnPropertyDescriptor(URL, "createObjectURL");
  const originalRevoke = Object.getOwnPropertyDescriptor(URL, "revokeObjectURL");
  if (!originalCreate?.value || !originalRevoke?.value) {
    throw new Error("Object URL APIs are unavailable.");
  }
  const created = [];
  const revoked = [];
  const createObjectURL = originalCreate.value;
  const revokeObjectURL = originalRevoke.value;
  Object.defineProperty(URL, "createObjectURL", {
    ...originalCreate,
    value: (object) => {
      const url = createObjectURL.call(URL, object);
      created.push(url);
      abortOnCreate?.abort();
      return url;
    },
  });
  Object.defineProperty(URL, "revokeObjectURL", {
    ...originalRevoke,
    value: (url) => {
      revoked.push(url);
      revokeObjectURL.call(URL, url);
    },
  });
  try {
    return { value: await run(), created, revoked };
  } finally {
    Object.defineProperty(URL, "createObjectURL", originalCreate);
    Object.defineProperty(URL, "revokeObjectURL", originalRevoke);
  }
};

window.mediaBrowserTest = {
  async workerOutput(abort = false) {
    const source = new File([await makeImage(320, 180)], "photo.png", {
      type: "image/png",
    });
    const controller = new AbortController();
    const progress = [];
    try {
      const result = await resizeImage(source, {
        maxWidth: 80,
        format: "image/png",
        signal: controller.signal,
        onProgress: (event) => {
          progress.push(event);
          if (abort && event.stage === "decode") controller.abort();
        },
      });
      return {
        width: result.width,
        height: result.height,
        fileName: result.fileName,
        progress,
      };
    } catch (error) {
      return { error: error.name, code: error.code, progress };
    }
  },

  async cropOutputs() {
    const source = await makeImage(320, 180);
    const crop = await cropImage(source, {
      crop: { x: 0.5, y: 0, width: 0.5, height: 1 },
      maxWidth: 80,
      format: "image/png",
    });
    const bitmap = await createImageBitmap(crop.blob);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas 2D context is unavailable.");
    context.drawImage(bitmap, 0, 0);
    const alpha = context.getImageData(40, 45, 1, 1).data[3];
    bitmap.close();

    const unscaled = await cropImage(source, {
      crop: { x: 0, y: 0, width: 0.5, height: 0.5 },
      maxWidth: 500,
      maxHeight: 500,
      format: "image/png",
    });
    const plainCrop = await cropImage(source, {
      crop: { x: 0, y: 0, width: 0.5, height: 0.5 },
      format: "image/png",
    });
    let tinyCropCode;
    try {
      await cropImage(source, {
        crop: { x: 0, y: 0, width: 0.001, height: 1 },
      });
    } catch (error) {
      tinyCropCode = error.code;
    }
    const named = await createImageVariants(source, {
      retainOriginal: false,
      profiles: [
        { name: "__proto__", maxWidth: 50 },
        { name: "constructor", maxWidth: 60 },
      ],
    });
    return {
      crop: {
        width: crop.width,
        height: crop.height,
        originalWidth: crop.originalWidth,
        originalHeight: crop.originalHeight,
        format: crop.format,
        alpha,
      },
      unscaled: { width: unscaled.width, height: unscaled.height },
      plainCrop: { width: plainCrop.width, height: plainCrop.height },
      tinyCropCode,
      names: Object.keys(named.variants),
      widths: [named.variants.__proto__.width, named.variants.constructor.width],
    };
  },

  async imageOutputs() {
    const source = await makeImage(320, 180);
    const resized = await resizeImage(source, {
      maxWidth: 100,
      maxHeight: 100,
      format: "image/png",
    });
    const bitmap = await createImageBitmap(resized.blob);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas 2D context is unavailable.");
    context.drawImage(bitmap, 0, 0);
    const transparentCornerAlpha =
      context.getImageData(canvas.width - 1, canvas.height - 1, 1, 1).data[3] ?? -1;
    bitmap.close();

    const retained = await createImageVariants(source, {
      retainOriginal: true,
      profiles: [
        { name: "mobile", maxWidth: 80, maxHeight: 80 },
        { name: "desktop", maxWidth: 256, maxHeight: 256 },
      ],
    });
    const omitted = await createImageVariants(source, {
      retainOriginal: false,
      profiles: [{ name: "single", maxWidth: 200 }],
    });
    const smallSource = await makeImage(40, 20);
    const noUpscale = await resizeImage(smallSource, {
      maxWidth: 100,
      maxHeight: 100,
      format: "image/png",
    });
    return {
      source: { width: 320, height: 180 },
      resized: {
        width: resized.width,
        height: resized.height,
        size: resized.size,
        format: resized.format,
      },
      transparentCornerAlpha,
      variants: Object.entries(retained.variants).map(([name, result]) => ({
        name,
        width: result.width,
        height: result.height,
      })),
      retainedOriginal: retained.original === source,
      omittedOriginal: omitted.original === null,
      noUpscale: {
        width: noUpscale.width,
        height: noUpscale.height,
        resized: noUpscale.resized,
      },
    };
  },

  async videoOutputs() {
    const video = await makeVideo();
    if (!video.blob) {
      return {
        supported: false,
        reason: video.reason ?? "No local video fixture was generated.",
      };
    }
    const tracked = await trackObjectUrls(async () => {
      const metadata = await readVideoMetadata(video.blob);
      const poster = await createVideoPoster(video.blob, {
        maxWidth: 80,
        maxHeight: 80,
        timeSeconds: Math.min(0.1, metadata.duration / 2),
      });
      return {
        metadata: {
          duration: metadata.duration,
          width: metadata.width,
          height: metadata.height,
          mimeType: metadata.mimeType,
        },
        poster: {
          width: poster.width,
          height: poster.height,
          size: poster.blob.size,
          format: poster.format,
        },
      };
    });
    return {
      supported: true,
      ...tracked.value,
      created: tracked.created,
      revoked: tracked.revoked,
    };
  },

  async corruptAndAbortCleanup() {
    const unsupportedFormat = await trackObjectUrls(async () => {
      try {
        await resizeImage(
          new Blob(["small image"], { type: "image/png" }),
          { maxWidth: 100, format: "image/gif" },
        );
        throw new Error("Unsupported image format unexpectedly succeeded.");
      } catch (error) {
        return {
          name: error instanceof Error ? error.name : "UnknownError",
          ...(typeof error === "object" &&
          error !== null &&
          "code" in error &&
          typeof error.code === "string"
            ? { code: error.code }
            : {}),
        };
      }
    });
    const corruptImage = await trackObjectUrls(async () => {
      try {
        await resizeImage(new Blob(["not an image"], { type: "image/png" }), {
          maxWidth: 100,
        });
        throw new Error("Corrupt image unexpectedly decoded.");
      } catch (error) {
        return {
          name: error instanceof Error ? error.name : "UnknownError",
          ...(typeof error === "object" &&
          error !== null &&
          "code" in error &&
          typeof error.code === "string"
            ? { code: error.code }
            : {}),
        };
      }
    });
    const corruptVideo = await trackObjectUrls(async () => {
      try {
        await readVideoMetadata(
          new Blob([new Uint8Array([0, 1, 2, 3])], { type: "video/webm" }),
        );
        throw new Error("Corrupt video unexpectedly decoded.");
      } catch (error) {
        return {
          name: error instanceof Error ? error.name : "UnknownError",
          ...(typeof error === "object" &&
          error !== null &&
          "code" in error &&
          typeof error.code === "string"
            ? { code: error.code }
            : {}),
        };
      }
    });
    const controller = new AbortController();
    const abortedVideo = await trackObjectUrls(
      async () => {
        try {
          await readVideoMetadata(
            new Blob(["abort me"], { type: "video/webm" }),
            { signal: controller.signal },
          );
          throw new Error("Aborted video unexpectedly completed.");
        } catch (error) {
          return { name: error instanceof Error ? error.name : "UnknownError" };
        }
      },
      controller,
    );
    return {
      unsupportedFormat: {
        ...unsupportedFormat.value,
        created: unsupportedFormat.created,
        revoked: unsupportedFormat.revoked,
      },
      corruptImage: {
        ...corruptImage.value,
        created: corruptImage.created,
        revoked: corruptImage.revoked,
      },
      corruptVideo: {
        ...corruptVideo.value,
        created: corruptVideo.created,
        revoked: corruptVideo.revoked,
      },
      abortedVideo: {
        ...abortedVideo.value,
        created: abortedVideo.created,
        revoked: abortedVideo.revoked,
      },
    };
  },
};
