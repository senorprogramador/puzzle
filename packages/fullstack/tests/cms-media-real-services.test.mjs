import assert from "node:assert/strict";
import test from "node:test";

import {
  createMediaAssetService,
  createMediaAuditService,
  createMediaFolderService,
  createMediaProcessingService,
} from "@puzzle-ui/media";
import {
  InMemoryMediaObjectStorageAdapter,
  InMemoryMediaProcessingQueueAdapter,
} from "@puzzle-ui/media/testing/adapters";
import { MemoryStorageAdapter } from "../../media/tests/helpers/memory-storage-adapter.ts";
import { cmsRequest, createCmsFixture, storyConfig } from "./cms-fixtures.mjs";
import { createMediaFixture, mediaRequest } from "./media-fixtures.mjs";
import { createNextMediaHandler } from "../dist/media/next/index.js";
import { createTanStackMediaHandler } from "../dist/media/tanstack/index.js";
import { createNextCmsHandler } from "../dist/cms/next/index.js";
import { createTanStackCmsHandler } from "../dist/cms/tanstack/index.js";
import { createMediaClient, createMediaUploadQueue } from "../dist/media/client/index.js";

test("host inspection reads real stored bytes before publishing an uploaded asset", async () => {
  const storage = new MemoryStorageAdapter();
  const objectStorage = new InMemoryMediaObjectStorageAdapter();
  const assets = createMediaAssetService({ storage, objectStorage });
  const folders = createMediaFolderService({ storage });
  const signature = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const fixture = createMediaFixture({
    assets,
    folders,
    objectStorage,
    verifyUploadedContent: async ({ object }) => {
      const bytes = objectStorage.getBytesForTesting(object.object);
      if (!bytes) throw new Error("Stored object is unavailable.");
      return object.mimeType === "image/png" &&
        signature.every((value, index) => bytes[index] === value);
    },
  });

  for (const [bytes, expected] of [
    [signature, 200],
    [new Uint8Array(signature.length), 415],
  ]) {
    const response = await fixture.server.dispatch(mediaRequest("POST", "/uploads/intent", {
      fileName: "photo.png", kind: "image", mimeType: "image/png", size: bytes.length,
    }));
    const { intent } = await response.json();
    await objectStorage.writeForTesting(intent.id, bytes, "image/png");
    const completed = await fixture.server.dispatch(mediaRequest("POST", `/uploads/${intent.id}/complete`, {
      originalName: "photo.png", kind: "image",
    }));
    assert.equal(completed.status, expected, await completed.clone().text());
  }
  const page = await assets.list({ tenantId: "tenant-a", first: 10 });
  assert.equal(page.items.length, 1);
  assert.equal(page.items[0].status, "uploaded");
});

