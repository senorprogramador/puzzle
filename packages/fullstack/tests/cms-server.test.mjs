import test from "node:test";
import assert from "node:assert/strict";

import {
  cmsRequest,
  createCmsFixture,
  json,
  settingsConfig,
  storyConfig,
} from "./cms-fixtures.mjs";

const createArticle = async (server, data = {}) => {
  const response = await server.dispatch(
    cmsRequest("POST", "/admin/collections/article", {
      data: {
        title: "Draft title",
        path: "draft-title",
        secretDraft: "draft secret",
        ...data,
      },
      slug: "draft-title",
      locale: "en-US",
    }),
  );
  assert.equal(response.status, 201, await response.clone().text());
  return json(response);
};

test("CMS server resolves context per request, ignores no caller identity, and prevents spoofing", async () => {
  const fixture = await createCmsFixture();
  const spoofed = await fixture.server.dispatch(
    cmsRequest("POST", "/admin/collections/article", {
      tenantId: "attacker-tenant",
      actor: { id: "attacker" },
      data: { title: "Spoofed", path: "spoofed" },
    }),
  );

  assert.equal(spoofed.status, 400);
  assert.equal((await json(spoofed)).error.code, "INVALID_REQUEST");
  assert.match(spoofed.headers.get("cache-control"), /no-store/);

  const { document } = await createArticle(fixture.server);
  assert.equal(document.title, "Draft title");
  assert.equal(document.tenantId, undefined);
  assert.equal(document.actor, undefined);
  assert.equal(fixture.calls.authorization[0].tenantId, "tenant-a");
  assert.equal(fixture.calls.authorization[0].actorId, "editor-a");
  assert.ok(fixture.calls.policy.every((call) => call.tenantId === "tenant-a"));

  fixture.setContext({ tenantId: "tenant-b", actor: { id: "editor-b" } });
  const otherTenant = await createArticle(fixture.server, {
    title: "Tenant B",
    path: "tenant-b",
  });
  assert.equal(otherTenant.document.title, "Tenant B");
  assert.equal(fixture.calls.authorization.at(-1).tenantId, "tenant-b");
  assert.equal(fixture.calls.authorization.at(-1).actorId, "editor-b");
});

test("CMS admin routes require authenticated context and independent route authorization", async () => {
  const fixture = await createCmsFixture();
  fixture.setContext({ tenantId: "tenant-a", actor: null });
  const anonymousAdmin = await fixture.server.dispatch(
    cmsRequest("GET", "/admin/collections/article"),
  );
  assert.equal(anonymousAdmin.status, 401);
  assert.match(anonymousAdmin.headers.get("cache-control"), /no-store/);
  assert.equal(fixture.calls.authorization.length, 0);

  fixture.setContext({ tenantId: "tenant-a", actor: { id: "editor-a" } });
  fixture.setAuthorization(false);
  const denied = await fixture.server.dispatch(
    cmsRequest("POST", "/admin/collections/article", {
      permissions: ["entry:create"],
      data: { title: "Denied", path: "denied" },
      locale: "en-US",
    }),
  );
  assert.equal(denied.status, 403);
  assert.equal((await json(denied)).error.code, "FORBIDDEN");
  assert.equal(fixture.calls.authorization.length, 1);
  assert.equal(fixture.calls.policy.length, 0);
});

test("publishing authorization cannot be granted by request permissions", async () => {
  const fixture = await createCmsFixture();
  const { document } = await createArticle(fixture.server);
  const policyCallsBefore = fixture.calls.policy.length;
  fixture.setAuthorization(false);
  const denied = await fixture.server.dispatch(
    cmsRequest("POST", `/admin/collections/article/${document.id}/publish`, {
      expectedRevision: document.revision,
      permissions: ["entry:publish"],
    }),
  );
  assert.equal(denied.status, 403);
  assert.equal((await json(denied)).error.code, "FORBIDDEN");
  assert.equal(fixture.calls.policy.length, policyCallsBefore);
});

