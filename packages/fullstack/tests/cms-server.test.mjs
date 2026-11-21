import test from "node:test";
import assert from "node:assert/strict";

import {
  articleDefinition,
  cmsRequest,
  createCmsFixture,
  json,
} from "./cms-fixtures.mjs";

const registerArticle = async (server) => {
  const response = await server.dispatch(
    cmsRequest("POST", "/admin/content-types", {
      definition: articleDefinition(),
      tenantId: "attacker-tenant",
      actor: { id: "attacker" },
    }),
  );
  assert.equal(response.status, 201);
  return json(response);
};

const createArticle = async (server, fields = {}) => {
  const response = await server.dispatch(
    cmsRequest("POST", "/admin/entries", {
      contentType: "article",
      locale: "en-US",
      fields: {
        title: "Draft title",
        path: "draft-title",
        secretDraft: "draft secret",
        ...fields,
      },
      tenantId: "attacker-tenant",
      actor: { id: "attacker" },
    }),
  );
  assert.equal(response.status, 201);
  return json(response);
};

test("CMS endpoints resolve trusted context, fail closed, and set no-store headers", async () => {
  const fixture = await createCmsFixture({ context: { tenantId: "tenant-a", actor: null } });
  const response = await fixture.server.dispatch(
    cmsRequest("GET", "/admin/content-types"),
  );

  assert.equal(response.status, 401);
  assert.match(response.headers.get("cache-control"), /no-store/);
  assert.equal(fixture.calls.authorization.length, 0);

  fixture.setContext(null);
  const missingContext = await fixture.server.dispatch(
    cmsRequest("GET", "/public/entries?contentType=article"),
  );
  assert.equal(missingContext.status, 401);
  assert.match(missingContext.headers.get("cache-control"), /no-store/);
});

test("public reads project only immutable published fields while admin reads expose drafts", async () => {
  const fixture = await createCmsFixture();
  await registerArticle(fixture.server);
  const { entry: draft } = await createArticle(fixture.server);

  const unpublished = await fixture.server.dispatch(
    cmsRequest("GET", `/public/entries/${draft.id}`),
  );
  assert.equal(unpublished.status, 404);
  assert.match(unpublished.headers.get("cache-control"), /no-store/);

  const publish = await fixture.server.dispatch(
    cmsRequest("POST", `/admin/entries/${draft.id}/publish`, {
      expectedRevision: draft.revision,
    }),
  );
  assert.equal(publish.status, 200);
  const published = (await json(publish)).entry;

  const saveDraft = await fixture.server.dispatch(
    cmsRequest("PATCH", `/admin/entries/${draft.id}`, {
      expectedRevision: published.revision,
      fields: {
        title: "Unpublished edit",
        path: "draft-title",
        secretDraft: "new draft secret",
      },
    }),
  );
  assert.equal(saveDraft.status, 200);
  assert.equal((await json(saveDraft)).entry.fields.title, "Unpublished edit");

  const publicResponse = await fixture.server.dispatch(
    cmsRequest("GET", `/public/entries/${draft.id}`),
  );
  assert.equal(publicResponse.status, 200);
  assert.match(publicResponse.headers.get("cache-control"), /no-store/);
  const publicBody = await json(publicResponse);
  assert.deepEqual(publicBody.entry.fields, {
    title: "Draft title",
    path: "draft-title",
    secretDraft: "draft secret",
  });
  assert.equal("tenantId" in publicBody.entry, false);
  assert.equal("publishedSnapshot" in publicBody.entry, false);
  assert.equal("scheduledAt" in publicBody.entry, false);
  assert.equal(publicBody.entry.status, undefined);

  fixture.setContext({ tenantId: "tenant-a", actor: null });
  const anonymousPublic = await fixture.server.dispatch(
    cmsRequest("GET", `/public/entries/${draft.id}`),
  );
  assert.equal(anonymousPublic.status, 200);
  fixture.setContext({ tenantId: "tenant-a", actor: { id: "editor-a" } });

  const adminResponse = await fixture.server.dispatch(
    cmsRequest("GET", `/admin/entries/${draft.id}`),
  );
  assert.equal(adminResponse.status, 200);
  assert.equal((await json(adminResponse)).entry.fields.title, "Unpublished edit");

  const revisions = await fixture.server.dispatch(
    cmsRequest("GET", `/admin/entries/${draft.id}/revisions?first=20`),
  );
  assert.equal(revisions.status, 200);
  assert.equal((await json(revisions)).revisions.length, 3);
  assert.ok(fixture.calls.authorization.some((call) => call.visibility === "public"));
  assert.ok(fixture.calls.policy.some((call) => call.visibility === "public"));
});

