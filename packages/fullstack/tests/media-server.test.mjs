import test from "node:test";
import assert from "node:assert/strict";

import {
  createMediaFixture,
  mediaRequest,
} from "./media-fixtures.mjs";

test("media routes return no-store 404/405 and reject malformed request bodies", async () => {
  const { server, calls } = createMediaFixture();

  const missing = await server.dispatch(mediaRequest("GET", "/missing"));
  assert.equal(missing.status, 404);
  assert.match(missing.headers.get("cache-control"), /no-store/);

  const method = await server.dispatch(mediaRequest("GET", "/uploads/intent"));
  assert.equal(method.status, 405);
  assert.equal(method.headers.get("allow"), "POST");
  assert.match(method.headers.get("cache-control"), /no-store/);

  const contentType = await server.dispatch(
    mediaRequest("POST", "/uploads/intent", "{}", {
      headers: { "content-type": "text/plain" },
    }),
  );
  assert.equal(contentType.status, 415);

  const malformed = await server.dispatch(
    mediaRequest("POST", "/uploads/intent", "{", {
      headers: { "content-type": "application/json" },
    }),
  );
  assert.equal(malformed.status, 400);
  assert.equal(calls.createUploadIntent, 0);

  const invalidId = await server.dispatch(
    mediaRequest("GET", "/assets/%00"),
  );
  assert.equal(invalidId.status, 400);
});

test("media handlers resolve trusted actor/tenant and fail closed on denied access", async () => {
  const fixture = createMediaFixture();
  fixture.setContext(null);
  const unauthenticated = await fixture.server.dispatch(
    mediaRequest("POST", "/uploads/intent", {
      fileName: "photo.png",
      kind: "image",
      mimeType: "image/png",
      size: 4,
    }),
  );
  assert.equal(unauthenticated.status, 401);
  assert.equal(fixture.calls.authorization.length, 0);
  assert.equal(fixture.calls.createUploadIntent, 0);

  fixture.setContext({ actorId: "actor-a", tenantId: "tenant-a" });
  fixture.setAllowed(false);
  const forbidden = await fixture.server.dispatch(
    mediaRequest("POST", "/uploads/intent", {
      fileName: "photo.png",
      kind: "image",
      mimeType: "image/png",
      size: 4,
      tenantId: "attacker-selected-tenant",
    }),
  );
  assert.equal(forbidden.status, 403);
  assert.equal(fixture.calls.createUploadIntent, 0);
  assert.equal(
    fixture.calls.authorization.at(-1).tenantId,
    "tenant-a",
  );

  const invalidPolicy = createMediaFixture({
    authorize: async () => "allow",
  });
  const invalidPolicyResponse = await invalidPolicy.server.dispatch(
    mediaRequest("GET", "/assets"),
  );
  assert.equal(invalidPolicyResponse.status, 403);
  assert.equal(invalidPolicy.calls.assetList.length, 0);
});

test("media audit hook records sanitized mutation, denial, and failure outcomes", async () => {
  const events = [];
  const fixture = createMediaFixture({ onAudit: async (event) => events.push(event) });
  const created = await fixture.server.dispatch(mediaRequest("POST", "/folders", { name: "Photos" }));
  assert.equal(created.status, 201);
  assert.equal(events.length, 1);
  assert.deepEqual({ ...events[0], timestamp: undefined }, {
    tenantId: "tenant-a", actorId: "actor-a", resource: "folder", resourceId: "folder-test",
    action: "folder:create", result: "success", timestamp: undefined,
  });
  assert.ok(events[0].timestamp instanceof Date);
  fixture.setAllowed(false);
  assert.equal((await fixture.server.dispatch(mediaRequest("POST", "/folders", { name: "No" }))).status, 403);
  assert.equal(events[1].result, "denied");
  fixture.setAllowed(true);
  assert.equal((await fixture.server.dispatch(mediaRequest("POST", "/folders", {}))).status, 400);
  assert.equal(events[2].result, "failure");
  await fixture.server.dispatch(mediaRequest("GET", "/assets"));
  assert.equal(events.length, 3);
  assert.doesNotMatch(JSON.stringify(events), /short-lived|private-object-key|Photos/);
});