test("public CMS reads expose only published snapshots and never draft records", async () => {
  const fixture = await createCmsFixture();
  const { document: draft } = await createArticle(fixture.server);

  const byId = await fixture.server.dispatch(
    cmsRequest("GET", `/public/collections/article/${draft.id}`),
  );
  assert.equal(byId.status, 404);
  assert.match(byId.headers.get("cache-control"), /no-store/);
  assert.doesNotMatch(await byId.text(), /draft secret|Draft title/);

  const bySlug = await fixture.server.dispatch(
    cmsRequest("GET", "/public/collections/article/by-slug/draft-title?locale=en-US"),
  );
  assert.equal(bySlug.status, 404);

  const listing = await fixture.server.dispatch(
    cmsRequest("GET", "/public/collections/article?locale=en-US&visibility=admin"),
  );
  assert.equal(listing.status, 200);
  assert.deepEqual((await json(listing)).page.items, []);
  assert.match(listing.headers.get("cache-control"), /no-store/);

  fixture.setContext({ tenantId: "tenant-a", actor: null });
  const anonymousPublic = await fixture.server.dispatch(
    cmsRequest("GET", "/public/collections/article"),
  );
  assert.equal(anonymousPublic.status, 200);
  assert.equal(fixture.calls.authorization.at(-1).visibility, "public");
});

test("publish, revision restore, unpublish, and immutable snapshots survive code-first routes", async () => {
  const fixture = await createCmsFixture();
  const { document: draft } = await createArticle(fixture.server);

  const stalePublish = await fixture.server.dispatch(
    cmsRequest("POST", `/admin/collections/article/${draft.id}/publish`, {
      expectedRevision: draft.revision + 1,
    }),
  );
  assert.equal(stalePublish.status, 409);

  const publish = await fixture.server.dispatch(
    cmsRequest("POST", `/admin/collections/article/${draft.id}/publish`, {
      expectedRevision: draft.revision,
    }),
  );
  assert.equal(publish.status, 200, await publish.clone().text());
  const published = (await json(publish)).document;

  const edit = await fixture.server.dispatch(
    cmsRequest("PATCH", `/admin/collections/article/${draft.id}`, {
      expectedRevision: published.revision,
      data: {
        title: "Unpublished edit",
        path: "draft-title",
        secretDraft: "new draft secret",
      },
    }),
  );
  assert.equal(edit.status, 200, await edit.clone().text());
  const edited = (await json(edit)).document;

  const publicSnapshot = await fixture.server.dispatch(
    cmsRequest("GET", `/public/collections/article/${draft.id}`),
  );
  assert.equal(publicSnapshot.status, 200);
  const publicDocument = (await json(publicSnapshot)).document;
  assert.equal(publicDocument.title, "Draft title");
  assert.equal(publicDocument.secretDraft, "draft secret");
  assert.equal(publicDocument.status, undefined);
  assert.equal(publicDocument.revision, undefined);
  assert.equal(publicDocument.tenantId, undefined);

  const unpublish = await fixture.server.dispatch(
    cmsRequest("POST", `/admin/collections/article/${draft.id}/unpublish`, {
      expectedRevision: edited.revision,
    }),
  );
  assert.equal(unpublish.status, 200, await unpublish.clone().text());
  const unpublished = (await json(unpublish)).document;
  assert.equal(unpublished.status, "draft");
  assert.equal(
    (
      await fixture.server.dispatch(
        cmsRequest("GET", `/public/collections/article/${draft.id}`),
      )
    ).status,
    404,
  );

  const revisionsResponse = await fixture.server.dispatch(
    cmsRequest("GET", `/admin/collections/article/${draft.id}/revisions?first=20`),
  );
  assert.equal(revisionsResponse.status, 200);
  const { revisions } = await json(revisionsResponse);
  assert.equal(revisions.length, 4);
  assert.equal("tenantId" in revisions[0], false);

  const restored = await fixture.server.dispatch(
    cmsRequest("POST", `/admin/collections/article/${draft.id}/restore`, {
      expectedRevision: unpublished.revision,
      revisionId: revisions.at(-1).id,
    }),
  );
  assert.equal(restored.status, 200, await restored.clone().text());
  assert.equal((await json(restored)).document.title, "Draft title");
});

test("request filters cannot spoof tenant or actor identity", async () => {
  const fixture = await createCmsFixture();
  const response = await fixture.server.dispatch(
    cmsRequest(
      "GET",
      `/admin/collections/article?where=${encodeURIComponent(JSON.stringify({
        tenantId: { equals: "tenant-b" },
      }))}`,
    ),
  );
  assert.equal(response.status, 400);
  assert.equal((await json(response)).error.code, "INVALID_REQUEST");
  assert.equal(fixture.calls.authorization.length, 1);
});