test("public locale lookup and lists return only published projections", async () => {
  const fixture = await createCmsFixture();
  await registerArticle(fixture.server);
  const { entry } = await createArticle(fixture.server);
  const publish = await fixture.server.dispatch(
    cmsRequest("POST", `/admin/entries/${entry.id}/publish`, {
      expectedRevision: entry.revision,
    }),
  );
  const published = (await json(publish)).entry;

  const bySlug = await fixture.server.dispatch(
    cmsRequest("GET", "/public/entries/by-slug/article/en-US/draft-title"),
  );
  assert.equal(bySlug.status, 200);
  assert.equal((await json(bySlug)).entry.fields.title, "Draft title");

  const page = await fixture.server.dispatch(
    cmsRequest("GET", "/public/entries?contentType=article&locale=en-US&first=10"),
  );
  assert.equal(page.status, 200);
  const body = await json(page);
  assert.equal(body.page.items.length, 1);
  assert.equal(body.page.items[0].fields.title, "Draft title");
  assert.equal(body.page.items[0].revision, published.revisionNumber);
  assert.equal("publishedSnapshot" in body.page.items[0], false);
});

test("relationship lookups follow the declared relation scope and remain admin-only", async () => {
  const fixture = await createCmsFixture();
  await registerArticle(fixture.server);
  const { entry } = await createArticle(fixture.server);

  const options = await fixture.server.dispatch(
    cmsRequest(
      "GET",
      "/admin/relationships?contentType=article&fieldPath=related&locale=en-US",
    ),
  );
  assert.equal(options.status, 200);
  const result = await json(options);
  assert.deepEqual(result.targetTypes, ["article"]);
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0].entry.id, entry.id);

  const optionalLocale = await fixture.server.dispatch(
    cmsRequest(
      "GET",
      "/admin/relationships?contentType=article&fieldPath=related",
    ),
  );
  assert.equal(optionalLocale.status, 200);
  const translations = await fixture.server.dispatch(
    cmsRequest("GET", `/admin/entries/${entry.id}/translations?first=10`),
  );
  assert.equal(translations.status, 200);
  assert.deepEqual(
    (await json(translations)).page.items.map((item) => item.id),
    [entry.id],
  );

  const publicOptions = await fixture.server.dispatch(
    cmsRequest("GET", "/admin/relationships?contentType=article&fieldPath=unknown"),
  );
  assert.equal(publicOptions.status, 400);
});

test("CMS mutations use trusted tenant and actor and reject stale revisions", async () => {
  const fixture = await createCmsFixture();
  const { contentType } = await registerArticle(fixture.server);
  assert.equal(contentType.tenantId, "tenant-a");
  const { entry } = await createArticle(fixture.server);
  assert.equal(entry.tenantId, "tenant-a");
  assert.equal(entry.createdBy, "editor-a");

  const staleWrite = await fixture.server.dispatch(
    cmsRequest("PATCH", `/admin/entries/${entry.id}`, {
      expectedRevision: entry.revision + 1,
      fields: { title: "Must not persist", path: "draft-title" },
    }),
  );
  assert.equal(staleWrite.status, 409);
  assert.equal((await json(staleWrite)).error.code, "CONFLICT");

  const current = await fixture.server.dispatch(
    cmsRequest("GET", `/admin/entries/${entry.id}`),
  );
  assert.equal((await json(current)).entry.fields.title, "Draft title");
  assert.ok(fixture.calls.authorization.every((call) => call.tenantId === "tenant-a"));
  assert.ok(fixture.calls.authorization.every((call) => call.actorId === "editor-a"));

  fixture.setContext({ tenantId: "tenant-b", actor: { id: "editor-b" } });
  const crossTenantRead = await fixture.server.dispatch(
    cmsRequest("GET", `/admin/entries/${entry.id}`),
  );
  assert.equal(crossTenantRead.status, 404);
});

