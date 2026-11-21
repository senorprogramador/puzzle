import test from "node:test";
import assert from "node:assert/strict";

import {
  createMediaClient,
  createMediaUploadQueue,
  parseMediaUploadResumeData,
  serializeMediaUploadResumeData,
} from "../dist/media/client/index.js";

const apiAsset = {
  id: "asset-1",
  folderId: null,
  originalName: "photo.png",
  displayName: "photo.png",
  kind: "image",
  mimeType: "image/png",
  size: 4,
  status: "uploaded",
  tags: [],
  hotspots: [],
  focalPoint: null,
  variants: [],
  previousStatus: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
  revision: 1,
};

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

const makeApi = ({ multipart = false, expired = false, expiredTarget = false } = {}) => {
  const requests = [];
  let nextUpload = 0;
  const fetch = async (input, init = {}) => {
    const url = new URL(input, "https://app.example.test");
    const path = url.pathname;
    requests.push({ path, method: init.method ?? "GET", init });
    if (path.endsWith("/uploads/intent")) {
      const id = `upload-${++nextUpload}`;
      const expiresAt = new Date(Date.now() + 60_000).toISOString();
      return json({
        intent: {
          id,
          mode: multipart ? "multipart" : "single",
          ...(multipart ? { partSizeBytes: 2 } : {}),
          ...(!multipart
            ? {
                target: {
                  url: `https://upload.example.test/${id}?token=temporary`,
                  method: "PUT",
                  headers: { "content-type": "image/png" },
                  expiresAt: expiredTarget ? new Date(Date.now() - 1_000).toISOString() : expiresAt,
                },
              }
            : {}),
          expiresAt,
        },
      }, 201);
    }
    if (path.endsWith("/parts")) {
      const { partNumbers } = JSON.parse(init.body);
      return json({
        targets: partNumbers.map((partNumber) => ({
          partNumber,
          url: `https://upload.example.test/part/${partNumber}?token=temporary`,
          method: "PUT",
          headers: { "content-type": "image/png" },
          expiresAt: new Date(Date.now() + (expiredTarget ? -1_000 : 60_000)).toISOString(),
        })),
      });
    }
    if (path.match(/\/uploads\/[^/]+$/)) {
      return json({
        upload: {
          id: path.split("/").at(-1),
          mode: multipart ? "multipart" : "single",
          state: expired ? "expired" : "pending",
          expiresAt: new Date(Date.now() + 60_000).toISOString(),
          expectedSize: 4,
          ...(multipart ? { partSizeBytes: 2 } : {}),
        },
      });
    }
    if (path.endsWith("/complete")) {
      return json({ asset: apiAsset, replayed: false });
    }
    if (path.endsWith("/abort")) {
      return json({ aborted: true });
    }
    return json({ error: { code: "NOT_FOUND", message: "Not found." } }, 404);
  };
  return { fetch, requests };
};

const file = () =>
  new File([new Uint8Array([1, 2, 3, 4])], "photo.png", {
    type: "image/png",
    lastModified: 12345,
  });

test("upload queue reports progress and retries transient transfer failures", async () => {
  const api = makeApi();
  let attempts = 0;
  const client = createMediaClient({
    fetch: api.fetch,
    uploadTransport: async ({ file: upload, onProgress }) => {
      attempts += 1;
      onProgress(2, upload.size);
      if (attempts === 1) {
        throw Object.assign(new Error("temporary network failure"), {
          retryable: true,
        });
      }
      onProgress(upload.size, upload.size);
    },
  });
  const progress = [];
  const queue = createMediaUploadQueue(client, {
    maxConcurrentUploads: 2,
    maxRetries: 1,
    retryDelayMs: 0,
  });
  const asset = await queue.upload(
    {
      file: file(),
      kind: "image",
      metadata: { altText: "A landscape" },
    },
    { onProgress: (event) => progress.push(event) },
  );

  assert.equal(asset.status, "uploaded");
  assert.equal(attempts, 2);
  assert.ok(progress.some((event) => event.phase === "uploading" && event.percent === 50));
  assert.ok(progress.some((event) => event.phase === "finalizing" && event.percent === 100));
  assert.equal(api.requests.filter((item) => item.path.endsWith("/complete")).length, 1);
  assert.ok(api.requests.every((item) => item.init.cache === "no-store"));
  const completeBody = JSON.parse(
    api.requests.find((item) => item.path.endsWith("/complete")).init.body,
  );
  assert.equal(completeBody.originalName, "photo.png");
  assert.equal(completeBody.altText, "A landscape");
  queue.close();
});