test("media audit failure is explicit even after a mutation has committed", async () => {
  const fixture = createMediaFixture({
    onAudit: async () => { throw new Error("private audit sink detail"); },
  });
  const response = await fixture.server.dispatch(mediaRequest("POST", "/folders", { name: "Photos" }));
  assert.equal(response.status, 503);
  assert.equal(fixture.calls.folderCreate, 1);
  const result = await response.json();
  assert.match(result.error.message, /may have completed/);
  assert.doesNotMatch(JSON.stringify(result), /private audit sink detail/);
});

test("every media mutation and signed-target route reports denied attempts", async () => {
  const events = [];
  const fixture = createMediaFixture({
    onAudit: async (event) => events.push(event),
    processing: { ready: Promise.resolve() },
    resolveProcessingProfiles: async () => [],
  });
  fixture.setAllowed(false);
  const routes = [
    ["POST", "/uploads/intent", "upload:create"],
    ["POST", "/uploads/u/parts", "upload:part-targets"],
    ["POST", "/uploads/u/complete", "upload:complete"],
    ["POST", "/uploads/u/abort", "upload:abort"],
    ["PATCH", "/assets/a", "asset:update"],
    ["DELETE", "/assets/a", "asset:delete"],
    ["POST", "/assets/a/restore", "asset:restore"],
    ["DELETE", "/assets/a/permanent", "asset:purge"],
    ["POST", "/assets/a/read", "asset:read-url"],
    ["POST", "/assets/a/processing", "asset:process"],
    ["POST", "/folders", "folder:create"],
    ["PATCH", "/folders/f", "folder:update"],
    ["DELETE", "/folders/f", "folder:delete"],
    ["POST", "/folders/f/restore", "folder:restore"],
    ["DELETE", "/folders/f/permanent", "folder:purge"],
  ];
  for (const [method, path, action] of routes) {
    assert.equal((await fixture.server.dispatch(mediaRequest(method, path, {}))).status, 403, action);
    assert.equal(events.at(-1).action, action);
    assert.equal(events.at(-1).result, "denied");
  }
  assert.equal(events.length, routes.length);
});

test("asset listing uses the resolved tenant instead of a client-supplied tenant", async () => {
  const fixture = createMediaFixture();
  const response = await fixture.server.dispatch(
    mediaRequest("GET", "/assets?tenantId=tenant-b&first=12"),
  );
  assert.equal(response.status, 200);
  assert.deepEqual(fixture.calls.assetList[0], {
    tenantId: "tenant-a",
    first: 12,
  });
  assert.match(response.headers.get("cache-control"), /no-store/);
});

test("finalize validates object metadata, creates uploaded assets, and replays idempotently", async () => {
  const fixture = createMediaFixture();
  const intentResponse = await fixture.server.dispatch(
    mediaRequest("POST", "/uploads/intent", {
      fileName: "folder/photo.png",
      kind: "image",
      mimeType: "image/png",
      size: 4,
    }),
  );
  assert.equal(intentResponse.status, 201);
  const { intent } = await intentResponse.json();
  assert.equal(intent.id, "upload-1");
  assert.equal(intent.target.method, "PUT");
  assert.equal(intent.target.headers["x-upload-token"], "short-lived");

  const finalizeBody = {
    originalName: "photo.png",
    kind: "image",
    width: 2,
    height: 2,
    focalPoint: { x: 0.5, y: 0.5 },
    altText: "A test image",
  };
  const first = await fixture.server.dispatch(
    mediaRequest("POST", `/uploads/${intent.id}/complete`, finalizeBody),
  );
  assert.equal(first.status, 200);
  const firstResult = await first.json();
  assert.equal(firstResult.asset.status, "uploaded");
  assert.deepEqual(firstResult.asset.focalPoint, { x: 0.5, y: 0.5 });
  assert.equal(firstResult.replayed, false);
  assert.equal(fixture.calls.assetCreate, 1);
  assert.equal(fixture.calls.completeUpload, 1);

  const replay = await fixture.server.dispatch(
    mediaRequest("POST", `/uploads/${intent.id}/complete`, finalizeBody),
  );
  assert.equal(replay.status, 200);
  const replayResult = await replay.json();
  assert.equal(replayResult.replayed, true);
  assert.equal(replayResult.asset.id, firstResult.asset.id);
  assert.equal(fixture.calls.assetCreate, 1);
  assert.equal(fixture.calls.completeUpload, 1);

  const serialized = JSON.stringify(firstResult);
  assert.doesNotMatch(serialized, /private-object-key|tenant-a|versionId|processingJobId/);
  assert.match(serialized, /A test image/);

  const conflictingReplay = await fixture.server.dispatch(
    mediaRequest("POST", `/uploads/${intent.id}/complete`, {
      ...finalizeBody,
      title: "different payload",
    }),
  );
  assert.equal(conflictingReplay.status, 409);
});

