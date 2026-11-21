import test from "node:test";
import assert from "node:assert/strict";

const { CmsClientError, CmsInvalidationError, createCmsClient } =
  await import("../dist/cms/client/index.js");

const jsonResponse = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

test("CMS client uses no-store same-origin requests and invalidates after mutations", async () => {
  const requests = [];
  const invalidations = [];
  const client = createCmsClient({
    basePath: "/tenant/api/cms",
    fetch: async (url, init) => {
      requests.push({ url: String(url), init });
      return jsonResponse({
        entry: {
          id: "entry-1",
          tenantId: "tenant-a",
          contentTypeSlug: "article",
          locale: "en-US",
          fields: { title: "Draft" },
          revision: 3,
        },
      });
    },
    onInvalidate: (keys) => invalidations.push(keys),
  });

  const entry = await client.saveDraft(
    "entry-1",
    {
      expectedRevision: 2,
      fields: { title: "Draft" },
    },
  );

  assert.equal(entry.id, "entry-1");
  assert.equal(requests[0].url, "/tenant/api/cms/admin/entries/entry-1");
  assert.equal(requests[0].init.method, "PATCH");
  assert.equal(requests[0].init.cache, "no-store");
  assert.equal(requests[0].init.credentials, "same-origin");
  assert.deepEqual(JSON.parse(requests[0].init.body), {
    expectedRevision: 2,
    fields: { title: "Draft" },
  });
  assert.deepEqual(invalidations, [[
    { type: "admin-entries", entryId: "entry-1" },
    { type: "revisions", entryId: "entry-1" },
    { type: "relationships", contentType: "*", fieldPath: "*" },
  ]]);
});

test("public client methods target only public read routes", async () => {
  const requests = [];
  const client = createCmsClient({
    fetch: async (url, init) => {
      requests.push({ url: String(url), init });
      return jsonResponse({
        entry: {
          id: "entry-1",
          contentType: "article",
          locale: "en-US",
          slug: "hello",
          revision: 4,
          schemaVersion: 1,
          fields: { title: "Published" },
          publishedAt: "2026-01-01T00:00:00.000Z",
        },
      });
    },
  });

  const entry = await client.findPublishedEntry({
    contentType: "article",
    locale: "en-US",
    slug: "hello",
    fallbackLocales: ["fr-FR"],
  });

  assert.equal(entry.fields.title, "Published");
  assert.match(requests[0].url, /^\/api\/cms\/public\/entries\/by-slug\//);
  assert.match(requests[0].url, /fallbackLocales=%5B%22fr-FR%22%5D/);
  assert.equal(requests[0].init.cache, "no-store");
});

test("stale revision conflicts are not retried or reported as successful", async () => {
  const client = createCmsClient({
    fetch: async () => jsonResponse({
      error: { code: "CONFLICT", message: "Expected revision did not match." },
    }, 409),
  });

  await assert.rejects(
    client.saveDraft("entry-1", {
      expectedRevision: 1,
      fields: { title: "Changed" },
    }),
    (error) =>
      error instanceof CmsClientError &&
      error.status === 409 &&
      error.code === "CONFLICT" &&
      !error.retryable,
  );
});

test("query invalidation failures report that the mutation already committed", async () => {
  const client = createCmsClient({
    fetch: async () => jsonResponse({ entry: { id: "entry-1" } }),
    onInvalidate: async () => {
      throw new Error("cache unavailable");
    },
  });

  await assert.rejects(
    client.publish("entry-1", { expectedRevision: 2 }),
    (error) =>
      error instanceof CmsInvalidationError &&
      error.mutationCommitted === true &&
      error.invalidations.some((key) => key.type === "public-entries"),
  );
});