test("upload queue keeps concurrent transfers within its configured bound", async () => {
  const api = makeApi();
  let active = 0;
  let peak = 0;
  const client = createMediaClient({
    fetch: api.fetch,
    uploadTransport: async () => {
      active += 1;
      peak = Math.max(peak, active);
      await new Promise((resolve) => setTimeout(resolve, 10));
      active -= 1;
    },
  });
  const queue = createMediaUploadQueue(client, {
    maxConcurrentUploads: 2,
    maxRetries: 0,
    retryDelayMs: 0,
  });
  const upload = () =>
    queue.upload({
      file: file(),
      kind: "image",
      metadata: {},
    });

  const assets = await Promise.all([upload(), upload(), upload(), upload()]);
  assert.equal(assets.length, 4);
  assert.equal(peak, 2);
  queue.close();
});

test("upload queue completes multipart uploads with server-issued targets and part ETags", async () => {
  const api = makeApi({ multipart: true });
  let partTransfers = 0;
  const client = createMediaClient({
    fetch: api.fetch,
    uploadTransport: async ({ file: part, onProgress }) => {
      partTransfers += 1;
      onProgress(part.size, part.size);
      return `"etag-${partTransfers}"`;
    },
  });
  const queue = createMediaUploadQueue(client, {
    maxConcurrentUploads: 1,
    maxRetries: 0,
    retryDelayMs: 0,
  });
  const asset = await queue.upload({
    file: file(),
    kind: "image",
    metadata: {},
  });

  assert.equal(asset.status, "uploaded");
  assert.equal(partTransfers, 2);
  assert.equal(
    api.requests.filter((item) => item.path.endsWith("/parts")).length,
    2,
  );
  const completeBody = JSON.parse(
    api.requests.find((item) => item.path.endsWith("/complete")).init.body,
  );
  assert.deepEqual(completeBody.parts, [
    { partNumber: 1, etag: '"etag-1"' },
    { partNumber: 2, etag: '"etag-2"' },
  ]);
  queue.close();
});

test("multipart task pauses between parts and resumes from serialized ETags", async () => {
  const api = makeApi({ multipart: true });
  let releaseFirstPart;
  let firstPartStarted;
  const firstStarted = new Promise((resolve) => {
    firstPartStarted = resolve;
  });
  const firstPartGate = new Promise((resolve) => {
    releaseFirstPart = resolve;
  });
  let transfers = 0;
  const client = createMediaClient({
    fetch: api.fetch,
    uploadTransport: async () => {
      transfers += 1;
      if (transfers === 1) {
        firstPartStarted();
        await firstPartGate;
        return '"part-one"';
      }
      return '"part-two"';
    },
  });
  const queue = createMediaUploadQueue(client, {
    maxConcurrentUploads: 1,
    maxRetries: 0,
    retryDelayMs: 0,
  });
  const pausedTask = queue.createTask({
    file: file(),
    kind: "image",
    metadata: { altText: "Persistable" },
  });
  void pausedTask.promise.catch(() => undefined);
  await firstStarted;
  const paused = pausedTask.pause();
  releaseFirstPart();
  await paused;

  assert.equal(pausedTask.status, "paused");
  assert.equal(api.requests.filter((item) => item.path.endsWith("/abort")).length, 0);
  assert.equal(api.requests.filter((item) => item.path.endsWith("/parts")).length, 1);
  const resumeData = pausedTask.getResumeData();
  assert.deepEqual(resumeData.completedParts, [
    { partNumber: 1, etag: '"part-one"' },
  ]);
  const serialized = serializeMediaUploadResumeData(resumeData);
  assert.doesNotMatch(
    serialized,
    /signed|token|headers|objectKey|providerUploadId|multipartUploadId|File/,
  );
  assert.match(serialized, /Persistable/);

  const resumedTask = queue.resume(serialized, file());
  const asset = await resumedTask.promise;
  assert.equal(asset.status, "uploaded");
  assert.equal(transfers, 2);
  assert.equal(api.requests.filter((item) => item.path.endsWith("/parts")).length, 2);
  const completion = JSON.parse(
    api.requests.find((item) => item.path.endsWith("/complete")).init.body,
  );
  assert.deepEqual(completion.parts, [
    { partNumber: 1, etag: '"part-one"' },
    { partNumber: 2, etag: '"part-two"' },
  ]);
  queue.close();
});