test("content inspection runs only for authorized tenant uploads and successful replays skip it", async () => {
  const inspections = [];
  const fixture = createMediaFixture({
    verifyUploadedContent: async (input) => {
      inspections.push(input);
      return true;
    },
  });
  const intentResponse = await fixture.server.dispatch(mediaRequest("POST", "/uploads/intent", {
    fileName: "photo.png", kind: "image", mimeType: "image/png", size: 4,
  }));
  const { intent } = await intentResponse.json();
  const finalize = () => mediaRequest("POST", `/uploads/${intent.id}/complete`, {
    originalName: "photo.png", kind: "image",
  });

  fixture.setAllowed(false);
  assert.equal((await fixture.server.dispatch(finalize())).status, 403);
  fixture.setAllowed(true);
  fixture.setContext({ actorId: "actor-b", tenantId: "tenant-b" });
  assert.equal((await fixture.server.dispatch(finalize())).status, 404);
  assert.equal(inspections.length, 0);
  assert.equal(fixture.calls.completeUpload, 0);

  fixture.setContext({ actorId: "actor-a", tenantId: "tenant-a" });
  const first = await fixture.server.dispatch(finalize());
  assert.equal(first.status, 200);
  assert.equal((await first.json()).replayed, false);
  assert.equal(inspections.length, 1);
  assert.deepEqual(inspections[0].context, { actorId: "actor-a", tenantId: "tenant-a" });
  assert.equal(inspections[0].kind, "image");
  assert.equal(inspections[0].object.tenantId, "tenant-a");
  assert.equal(inspections[0].object.mimeType, "image/png");
  assert.equal(inspections[0].object.object.key, "private-object-key-upload-1");
  assert.equal(inspections[0].request.method, "POST");
  const replay = await fixture.server.dispatch(finalize());
  assert.equal(replay.status, 200);
  assert.equal((await replay.json()).replayed, true);
  assert.equal(inspections.length, 1);
  assert.equal(fixture.calls.assetCreate, 1);
});

for (const [label, result, status, code] of [
  ["rejection", false, 415, "UNSUPPORTED_MEDIA_TYPE"],
  ["exception", "throw", 503, "CAPABILITY"],
  ["invalid result", undefined, 503, "CAPABILITY"],
  ["truthy non-boolean result", "true", 503, "CAPABILITY"],
]) {
  test(`content inspection ${label} fails closed and remains retryable`, async () => {
    let decision = result;
    const fixture = createMediaFixture({
      verifyUploadedContent: async () => {
        if (decision === "throw") throw new Error("private provider detail");
        return decision;
      },
    });
    const intentResponse = await fixture.server.dispatch(mediaRequest("POST", "/uploads/intent", {
      fileName: "photo.png", kind: "image", mimeType: "image/png", size: 4,
    }));
    const { intent } = await intentResponse.json();
    const finalize = () => mediaRequest("POST", `/uploads/${intent.id}/complete`, {
      originalName: "photo.png", kind: "image",
    });
    const response = await fixture.server.dispatch(finalize());
    assert.equal(response.status, status);
    const body = await response.json();
    assert.equal(body.error.code, code);
    assert.doesNotMatch(JSON.stringify(body), /private provider detail|private-object-key|upload-1/);
    assert.equal(fixture.calls.assetCreate, 0);
    assert.equal(fixture.calls.objectDelete, 0);
    assert.equal(fixture.sessions.get(intent.id).session.state, "completed");

    decision = true;
    const retry = await fixture.server.dispatch(finalize());
    assert.equal(retry.status, 200);
    assert.equal((await retry.json()).replayed, false);
    assert.equal(fixture.calls.assetCreate, 1);
  });
}

test("content inspection configuration rejects non-functions", () => {
  assert.throws(() => createMediaFixture({ verifyUploadedContent: true }), /Invalid media server configuration/);
});