for (const [framework, kind] of [
  ["next", "image"], ["next", "video"], ["tanstack", "image"], ["tanstack", "video"],
]) {
  test(`${framework} adapters connect real ${kind} services to code-first CMS drafts`, async () => {
    const storage = new MemoryStorageAdapter();
    let objectNow = Date.now();
    const objectStorage = new InMemoryMediaObjectStorageAdapter({
      now: () => new Date(objectNow),
    });
    const assets = createMediaAssetService({ storage, objectStorage });
    const folders = createMediaFolderService({ storage });
    const audit = createMediaAuditService({
      storage,
      authorize: ({ tenantId, actorId, action }) =>
        tenantId === "tenant-a" && (
          action === "audit:write" ? actorId === "audit-worker" : actorId === "audit-reader"
        ),
    });
    const queue = new InMemoryMediaProcessingQueueAdapter();
    const mimeType = kind === "image" ? "image/png" : "video/mp4";
    const fileName = kind === "image" ? "cover.png" : "clip.mp4";
    const bytes = new Uint8Array([1, 2, 3, 4, 5, 6]);
    let now = Date.now();
    let attempts = 0;
    let quotaAllowed = true;
    const createVariant = async () => {
      attempts += 1;
      if (attempts === 1) {
        return {
          variants: [],
          failures: [{ profile: "preview", message: "Temporary processor failure.", retryable: true }],
        };
      }
      const session = await objectStorage.createUploadIntent({
        tenantId: "tenant-a",
        fileName,
        contentType: mimeType,
        expectedSize: bytes.length,
        expiresInMs: 60_000,
      });
      await objectStorage.writeForTesting(session.id, bytes, mimeType);
      const stored = await objectStorage.completeUpload(session.id);
      return {
        variants: [{
          name: "preview",
          kind,
          object: stored.object,
          mimeType,
          size: stored.size,
          width: 2,
          height: 2,
        }],
      };
    };
    const processing = createMediaProcessingService({
      storage,
      objectStorage,
      queue,
      processor: { processImage: createVariant },
      transcoder: { transcode: createVariant },
      now: () => new Date(now),
      baseRetryDelayMs: 1_000,
    });
    const media = createMediaFixture({
      assets,
      folders,
      objectStorage,
      processing,
      onAudit: async (event) => {
        if (event.tenantId === "tenant-a") await audit.record({ event, actorId: "audit-worker" });
      },
      assertTenantQuota: async () => quotaAllowed,
      resolveProcessingProfiles: async () => [{ name: "preview", maxWidth: 100 }],
      allowedMimeTypes: [mimeType],
      ...(kind === "video" ? { multipart: { thresholdBytes: 4, partSizeBytes: 2 } } : {}),
    });
    const cms = await createCmsFixture({
      config: storyConfig(),
      mediaReferenceValidator: {
        async assertCanReference({ tenantId, assetId }) {
          const asset = await assets.get(tenantId, assetId);
          if (asset.status !== "ready") throw new Error("Asset is not ready.");
        },
      },
    });
    const nextMedia = createNextMediaHandler({ media: media.server });
    const nextCms = createNextCmsHandler({ cms: cms.server });
    const tanstackMedia = createTanStackMediaHandler({ media: media.server });
    const tanstackCms = createTanStackCmsHandler({ cms: cms.server });
    const dispatchMedia = (request) => framework === "next"
      ? nextMedia[request.method](request)
      : tanstackMedia(request);
    const dispatchCms = (request) => framework === "next"
      ? nextCms[request.method](request)
      : tanstackCms(request);
    let storyAssetId;
    let storyDocumentId;
    let storyDocumentRevision;
    media.setDeletionGuard(async ({ asset: candidate, context }) => (
      context.tenantId !== "tenant-a" || candidate.id !== storyAssetId
    ));

    const createStory = (mediaId) => dispatchCms(cmsRequest(
      "POST",
      "/admin/collections/story",
      {
        data: { title: "Story", media: mediaId },
        slug: "story",
        locale: "en-US",
      },
    ));

    const intentResponse = await dispatchMedia(mediaRequest("POST", "/uploads/intent", {
      fileName, kind, mimeType, size: bytes.length,
    }));
    assert.equal(intentResponse.status, 201, await intentResponse.clone().text());
    const { intent } = await intentResponse.json();
    quotaAllowed = false;
    const quotaResponse = await dispatchMedia(mediaRequest("POST", "/uploads/intent", {
      fileName, kind, mimeType, size: bytes.length,
    }));
    assert.equal(quotaResponse.status, 413);
    assert.equal((await quotaResponse.json()).error.code, "QUOTA_EXCEEDED");
    quotaAllowed = true;
    let parts;
    if (kind === "video") {
      assert.equal(intent.mode, "multipart");
      const targets = await dispatchMedia(
        mediaRequest("POST", `/uploads/${intent.id}/parts`, { partNumbers: [1, 2, 3] }),
      );
      assert.equal(targets.status, 200);
      parts = [];
      for (let partNumber = 1; partNumber <= 3; partNumber += 1) {
        parts.push(await objectStorage.writePartForTesting(
          intent.id, partNumber, bytes.slice((partNumber - 1) * 2, partNumber * 2),
        ));
        if (partNumber === 2) {
          const interrupted = await dispatchMedia(
            mediaRequest("POST", `/uploads/${intent.id}/complete`, { originalName: fileName, kind, parts }),
          );
          assert.equal(interrupted.status, 400);
          assert.equal((await objectStorage.getUploadSession(intent.id)).state, "pending");
        }
      }
    } else {
      await objectStorage.writeForTesting(intent.id, bytes, mimeType);
    }

    const completionBody = {
      originalName: fileName, kind, width: 2, height: 2, ...(parts ? { parts } : {}),
    };
    const completion = await dispatchMedia(
      mediaRequest("POST", `/uploads/${intent.id}/complete`, completionBody),
    );
    assert.equal(completion.status, 200, await completion.clone().text());
    const { asset } = await completion.json();
    assert.equal(asset.status, "uploaded");
    const replay = await dispatchMedia(
      mediaRequest("POST", `/uploads/${intent.id}/complete`, completionBody),
    );
    assert.equal(replay.status, 200);
    const replayed = await replay.json();
    assert.equal(replayed.replayed, true);
    assert.equal(replayed.asset.id, asset.id);
    const conflictingReplay = await dispatchMedia(mediaRequest("POST", `/uploads/${intent.id}/complete`, {
      ...completionBody, title: "different payload",
    }));
    assert.equal(conflictingReplay.status, 409);
    const source = await assets.get("tenant-a", asset.id);
    assert.deepEqual(objectStorage.getBytesForTesting(source.object), bytes);

    assert.equal((await createStory(asset.id)).status, 400);

    const queued = await dispatchMedia(
      mediaRequest("POST", `/assets/${asset.id}/processing`),
    );
    assert.equal(queued.status, 202, await queued.clone().text());
    assert.equal((await queued.json()).processing.status, "queued");
    assert.equal((await processing.runNext("worker-1"))?.status, "retrying");
    assert.equal((await assets.get("tenant-a", asset.id)).status, "processing");
    assert.equal((await createStory(asset.id)).status, 400);
    assert.equal(await processing.runNext("worker-1"), null);
    now += 1_000;
    assert.equal((await processing.runNext("worker-1"))?.status, "succeeded");
    assert.equal(attempts, 2);
    const ready = await assets.get("tenant-a", asset.id);
    assert.equal(ready.status, "ready");
    assert.equal(ready.variants[0].status, "ready");
    assert.deepEqual(objectStorage.getBytesForTesting(ready.variants[0].object), bytes);

    const listing = await dispatchMedia(mediaRequest("GET", "/assets"));
    assert.equal(listing.status, 200);
    assert.equal((await listing.json()).items[0].id, asset.id);
    media.setContext({ actorId: "actor-b", tenantId: "tenant-b" });
    const foreignRead = await dispatchMedia(mediaRequest("GET", `/assets/${asset.id}`));
    assert.equal(foreignRead.status, 404);
    const foreignListing = await dispatchMedia(mediaRequest("GET", "/assets?tenantId=tenant-a"));
    assert.deepEqual((await foreignListing.json()).items, []);
    media.setContext({ actorId: "actor-a", tenantId: "tenant-a" });

    if (kind === "image") {
      const crop = { x: 0.1, y: 0.1, width: 0.8, height: 0.8 };
      const hotspots = [{ id: "subject", x: 0.5, y: 0.5, label: "Subject" }];
      const update = await dispatchMedia(mediaRequest("PATCH", `/assets/${asset.id}`, {
        expectedRevision: ready.revision, crop, hotspots,
      }));
      assert.equal(update.status, 200, await update.clone().text());
      assert.deepEqual((await update.json()).asset.crop, crop);
      assert.deepEqual((await assets.get("tenant-a", asset.id)).hotspots, hotspots);
      const stale = await dispatchMedia(mediaRequest("PATCH", `/assets/${asset.id}`, {
        expectedRevision: ready.revision, altText: "stale update",
      }));
      assert.equal(stale.status, 409);
    }

    const draftResponse = await createStory(asset.id);
    assert.equal(draftResponse.status, 201, await draftResponse.clone().text());
    const { document } = await draftResponse.json();
    storyDocumentId = document.id;
    storyDocumentRevision = document.revision;
    storyAssetId = asset.id;
    const publishStory = await dispatchCms(
      cmsRequest("POST", `/admin/collections/story/${document.id}/publish`, {
        expectedRevision: document.revision,
      }),
    );
    assert.equal(publishStory.status, 200, await publishStory.clone().text());
    const publishedDocument = (await publishStory.json()).document;
    storyDocumentRevision = publishedDocument.revision;
    const publicStory = await dispatchCms(
      cmsRequest("GET", `/public/collections/story/${document.id}`),
    );
    assert.equal(publicStory.status, 200);
    assert.equal((await publicStory.json()).document.media, asset.id);

    cms.setAuthorization(false);
    const deniedDelete = await dispatchCms(
      cmsRequest("DELETE", `/admin/collections/story/${storyDocumentId}`, {
        expectedRevision: storyDocumentRevision,
      }),
    );
    assert.equal(deniedDelete.status, 403);
    cms.setAuthorization(true);

    const currentAsset = await assets.get("tenant-a", asset.id);
    const softDelete = await dispatchMedia(mediaRequest("DELETE", `/assets/${asset.id}`, {
      expectedRevision: currentAsset.revision,
    }));
    assert.equal(softDelete.status, 200, await softDelete.clone().text());
    const { asset: deletedAsset } = await softDelete.json();
    const permanentlyDelete = () => dispatchMedia(
      mediaRequest("DELETE", `/assets/${asset.id}/permanent`, { expectedRevision: deletedAsset.revision }),
    );
    assert.equal((await dispatchMedia(mediaRequest("GET", `/assets/${asset.id}`))).status, 404);
    media.setContext({ actorId: "actor-b", tenantId: "tenant-b" });
    assert.equal((await permanentlyDelete()).status, 404);
    media.setContext({ actorId: "actor-a", tenantId: "tenant-a" });
    assert.equal((await permanentlyDelete()).status, 403);
    assert.deepEqual(objectStorage.getBytesForTesting(source.object), bytes);
    const removeReference = await dispatchCms(
      cmsRequest("DELETE", `/admin/collections/story/${storyDocumentId}`, {
        expectedRevision: storyDocumentRevision,
      }),
    );
    assert.equal(removeReference.status, 200, await removeReference.clone().text());
    storyAssetId = undefined;
    assert.equal((await permanentlyDelete()).status, 200);
    assert.equal(objectStorage.getBytesForTesting(source.object), null);
    assert.equal(objectStorage.getBytesForTesting(ready.variants[0].object), null);
    let task;
    let pausePromise;
    let notifyPause;
    const pauseRequested = new Promise((resolve) => { notifyPause = resolve; });
    const client = createMediaClient({
      fetch: (path, init) => dispatchMedia(new Request(new URL(path, "https://example.test"), init)),
      uploadTransport: async ({ target, file, onProgress }) => {
        const url = new URL(target.url);
        const [sessionId, part] = url.pathname.slice(1).split("/");
        const data = new Uint8Array(await file.arrayBuffer());
        onProgress(data.length, data.length);
        if (url.hostname === "multipart") {
          const completed = await objectStorage.writePartForTesting(sessionId, Number(part), data);
          if (Number(part) === 1 && !pausePromise) {
            pausePromise = task.pause();
            notifyPause();
          }
          return completed.etag;
        }
        await objectStorage.writeForTesting(sessionId, data, mimeType);
      },
    });
    const uploadQueue = createMediaUploadQueue(client);
    const file = new File([bytes], fileName, { type: mimeType, lastModified: 1 });
    task = uploadQueue.createTask({ file, kind, metadata: { width: 2, height: 2 } });
    if (kind === "video") {
      await Promise.race([pauseRequested, task.promise.then(() => {
        throw new Error("Multipart upload completed before the pause.");
      })]);
      await pausePromise;
      assert.equal(task.status, "paused");
      assert.equal(task.getResumeData().completedParts.length, 1);
      task.resume(file);
    }
    const queuedAsset = await task.promise;
    assert.equal(queuedAsset.status, "uploaded");
    const queuedSource = await assets.get("tenant-a", queuedAsset.id);
    assert.deepEqual(objectStorage.getBytesForTesting(queuedSource.object), bytes);
    uploadQueue.close();
    const expiring = await dispatchMedia(mediaRequest("POST", "/uploads/intent", {
      fileName, kind, mimeType, size: bytes.length,
    }));
    assert.equal(expiring.status, 201);
    const { intent: expiringIntent } = await expiring.json();
    objectNow = Date.now() + 6 * 60_000;
    const expiredCompletion = await dispatchMedia(
      mediaRequest("POST", `/uploads/${expiringIntent.id}/complete`, { originalName: fileName, kind }),
    );
    assert.equal(expiredCompletion.status, 410);
    assert.equal((await objectStorage.getUploadSession(expiringIntent.id)).state, "expired");
    const history = await audit.list({ tenantId: "tenant-a", actorId: "audit-reader" });
    assert.ok(history.items.some((event) => event.action === "upload:complete" && event.relatedAssetId === asset.id));
    assert.ok(history.items.some((event) => event.action === "asset:purge" && event.result === "denied"));
    assert.doesNotMatch(JSON.stringify(history), /memory:|private-object-key|short-lived/);
    await assert.rejects(audit.list({ tenantId: "tenant-a", actorId: "unauthorized" }));
  });
}