test("single-PUT task resumes with a reselected file without aborting its session", async () => {
  const api = makeApi();
  let releaseTransfer;
  let transferStarted;
  const started = new Promise((resolve) => {
    transferStarted = resolve;
  });
  const gate = new Promise((resolve) => {
    releaseTransfer = resolve;
  });
  const client = createMediaClient({
    fetch: api.fetch,
    uploadTransport: async () => {
      transferStarted();
      await gate;
    },
  });
  const queue = createMediaUploadQueue(client, {
    maxConcurrentUploads: 1,
    maxRetries: 0,
  });
  const task = queue.createTask({
    file: file(),
    kind: "image",
    metadata: {},
  });
  await started;
  const paused = task.pause();
  releaseTransfer();
  await paused;
  assert.equal(task.status, "paused");
  assert.equal(task.getResumeData().singleTransferComplete, true);

  task.resume(file());
  const asset = await task.promise;
  assert.equal(asset.status, "uploaded");
  assert.equal(api.requests.filter((item) => item.path.endsWith("/abort")).length, 0);
  assert.equal(api.requests.filter((item) => item.path.endsWith("/complete")).length, 1);
  queue.close();
});

test("task cancellation aborts the active transfer and server upload session", async () => {
  const api = makeApi();
  let transferStarted;
  const started = new Promise((resolve) => {
    transferStarted = resolve;
  });
  const client = createMediaClient({
    fetch: api.fetch,
    uploadTransport: ({ signal }) =>
      new Promise((_resolve, reject) => {
        transferStarted();
        signal.addEventListener(
          "abort",
          () => {
            const error = new Error("cancelled");
            error.name = "AbortError";
            reject(error);
          },
          { once: true },
        );
      }),
  });
  const queue = createMediaUploadQueue(client, {
    maxConcurrentUploads: 1,
    maxRetries: 0,
  });
  const task = queue.createTask({
    file: file(),
    kind: "image",
    metadata: {},
  });
  await started;
  await task.cancel();

  assert.equal(task.status, "cancelled");
  await assert.rejects(task.promise, { name: "AbortError" });
  assert.equal(api.requests.filter((item) => item.path.endsWith("/abort")).length, 1);
  assert.equal(api.requests.filter((item) => item.path.endsWith("/complete")).length, 0);
  queue.close();
});

test("persisted resume metadata rejects expired sessions and excludes unsafe fields", async () => {
  const api = makeApi({ multipart: true, expired: true });
  const client = createMediaClient({ fetch: api.fetch, uploadTransport: async () => '"etag"' });
  const queue = createMediaUploadQueue(client, { retryDelayMs: 0 });
  const resumeData = {
    version: 1,
    uploadSessionId: "upload-expired",
    mode: "multipart",
    fileInfo: {
      name: "photo.png",
      size: 4,
      type: "image/png",
      lastModified: 12345,
    },
    kind: "image",
    metadata: {
      altText: "Safe metadata",
      objectKey: "must-not-persist",
    },
    partSizeBytes: 2,
    completedParts: [{ partNumber: 1, etag: '"etag-one"' }],
    singleTransferComplete: false,
    target: { url: "https://private.example.test/?token=secret", headers: {} },
  };
  const serialized = serializeMediaUploadResumeData(resumeData);
  assert.doesNotMatch(serialized, /must-not-persist|private\.example|token|headers|target/);
  assert.equal(parseMediaUploadResumeData(serialized).metadata.altText, "Safe metadata");

  const task = queue.resume(serialized, file());
  await assert.rejects(task.promise, {
    name: "MediaClientError",
    status: 410,
    code: "UPLOAD_EXPIRED",
  });
  assert.equal(api.requests.filter((item) => item.path.endsWith("/parts")).length, 0);
  queue.close();
});