test("finalize refuses expired sessions before object completion", async () => {
  const fixture = createMediaFixture();
  const intentResponse = await fixture.server.dispatch(
    mediaRequest("POST", "/uploads/intent", {
      fileName: "photo.png",
      kind: "image",
      mimeType: "image/png",
      size: 4,
    }),
  );
  const { intent } = await intentResponse.json();
  const record = fixture.sessions.get(intent.id);
  record.session = {
    ...record.session,
    state: "expired",
    expiresAt: new Date(Date.now() - 1_000),
  };

  const status = await fixture.server.dispatch(
    mediaRequest("GET", `/uploads/${intent.id}`),
  );
  assert.equal((await status.json()).upload.state, "expired");

  const complete = await fixture.server.dispatch(
    mediaRequest("POST", `/uploads/${intent.id}/complete`, {
      originalName: "photo.png",
      kind: "image",
    }),
  );
  assert.equal(complete.status, 410);
  assert.equal(fixture.calls.completeUpload, 0);
  assert.equal(fixture.calls.assetCreate, 0);
});

test("permanent deletion calls the host reference guard before deleting bytes", async () => {
  const fixture = createMediaFixture();
  fixture.setDeletionGuard(async () => false);
  const asset = fixture.addAsset({
    id: "asset-cms-linked",
    status: "ready",
    tenantId: "tenant-a",
    object: { key: "cms-linked-object", versionId: "v1" },
  });

  const denied = await fixture.server.dispatch(
    mediaRequest("DELETE", `/assets/${asset.id}/permanent`, {
      expectedRevision: asset.revision,
    }),
  );
  assert.equal(denied.status, 403);
  assert.equal(fixture.calls.deletionGuard, 1);
  assert.equal(fixture.calls.assetPermanentDelete, 0);
  assert.equal(fixture.calls.objectDelete, 0);

  const softDeleted = await fixture.server.dispatch(
    mediaRequest("DELETE", `/assets/${asset.id}`, {
      expectedRevision: asset.revision,
    }),
  );
  assert.equal(softDeleted.status, 200);
  assert.equal(fixture.calls.deletionGuard, 1);
  assert.equal(fixture.calls.objectDelete, 0);
});

test("upload validation caps sizes and rejects types not allowed by server policy", async () => {
  const fixture = createMediaFixture();
  const tooLarge = await fixture.server.dispatch(
    mediaRequest("POST", "/uploads/intent", {
      fileName: "large.png",
      kind: "image",
      mimeType: "image/png",
      size: 2_000,
    }),
  );
  assert.equal(tooLarge.status, 413);

  const disallowed = await fixture.server.dispatch(
    mediaRequest("POST", "/uploads/intent", {
      fileName: "photo.jpg",
      kind: "image",
      mimeType: "image/jpeg",
      size: 4,
    }),
  );
  assert.equal(disallowed.status, 415);
  assert.equal(fixture.calls.createUploadIntent, 0);
});

test("finalize rejects object metadata inconsistent with the completed upload", async () => {
  for (const inconsistentMetadata of [
    (stored) => ({ ...stored, size: stored.size + 1 }),
    (stored) => ({ ...stored, tenantId: "tenant-other" }),
  ]) {
    let inspections = 0;
    const fixture = createMediaFixture({
      verifyUploadedContent: async () => {
        inspections += 1;
        return true;
      },
    });
    const intentResponse = await fixture.server.dispatch(
      mediaRequest("POST", "/uploads/intent", {
        fileName: "photo.png",
        kind: "image",
        mimeType: "image/png",
        size: 4,
      }),
    );
    const { intent } = await intentResponse.json();
    const getObjectMetadata = fixture.objectStorage.getObjectMetadata.bind(
      fixture.objectStorage,
    );
    fixture.objectStorage.getObjectMetadata = async (object) => {
      const stored = await getObjectMetadata(object);
      return stored ? inconsistentMetadata(stored) : null;
    };

    const response = await fixture.server.dispatch(
      mediaRequest("POST", `/uploads/${intent.id}/complete`, {
        originalName: "photo.png",
        kind: "image",
      }),
    );
    assert.equal(response.status, 503);
    assert.equal(fixture.calls.assetCreate, 0);
    assert.equal(inspections, 0);
  }
});