test("scheduling uses the configured host scheduler and binds worker tenant server-side", async () => {
  const fixture = await createCmsFixture();
  const { document } = await createArticle(fixture.server);
  const schedule = await fixture.server.dispatch(
    cmsRequest("POST", `/admin/collections/article/${document.id}/schedule`, {
      expectedRevision: document.revision,
      publishAt: "2026-01-02T00:00:00.000Z",
      timeZone: "UTC",
    }),
  );
  assert.equal(schedule.status, 200, await schedule.clone().text());
  const scheduled = (await json(schedule)).document;
  assert.equal(scheduled.status, "scheduled");
  assert.equal(scheduled.scheduledAt, "2026-01-02T00:00:00.000Z");
  assert.equal(scheduled.scheduledTimeZone, "UTC");
  assert.equal(fixture.calls.scheduled.length, 1);
  assert.equal(fixture.calls.scheduled[0].tenantId, "tenant-a");

  const job = fixture.calls.scheduled[0];
  const execute = () => fixture.server.dispatch(
    cmsRequest("POST", "/scheduler/publications", {
      publication: {
        ...job,
        tenantId: "attacker-tenant",
        id: "forged-job-id",
      },
    }),
  );
  const early = await execute();
  assert.deepEqual(await json(early), { published: false, reason: "not-due" });
  fixture.setNow("2026-01-03T00:00:00.000Z");
  const published = await execute();
  assert.equal(published.status, 200, await published.clone().text());
  assert.equal((await json(published)).published, true);
  assert.equal(fixture.calls.authorization.at(-1).tenantId, "tenant-a");
});

test("scheduler failures do not persist a scheduled document or revision", async () => {
  const fixture = await createCmsFixture();
  const { document } = await createArticle(fixture.server);
  fixture.scheduler.schedule = async () => {
    throw new Error("Scheduler unavailable.");
  };
  const response = await fixture.server.dispatch(
    cmsRequest("POST", `/admin/collections/article/${document.id}/schedule`, {
      expectedRevision: document.revision,
      publishAt: "2026-01-02T00:00:00.000Z",
      timeZone: "UTC",
    }),
  );
  assert.equal(response.status, 503);
  assert.equal((await json(response)).error.code, "SCHEDULER");

  const current = await fixture.server.dispatch(
    cmsRequest("GET", `/admin/collections/article/${document.id}`),
  );
  const unchanged = (await json(current)).document;
  assert.equal(unchanged.status, "draft");
  assert.equal(unchanged.revision, document.revision);
  const revisions = await fixture.server.dispatch(
    cmsRequest("GET", `/admin/collections/article/${document.id}/revisions`),
  );
  assert.equal((await json(revisions)).revisions.length, 1);
});

test("localized translations remain grouped and public reads stay locale-specific", async () => {
  const fixture = await createCmsFixture();
  const baseResponse = await fixture.server.dispatch(
    cmsRequest("POST", "/admin/collections/article", {
      data: { title: "Hello", path: "hello" },
      slug: "hello",
      locale: "en-US",
    }),
  );
  assert.equal(baseResponse.status, 201, await baseResponse.clone().text());
  const { document: base } = await json(baseResponse);

  const translation = await fixture.server.dispatch(
    cmsRequest(
      "POST",
      `/admin/collections/article/${base.id}/translations`,
      {
        data: { title: "Bonjour", path: "bonjour" },
        slug: "bonjour",
        locale: "fr-FR",
      },
    ),
  );
  assert.equal(translation.status, 201, await translation.clone().text());
  const french = (await json(translation)).document;
  assert.equal(french.locale, "fr-FR");

  const variants = await fixture.server.dispatch(
    cmsRequest(
      "GET",
      `/admin/collections/article/${base.id}/translations?limit=10`,
    ),
  );
  assert.equal(variants.status, 200);
  assert.deepEqual(
    (await json(variants)).page.items.map((item) => item.locale).sort(),
    ["en-US", "fr-FR"],
  );

  const publish = await fixture.server.dispatch(
    cmsRequest("POST", `/admin/collections/article/${base.id}/publish`, {
      expectedRevision: base.revision,
    }),
  );
  assert.equal(publish.status, 200);
  const english = await fixture.server.dispatch(
    cmsRequest("GET", "/public/collections/article/by-slug/hello?locale=en-US"),
  );
  assert.equal(english.status, 200);
  assert.equal((await json(english)).document.title, "Hello");
  const unpublishedFrench = await fixture.server.dispatch(
    cmsRequest("GET", "/public/collections/article/by-slug/bonjour?locale=fr-FR"),
  );
  assert.equal(unpublishedFrench.status, 404);

  const publishFrench = await fixture.server.dispatch(
    cmsRequest("POST", `/admin/collections/article/${french.id}/publish`, {
      expectedRevision: french.revision,
    }),
  );
  assert.equal(publishFrench.status, 200);
  const fallback = await fixture.server.dispatch(
    cmsRequest(
      "GET",
      `/public/collections/article/by-slug/bonjour?locale=en-US&fallbackLocales=${encodeURIComponent(JSON.stringify(["fr-FR"]))}`,
    ),
  );
  assert.equal(fallback.status, 200);
  assert.equal((await json(fallback)).document.locale, "fr-FR");
});

