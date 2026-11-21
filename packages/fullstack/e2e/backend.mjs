import {
  createMediaAssetService,
  createMediaFolderService,
  createMediaProcessingService,
} from "@puzzle-ui/media";
import {
  InMemoryMediaObjectStorageAdapter,
  InMemoryMediaProcessingQueueAdapter,
} from "@puzzle-ui/media/testing/adapters";
import { MemoryStorageAdapter } from "../../media/tests/helpers/memory-storage-adapter.ts";
import { cmsRequest, createCmsFixture } from "../tests/cms-fixtures.mjs";
import { createMediaFixture } from "../tests/media-fixtures.mjs";
import { createNextMediaHandler } from "../dist/media/next/index.js";
import { createTanStackMediaHandler } from "../dist/media/tanstack/index.js";
import { createNextCmsHandler } from "../dist/cms/next/index.js";
import { createTanStackCmsHandler } from "../dist/cms/tanstack/index.js";

// This module is used only by isolated test applications. Its object targets,
// identity, scheduler, and processors are not production implementations.
export const createCmsMediaBrowserFixture = async (framework) => {
  if (framework !== "next" && framework !== "tanstack") {
    throw new TypeError("Expected the next or tanstack test framework.");
  }
  const storage = new MemoryStorageAdapter();
  const objectStorage = new InMemoryMediaObjectStorageAdapter();
  const assets = createMediaAssetService({ storage, objectStorage });
  const folders = createMediaFolderService({ storage });
  const queue = new InMemoryMediaProcessingQueueAdapter();
  let now = Date.now();
  const process = async ({ asset }) => {
    const bytes = objectStorage.getBytesForTesting(asset.object);
    if (!bytes) throw new Error("The test processor could not read the source.");
    const intent = await objectStorage.createUploadIntent({
      tenantId: asset.tenantId,
      fileName: asset.originalName,
      contentType: asset.mimeType,
      expectedSize: bytes.length,
      expiresInMs: 60_000,
    });
    await objectStorage.writeForTesting(intent.id, bytes, asset.mimeType);
    const output = await objectStorage.completeUpload(intent.id);
    return {
      variants: [{
        name: "preview",
        kind: asset.kind,
        object: output.object,
        mimeType: output.mimeType,
        size: output.size,
        ...(asset.width ? { width: asset.width } : {}),
        ...(asset.height ? { height: asset.height } : {}),
      }],
    };
  };
  const processing = createMediaProcessingService({
    storage,
    objectStorage,
    queue,
    processor: { processImage: process },
    transcoder: { transcode: process },
    now: () => new Date(now),
  });
  const media = createMediaFixture({
    assets,
    folders,
    objectStorage,
    processing,
    maxUploadBytes: 10 * 1024 * 1024,
    allowedMimeTypes: ["image/png", "video/webm"],
    multipart: { thresholdBytes: 1024, partSizeBytes: 512 },
    resolveProcessingProfiles: async () => [{ name: "preview", maxWidth: 64 }],
  });
  const cms = await createCmsFixture({
    mediaReferenceValidator: {
      async assertCanReference({ tenantId, assetId }) {
        const asset = await assets.get(tenantId, assetId);
        if (asset.status !== "ready") throw new Error("Asset is not ready.");
      },
    },
  });
  const definition = {
    slug: "story",
    name: "Story",
    version: 1,
    fields: [
      { key: "title", type: "text", label: "Title", required: true },
      { key: "media", type: "media", label: "Media" },
    ],
  };
  const registered = await cms.server.dispatch(cmsRequest("POST", "/admin/content-types", {
    definition,
  }));
  if (registered.status !== 201) {
    throw new Error(`Could not register the test content type: ${await registered.text()}`);
  }
  const mediaHandler = framework === "next"
    ? createNextMediaHandler({ media: media.server })
    : createTanStackMediaHandler({ media: media.server });
  const cmsHandler = framework === "next"
    ? createNextCmsHandler({ cms: cms.server })
    : createTanStackCmsHandler({ cms: cms.server });
  const dispatch = (handler, request) =>
    framework === "next" ? handler[request.method](request) : handler(request);

  return async (request) => {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/media/")) return dispatch(mediaHandler, request);
    if (url.pathname.startsWith("/api/cms/")) return dispatch(cmsHandler, request);
    if (request.method === "POST" && url.pathname === "/api/e2e/run-worker") {
      now += 1_000;
      const job = await processing.runNext("test-worker");
      return Response.json({ status: job?.status ?? null });
    }
    if (request.method === "PUT" && url.pathname.startsWith("/api/e2e/upload/")) {
      const [, , , , mode, sessionId, part] = url.pathname.split("/");
      const bytes = new Uint8Array(await request.arrayBuffer());
      if (mode === "multipart") {
        const result = await objectStorage.writePartForTesting(sessionId, Number(part), bytes);
        return Response.json({ etag: result.etag });
      }
      if (mode === "upload") {
        await objectStorage.writeForTesting(sessionId, bytes, request.headers.get("content-type"));
        return new Response(null, { status: 204 });
      }
      return new Response("Unknown test upload mode.", { status: 400 });
    }
    if (request.method === "GET" && url.pathname.startsWith("/api/e2e/object/")) {
      const asset = await assets.get("tenant-a", url.pathname.slice("/api/e2e/object/".length));
      const bytes = objectStorage.getBytesForTesting(asset.object);
      if (!bytes) return new Response("Test object not found.", { status: 404 });
      return new Response(bytes, { headers: { "content-type": asset.mimeType } });
    }
    return new Response("Test route not found.", { status: 404 });
  };
};