test("multipart intent exposes only short-lived part targets and finalizes validated ETags", async () => {
  const fixture = createMediaFixture({
    multipart: {
      thresholdBytes: 4,
      partSizeBytes: 2,
    },
  });
  const intentResponse = await fixture.server.dispatch(
    mediaRequest("POST", "/uploads/intent", {
      fileName: "photo.png",
      kind: "image",
      mimeType: "image/png",
      size: 6,
    }),
  );
  assert.equal(intentResponse.status, 201);
  const { intent } = await intentResponse.json();
  assert.equal(intent.mode, "multipart");
  assert.equal(intent.partSizeBytes, 2);
  assert.equal("target" in intent, false);
  assert.doesNotMatch(JSON.stringify(intent), /providerUploadId|multipartUploadId|private-object-key/);

  const partTargets = await fixture.server.dispatch(
    mediaRequest("POST", `/uploads/${intent.id}/parts`, {
      partNumbers: [2, 1, 3],
    }),
  );
  assert.equal(partTargets.status, 200);
  const { targets } = await partTargets.json();
  assert.deepEqual(targets.map((target) => target.partNumber), [2, 1, 3]);
  assert.equal(fixture.calls.partTargetRequests.length, 1);
  assert.doesNotMatch(JSON.stringify(targets), /uploadId|objectKey/);

  const parts = [
    { partNumber: 1, etag: '"part-one"' },
    { partNumber: 2, etag: '"part-two"' },
    { partNumber: 3, etag: '"part-three"' },
  ];
  const completed = await fixture.server.dispatch(
    mediaRequest("POST", `/uploads/${intent.id}/complete`, {
      originalName: "photo.png",
      kind: "image",
      parts,
    }),
  );
  assert.equal(completed.status, 200);
  assert.deepEqual(fixture.calls.completedParts, parts);
  assert.equal((await completed.json()).asset.status, "uploaded");
});

test("processing dispatch returns sanitized worker status without claiming readiness", async () => {
  let enqueueInput;
  const now = new Date();
  const fixture = createMediaFixture({
    processing: {
      async enqueue(input) {
        enqueueInput = input;
        return {
          id: "private-job-id",
          tenantId: input.tenantId,
          assetId: input.assetId,
          kind: input.kind,
          profiles: input.profiles,
          idempotencyKey: input.idempotencyKey,
          status: "queued",
          attempt: 0,
          maxAttempts: 3,
          progress: 0,
          availableAt: now,
          createdAt: now,
          updatedAt: now,
          revision: 1,
        };
      },
    },
    resolveProcessingProfiles: async () => [
      { name: "thumbnail", maxWidth: 320, required: true },
    ],
  });
  const asset = fixture.addAsset({
    id: "asset-to-process",
    status: "uploaded",
    tenantId: "tenant-a",
  });

  const response = await fixture.server.dispatch(
    mediaRequest("POST", `/assets/${asset.id}/processing`),
  );
  assert.equal(response.status, 202);
  const result = await response.json();
  assert.equal(result.processing.status, "queued");
  assert.equal(result.processing.assetId, asset.id);
  assert.equal("id" in result.processing, false);
  assert.equal("tenantId" in result.processing, false);
  assert.equal(enqueueInput.tenantId, "tenant-a");
  assert.equal(enqueueInput.idempotencyKey, `fullstack-media:${asset.id}:1`);
  assert.equal((await fixture.assets.get("tenant-a", asset.id)).status, "uploaded");
});

