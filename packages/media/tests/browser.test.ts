import { describe, expect, it } from "bun:test";
import {
  cropImage,
  createImageVariants,
  createVideoPoster,
  readVideoMetadata,
  resizeImage,
} from "../src/browser";

describe("browser utilities", () => {
  it("imports without accessing browser globals at module scope", () => {
    expect(typeof resizeImage).toBe("function");
    expect(typeof cropImage).toBe("function");
    expect(typeof createImageVariants).toBe("function");
    expect(typeof readVideoMetadata).toBe("function");
    expect(typeof createVideoPoster).toBe("function");
  });

  it("validates normalized crops before decoding and honors aborts", async () => {
    const image = new Blob(["image data"], { type: "image/png" });
    for (const crop of [
      { x: -0.1, y: 0, width: 0.5, height: 0.5 },
      { x: 0.8, y: 0, width: 0.3, height: 0.5 },
      { x: 0, y: 0, width: 0, height: 1 },
      { x: 0, y: Number.NaN, width: 1, height: 1 },
    ]) {
      await expect(cropImage(image, { crop })).rejects.toMatchObject({
        code: "VALIDATION",
      });
    }
    const controller = new AbortController();
    controller.abort();
    await expect(
      cropImage(image, {
        crop: { x: 0, y: 0, width: 1, height: 1 },
        signal: controller.signal,
      }),
    ).rejects.toMatchObject({ name: "AbortError" });
  });

  it("rejects bad input and already-aborted operations before browser access", async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(
      resizeImage(new Blob(["x"], { type: "image/png" }), {
        maxWidth: 10,
        signal: controller.signal,
      }),
    ).rejects.toMatchObject({ name: "AbortError" });
    await expect(
      resizeImage(new Blob(["x"], { type: "image/png" }), {}),
    ).rejects.toThrow();
    await expect(
      readVideoMetadata(new Blob(["x"], { type: "text/plain" })),
    ).rejects.toThrow();
  });

  it("requires explicit original retention and validates named variant profiles", async () => {
    const image = new Blob(["image data"], { type: "image/png" });
    await expect(
      createImageVariants(image, {
        retainOriginal: false,
        profiles: [{ name: "bad" }],
      }),
    ).rejects.toThrow();
    await expect(
      createImageVariants(image, {
        retainOriginal: true,
        profiles: [
          { name: "same", maxWidth: 100 },
          { name: "same", maxHeight: 100 },
        ],
      }),
    ).rejects.toThrow();
  });
});