test("server requires explicit access policy, tenant/auth resolution, authorization, and scheduler", async () => {
  const fixture = await createCmsFixture();
  const { createCmsServer } = await import("../dist/cms/server/index.js");
  const base = {
    storage: fixture.storage,
    scheduler: fixture.scheduler,
    accessPolicy: async () => true,
    resolveContext: async () => ({ tenantId: "tenant-a", actor: { id: "editor-a" } }),
    authorize: async () => true,
  };

  assert.throws(
    () => createCmsServer({ ...base, accessPolicy: undefined }),
    /accessPolicy/,
  );
  assert.throws(
    () => createCmsServer({ ...base, scheduler: undefined }),
    /scheduler/,
  );
  assert.throws(
    () => createCmsServer({ ...base, resolveContext: undefined }),
    /context resolution/,
  );
  assert.throws(
    () => createCmsServer({ ...base, authorize: undefined }),
    /authorization/,
  );

  fixture.setPolicy(false);
  const denied = await fixture.server.dispatch(
    cmsRequest("POST", "/admin/content-types", {
      definition: articleDefinition(),
    }),
  );
  assert.equal(denied.status, 403);
  assert.equal((await json(denied)).error.code, "PERMISSION_DENIED");
});

test("schedule routes require revision checks and the configured scheduler", async () => {
  const fixture = await createCmsFixture();
  await registerArticle(fixture.server);
  const { entry } = await createArticle(fixture.server);

  const response = await fixture.server.dispatch(
    cmsRequest("POST", `/admin/entries/${entry.id}/schedule`, {
      expectedRevision: entry.revision,
      publishAt: "2026-01-02T00:00:00.000Z",
      timeZone: "UTC",
    }),
  );
  assert.equal(response.status, 200);
  assert.equal((await json(response)).entry.status, "scheduled");
  assert.equal(fixture.calls.scheduled.length, 1);
  assert.equal(fixture.calls.scheduled[0].tenantId, "tenant-a");

  const scheduledJob = fixture.calls.scheduled[0];
  const execution = await fixture.server.dispatch(
    cmsRequest("POST", "/scheduler/publications", {
      publication: {
        ...scheduledJob,
        tenantId: "attacker-tenant",
        id: "forged-job-id",
      },
    }),
  );
  assert.equal(execution.status, 200);
  assert.deepEqual(await json(execution), {
    published: false,
    reason: "not-due",
  });
});

test("a failed scheduler registration leaves the draft unchanged", async () => {
  const fixture = await createCmsFixture();
  await registerArticle(fixture.server);
  const { entry } = await createArticle(fixture.server);
  fixture.scheduler.schedule = async () => {
    throw new Error("Scheduler unavailable");
  };

  const response = await fixture.server.dispatch(
    cmsRequest("POST", `/admin/entries/${entry.id}/schedule`, {
      expectedRevision: entry.revision,
      publishAt: "2026-01-02T00:00:00.000Z",
      timeZone: "UTC",
    }),
  );
  assert.equal(response.status, 503);
  assert.equal((await json(response)).error.code, "SCHEDULER");

  const current = await fixture.server.dispatch(
    cmsRequest("GET", `/admin/entries/${entry.id}`),
  );
  const unchanged = (await json(current)).entry;
  assert.equal(unchanged.status, "draft");
  assert.equal(unchanged.revision, entry.revision);
  assert.equal(unchanged.scheduledAt, null);
  const revisions = await fixture.server.dispatch(
    cmsRequest("GET", `/admin/entries/${entry.id}/revisions`),
  );
  assert.equal((await json(revisions)).revisions.length, 1);
});

test("route and CMS policy denial both prevent revision restoration", async () => {
  const fixture = await createCmsFixture();
  await registerArticle(fixture.server);
  const { entry } = await createArticle(fixture.server);
  const revisions = await fixture.server.dispatch(
    cmsRequest("GET", `/admin/entries/${entry.id}/revisions`),
  );
  const revisionId = (await json(revisions)).revisions[0].id;
  const restore = () => fixture.server.dispatch(
    cmsRequest("POST", `/admin/entries/${entry.id}/restore`, {
      expectedRevision: entry.revision,
      revisionId,
    }),
  );

  fixture.setAuthorization(false);
  assert.equal((await restore()).status, 403);
  fixture.setAuthorization(true);
  fixture.setPolicy(false);
  const policyDenied = await restore();
  assert.equal(policyDenied.status, 403);
  assert.equal((await json(policyDenied)).error.code, "PERMISSION_DENIED");

  fixture.setPolicy(true);
  const current = await fixture.server.dispatch(
    cmsRequest("GET", `/admin/entries/${entry.id}`),
  );
  assert.equal((await json(current)).entry.revision, entry.revision);
  const after = await fixture.server.dispatch(
    cmsRequest("GET", `/admin/entries/${entry.id}/revisions`),
  );
  assert.equal((await json(after)).revisions.length, 1);
});