for (const multipart of [false, true]) {
  test(`expired ${multipart ? "multipart" : "single"} targets never reach the upload transport`, async () => {
    const api = makeApi({ multipart, expiredTarget: true });
    let transfers = 0;
    const client = createMediaClient({
      fetch: api.fetch,
      uploadTransport: async () => { transfers += 1; return '"etag"'; },
    });
    const queue = createMediaUploadQueue(client);
    const task = queue.createTask({ file: file(), kind: "image", metadata: {} });

    await assert.rejects(task.promise, { status: 410, code: "UPLOAD_EXPIRED" });
    assert.equal(task.status, "failed");
    assert.equal(transfers, 0);
    assert.equal(api.requests.filter((item) => item.path.endsWith("/complete")).length, 0);
    queue.close();
  });
}

test("single upload retries do not reuse a target that expired after a failed transfer", async (t) => {
  let now = Date.now();
  t.mock.method(Date, "now", () => now);
  const api = makeApi();
  let transfers = 0;
  const client = createMediaClient({
    fetch: api.fetch,
    uploadTransport: async () => {
      transfers += 1;
      now += 60_001;
      throw Object.assign(new Error("temporary network failure"), { retryable: true });
    },
  });
  const queue = createMediaUploadQueue(client, { maxRetries: 1, retryDelayMs: 0 });
  const task = queue.createTask({ file: file(), kind: "image", metadata: {} });

  await assert.rejects(task.promise, { status: 410, code: "UPLOAD_EXPIRED" });
  assert.equal(transfers, 1);
  assert.equal(api.requests.filter((item) => item.path.endsWith("/complete")).length, 0);
  queue.close();
});

test("aborting an active upload stops transfer and requests server-side abort", async () => {
  const api = makeApi();
  let transferStarted;
  const started = new Promise((resolve) => {
    transferStarted = resolve;
  });
  const client = createMediaClient({
    fetch: api.fetch,
    uploadTransport: ({ signal }) =>
      new Promise((_resolve, reject) => {
        transferStarted();
        signal.addEventListener(
          "abort",
          () => {
            const error = new Error("aborted");
            error.name = "AbortError";
            reject(error);
          },
          { once: true },
        );
      }),
  });
  const queue = createMediaUploadQueue(client, {
    maxConcurrentUploads: 1,
    maxRetries: 2,
    retryDelayMs: 0,
  });
  const controller = new AbortController();
  const upload = queue.upload(
    { file: file(), kind: "image", metadata: {} },
    { signal: controller.signal },
  );
  await started;
  controller.abort();
  await assert.rejects(upload, { name: "AbortError" });

  assert.equal(api.requests.filter((item) => item.path.endsWith("/abort")).length, 1);
  assert.equal(api.requests.filter((item) => item.path.endsWith("/complete")).length, 0);
  queue.close();
});

test("client surfaces normalized server errors and rejects invalid queue bounds", async () => {
  const client = createMediaClient({
    fetch: async () =>
      json({ error: { code: "FORBIDDEN", message: "Not allowed." } }, 403),
  });
  await assert.rejects(client.getAsset("asset-1"), {
    name: "MediaClientError",
    status: 403,
    code: "FORBIDDEN",
    retryable: false,
  });

  assert.throws(
    () => createMediaUploadQueue(client, { maxConcurrentUploads: 0 }),
    RangeError,
  );
});