test("singleton routes preserve lifecycle and localization without arbitrary IDs", async () => {
  const fixture = await createCmsFixture({ config: settingsConfig() });
  const create = await fixture.server.dispatch(
    cmsRequest("POST", "/admin/collections/settings", {
      data: { siteName: "Puzzle" },
      locale: "en-US",
    }),
  );
  assert.equal(create.status, 201, await create.clone().text());
  const { document } = await json(create);
  assert.equal("/api/cms/admin/collections/settings/:documentId" in fixture.server.routes, false);

  const publish = await fixture.server.dispatch(
    cmsRequest("POST", "/admin/collections/settings/publish", {
      expectedRevision: document.revision,
      locale: "en-US",
    }),
  );
  assert.equal(publish.status, 200, await publish.clone().text());
  const published = (await json(publish)).document;

  const publicSettings = await fixture.server.dispatch(
    cmsRequest("GET", "/public/collections/settings?locale=en-US"),
  );
  assert.equal(publicSettings.status, 200);
  assert.equal((await json(publicSettings)).document.siteName, "Puzzle");

  const translation = await fixture.server.dispatch(
    cmsRequest("POST", "/admin/collections/settings/translations", {
      data: { siteName: "Puzzle FR" },
      locale: "fr-FR",
    }),
  );
  assert.equal(translation.status, 201, await translation.clone().text());
  const variants = await fixture.server.dispatch(
    cmsRequest("GET", "/admin/collections/settings/translations"),
  );
  assert.equal(variants.status, 200);
  assert.deepEqual(
    (await json(variants)).page.items.map((item) => item.locale).sort(),
    ["en-US", "fr-FR"],
  );

  const revisions = await fixture.server.dispatch(
    cmsRequest("GET", "/admin/collections/settings/revisions?locale=en-US"),
  );
  assert.equal(revisions.status, 200);
  assert.ok((await json(revisions)).revisions.length >= 2);
  assert.equal(published.siteName, "Puzzle");
});

test("permanent purge is distinct from soft delete and requires the expected revision", async () => {
  const fixture = await createCmsFixture({ config: storyConfig() });
  const create = await fixture.server.dispatch(
    cmsRequest("POST", "/admin/collections/story", {
      data: { title: "Purge me" },
      slug: "purge-me",
      locale: "en-US",
    }),
  );
  assert.equal(create.status, 201);
  const { document } = await json(create);
  const softDelete = await fixture.server.dispatch(
    cmsRequest("DELETE", `/admin/collections/story/${document.id}`, {
      expectedRevision: document.revision,
    }),
  );
  assert.equal(softDelete.status, 200);
  const deleted = (await json(softDelete)).document;
  assert.equal(deleted.deletedAt !== null, true);

  const stalePurge = await fixture.server.dispatch(
    cmsRequest("DELETE", `/admin/collections/story/${document.id}/permanent`, {
      expectedRevision: deleted.revision - 1,
    }),
  );
  assert.equal(stalePurge.status, 409);

  fixture.setAuthorization(false);
  const deniedPurge = await fixture.server.dispatch(
    cmsRequest("DELETE", `/admin/collections/story/${document.id}/permanent`, {
      expectedRevision: deleted.revision,
    }),
  );
  assert.equal(deniedPurge.status, 403);
  fixture.setAuthorization(true);

  const purge = await fixture.server.dispatch(
    cmsRequest("DELETE", `/admin/collections/story/${document.id}/permanent`, {
      expectedRevision: deleted.revision,
    }),
  );
  assert.equal(purge.status, 200, await purge.clone().text());
  assert.deepEqual(await json(purge), { purged: true });

  const missing = await fixture.server.dispatch(
    cmsRequest("GET", `/admin/collections/story/${document.id}`),
  );
  assert.equal(missing.status, 404);
});