test("per-action rate limits return 429 and quota denial returns an explicit quota error", async () => {
  const rateCalls = [];
  const rateLimited = createMediaFixture({
    rateLimit: async (input) => {
      rateCalls.push(input);
      return { allowed: false, retryAfterSeconds: 30 };
    },
  });
  const rateResponse = await rateLimited.server.dispatch(
    mediaRequest("POST", "/uploads/intent", {
      fileName: "photo.png",
      kind: "image",
      mimeType: "image/png",
      size: 4,
    }),
  );
  assert.equal(rateResponse.status, 429);
  assert.equal(rateResponse.headers.get("retry-after"), "30");
  assert.match(rateResponse.headers.get("cache-control"), /no-store/);
  assert.equal((await rateResponse.json()).error.code, "RATE_LIMITED");
  assert.equal(rateCalls[0].action, "upload:create");
  assert.equal(rateCalls[0].context.tenantId, "tenant-a");
  assert.equal(rateLimited.calls.createUploadIntent, 0);

  const unavailableLimiter = createMediaFixture({
    rateLimit: async () => {
      throw new Error("private limiter details");
    },
  });
  const limiterFailure = await unavailableLimiter.server.dispatch(
    mediaRequest("POST", "/uploads/intent", {
      fileName: "photo.png",
      kind: "image",
      mimeType: "image/png",
      size: 4,
    }),
  );
  assert.equal(limiterFailure.status, 503);
  assert.doesNotMatch(await limiterFailure.text(), /private limiter details/);
  assert.equal(unavailableLimiter.calls.createUploadIntent, 0);

  const quotaDenied = createMediaFixture({
    assertTenantQuota: async (input) => {
      assert.equal(input.action, "upload:create");
      assert.equal(input.context.tenantId, "tenant-a");
      assert.equal(input.requestedBytes, 4);
      return false;
    },
  });
  const quotaResponse = await quotaDenied.server.dispatch(
    mediaRequest("POST", "/uploads/intent", {
      fileName: "photo.png",
      kind: "image",
      mimeType: "image/png",
      size: 4,
    }),
  );
  assert.equal(quotaResponse.status, 413);
  assert.equal((await quotaResponse.json()).error.code, "QUOTA_EXCEEDED");
  assert.equal(quotaDenied.calls.createUploadIntent, 0);
});

test("readiness checks report unverified or unavailable dependencies without leaking details", async () => {
  const unverified = createMediaFixture({
    readiness: {
      metadataStorage: async () => {},
    },
  });
  const unverifiedResult = await unverified.server.readiness();
  assert.equal(unverifiedResult.ready, false);
  assert.equal(unverifiedResult.dependencies.objectStorage, "unverified");

  const failing = createMediaFixture({
    readiness: {
      metadataStorage: async () => {},
      objectStorage: async () => {
        throw new Error("provider secret details");
      },
    },
  });
  const response = await failing.server.dispatch(mediaRequest("GET", "/health"));
  assert.equal(response.status, 503);
  assert.match(response.headers.get("cache-control"), /no-store/);
  assert.doesNotMatch(await response.text(), /provider secret details/);

  const calls = [];
  const processing = createMediaFixture({
    processing: { ready: Promise.resolve(), enqueue: async () => ({}) },
    resolveProcessingProfiles: async () => [],
    readiness: {
      metadataStorage: async () => calls.push("metadata"),
      objectStorage: async () => calls.push("object"),
      queue: async () => calls.push("queue"),
      processor: async () => calls.push("processor"),
    },
  });
  const readyResponse = await processing.server.dispatch(
    mediaRequest("GET", "/health"),
  );
  assert.equal(readyResponse.status, 200);
  assert.deepEqual(calls, ["metadata", "object", "queue", "processor"]);
});

test("cleanup runs expired-upload cleanup and configured lifecycle hooks", async () => {
  const hookCalls = [];
  const fixture = createMediaFixture({
    cleanup: {
      storage: async ({ batchSize }) => {
        hookCalls.push(["storage", batchSize]);
        return { examined: 2, cleaned: 1, failed: 1 };
      },
      objectStorage: async () => {
        hookCalls.push(["objectStorage"]);
        return { examined: 1, cleaned: 1, failed: 0 };
      },
      queue: async () => {
        hookCalls.push(["queue"]);
        return { examined: 3, cleaned: 2, failed: 0 };
      },
      processor: async () => {
        hookCalls.push(["processor"]);
        return { examined: 0, cleaned: 0, failed: 0 };
      },
    },
  });
  const intentResponse = await fixture.server.dispatch(
    mediaRequest("POST", "/uploads/intent", {
      fileName: "photo.png",
      kind: "image",
      mimeType: "image/png",
      size: 4,
    }),
  );
  const { intent } = await intentResponse.json();
  const record = fixture.sessions.get(intent.id);
  record.session = {
    ...record.session,
    state: "expired",
    expiresAt: new Date(Date.now() - 1_000),
  };

  const result = await fixture.server.cleanup({ batchSize: 10 });
  assert.deepEqual(result.expiredUploads, {
    examined: 1,
    aborted: 1,
    failed: 0,
  });
  assert.equal(result.storage.cleaned, 1);
  assert.equal(fixture.calls.expiredSessionLists, 1);
  assert.deepEqual(hookCalls, [
    ["storage", 10],
    ["objectStorage"],
    ["queue"],
    ["processor"],
  ]);
});