test("permanent purge permits unreferenced targets when schemas can relate to them", async () => {
  const fixture = await createCmsFixture();
  const { document } = await createArticle(fixture.server);
  const deleted = await fixture.server.dispatch(
    cmsRequest("DELETE", `/admin/collections/article/${document.id}`, {
      expectedRevision: document.revision,
    }),
  );
  assert.equal(deleted.status, 200);
  const softDeleted = (await json(deleted)).document;
  const purge = await fixture.server.dispatch(
    cmsRequest("DELETE", `/admin/collections/article/${document.id}/permanent`, {
      expectedRevision: softDeleted.revision,
    }),
  );
  assert.equal(purge.status, 200, await purge.clone().text());
  assert.deepEqual(await json(purge), { purged: true });
  const missing = await fixture.server.dispatch(
    cmsRequest("GET", `/admin/collections/article/${document.id}`),
  );
  assert.equal(missing.status, 404);
});

test("configured outbox routes expose serializable tenant-scoped events and acknowledgments", async () => {
  const fixture = await createCmsFixture({ emitChangeEvents: true });
  await createArticle(fixture.server);
  const events = await fixture.server.dispatch(
    cmsRequest("GET", "/admin/change-events?first=10"),
  );
  assert.equal(events.status, 200, await events.clone().text());
  assert.match(events.headers.get("cache-control"), /no-store/);
  const page = await json(events);
  const event = page.items.find((item) => item.action === "entry:create");
  assert.ok(event);
  assert.equal(event.action, "entry:create");
  assert.equal(typeof event.occurredAt, "string");
  assert.equal("tenantId" in event, false);
  assert.equal("fanoutLeaseUntil" in event, false);

  const ack = await fixture.server.dispatch(
    cmsRequest("POST", `/admin/change-events/${event.id}/ack`, {
      expectedRevision: event.revision,
    }),
  );
  assert.equal(ack.status, 200);
  assert.match(ack.headers.get("cache-control"), /no-store/);
  assert.deepEqual(await json(ack), { acknowledged: true });
  const afterAck = await fixture.server.dispatch(
    cmsRequest("GET", "/admin/change-events"),
  );
  assert.equal(
    (await json(afterAck)).items.some((item) => item.id === event.id),
    false,
  );
});

test("access policy denials and missing context fail closed with no-store errors", async () => {
  const fixture = await createCmsFixture({ policyAllowed: false });
  const denied = await fixture.server.dispatch(
    cmsRequest("GET", "/admin/collections/article"),
  );
  assert.equal(denied.status, 403);
  assert.equal((await json(denied)).error.code, "PERMISSION_DENIED");
  assert.match(denied.headers.get("cache-control"), /no-store/);

  fixture.setPolicy(true);
  fixture.setContext(null);
  const missingContext = await fixture.server.dispatch(
    cmsRequest("GET", "/public/collections/article"),
  );
  assert.equal(missingContext.status, 401);
  assert.match(missingContext.headers.get("cache-control"), /no-store/);
});

test("content-type registration routes are absent from the code-first server", async () => {
  const fixture = await createCmsFixture();
  const get = await fixture.server.dispatch(cmsRequest("GET", "/admin/content-types"));
  const post = await fixture.server.dispatch(
    cmsRequest("POST", "/admin/content-types", { definition: { slug: "attacker" } }),
  );
  const unknownCollection = await fixture.server.dispatch(
    cmsRequest("GET", "/admin/collections/attacker"),
  );
  assert.equal(get.status, 404);
  assert.equal(post.status, 404);
  assert.equal(unknownCollection.status, 404);
  assert.match(get.headers.get("cache-control"), /no-store/);
  assert.match(post.headers.get("cache-control"), /no-store/);
  assert.match(unknownCollection.headers.get("cache-control"), /no-store/);
});
