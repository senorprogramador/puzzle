import test from "node:test";
import assert from "node:assert/strict";

const {
  CmsClientError,
  CmsInvalidationError,
  createCmsClient,
} = await import("../dist/cms/client/index.js");

const jsonResponse = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

test("CMS client sends serializable DTOs without request identity and invalidates after mutations", async () => {
  const requests = [];
  const invalidations = [];
  const client = createCmsClient({
    basePath: "/tenant/api/cms",
    fetch: async (url, init) => {
      requests.push({ url: String(url), init });
      return jsonResponse({
        document: {
          id: "document-1",
          title: "First story",
          createdAt: "2026-01-01T00:00:00.000Z",
        },
      });
    },
    onInvalidate: (keys) => invalidations.push(keys),
  });

  const document = await client.collection("stories").create(
    { title: "First story" },
    { slug: "first-story", locale: "en-US" },
  );

  assert.equal(document.id, "document-1");
  assert.equal(typeof document.createdAt, "string");
  assert.doesNotThrow(() => JSON.stringify(document));
  assert.equal(requests[0].url, "/tenant/api/cms/admin/collections/stories");
  assert.equal(requests[0].init.method, "POST");
  assert.equal(requests[0].init.cache, "no-store");
  assert.equal(requests[0].init.credentials, "same-origin");
  assert.deepEqual(JSON.parse(requests[0].init.body), {
    data: { title: "First story" },
    slug: "first-story",
    locale: "en-US",
  });
  assert.equal("tenantId" in JSON.parse(requests[0].init.body), false);
  assert.equal("actor" in JSON.parse(requests[0].init.body), false);
  await assert.rejects(
    client.collection("stories").create({
      title: "Spoofed",
      tenantId: "attacker-tenant",
    }),
    /resolved by the server/,
  );
  assert.equal(requests.length, 1);
  assert.deepEqual(invalidations, [[
    { type: "admin-entries", contentType: "stories", locale: "en-US" },
    { type: "relationships", contentType: "*", fieldPath: "*" },
  ]]);
});

test("public client methods target only public read routes and preserve no-store", async () => {
  const requests = [];
  const client = createCmsClient({
    fetch: async (url, init) => {
      requests.push({ url: String(url), init });
      return jsonResponse({
        document: {
          id: "document-1",
          title: "Published",
          slug: "hello",
          locale: "en-US",
          publishedAt: "2026-01-01T00:00:00.000Z",
        },
      });
    },
  });

  const document = await client.collection("stories").public.findBySlug(
    "hello",
    { locale: "en-US", fallbackLocales: ["fr-FR"] },
  );

  assert.equal(document.title, "Published");
  assert.equal(
    requests[0].url,
    "/api/cms/public/collections/stories/by-slug/hello?locale=en-US&fallbackLocales=%5B%22fr-FR%22%5D",
  );
  assert.equal(requests[0].init.cache, "no-store");
  assert.equal(requests[0].init.method, undefined);
});

test("lifecycle client methods preserve revision tokens and invalidate published data", async () => {
  const requests = [];
  const invalidations = [];
  const client = createCmsClient({
    fetch: async (url, init) => {
      requests.push({ url: String(url), init });
      return jsonResponse({
        document: {
          id: "document-1",
          title: "Published",
          revision: 5,
          status: "published",
          publishedAt: "2026-01-01T00:00:00.000Z",
        },
      });
    },
    onInvalidate: (keys) => invalidations.push(keys),
  });

  await client.collection("stories").publish("document-1", {
    expectedRevision: 4,
  });

  assert.equal(
    requests[0].url,
    "/api/cms/admin/collections/stories/document-1/publish",
  );
  assert.equal(requests[0].init.method, "POST");
  assert.deepEqual(JSON.parse(requests[0].init.body), {
    expectedRevision: 4,
  });
  assert.ok(invalidations[0].some((key) => key.type === "public-entries"));
  assert.ok(invalidations[0].some((key) => key.type === "revisions"));
});

test("localized client methods keep locale in DTO options and variants query", async () => {
  const requests = [];
  const client = createCmsClient({
    fetch: async (url, init) => {
      requests.push({ url: String(url), init });
      return jsonResponse({
        document: { id: "document-fr", locale: "fr-FR", title: "Bonjour" },
        page: { items: [], nextCursor: null, hasNextPage: false, page: 1, limit: 10 },
      });
    },
  });

  await client.collection("stories").createTranslation(
    "document-en",
    { title: "Bonjour" },
    { locale: "fr-FR" },
  );
  await client.collection("stories").listLocaleVariants("document-en", { limit: 10 });

  assert.equal(
    requests[0].url,
    "/api/cms/admin/collections/stories/document-en/translations",
  );
  assert.deepEqual(JSON.parse(requests[0].init.body), {
    data: { title: "Bonjour" },
    locale: "fr-FR",
  });
  assert.equal(
    requests[1].url,
    "/api/cms/admin/collections/stories/document-en/translations?limit=10",
  );
});

test("outbox client lists DTOs and acknowledges events with revision tokens", async () => {
  const requests = [];
  const invalidations = [];
  const client = createCmsClient({
    fetch: async (url, init) => {
      requests.push({ url: String(url), init });
      return requests.length === 1
        ? jsonResponse({
            items: [{
              id: "event-1",
              resource: "entry",
              resourceId: "document-1",
              action: "entry:create",
              occurredAt: "2026-01-01T00:00:00.000Z",
              createdAt: "2026-01-01T00:00:00.000Z",
              updatedAt: "2026-01-01T00:00:00.000Z",
              revision: 1,
            }],
            nextCursor: null,
            hasNextPage: false,
          })
        : jsonResponse({ acknowledged: true });
    },
    onInvalidate: (keys) => invalidations.push(keys),
  });

  const page = await client.listChangeEvents({ first: 25 });
  assert.equal(page.items[0].action, "entry:create");
  await client.acknowledgeChangeEvent("event-1", 1);
  assert.equal(requests[0].url, "/api/cms/admin/change-events?first=25");
  assert.equal(requests[1].url, "/api/cms/admin/change-events/event-1/ack");
  assert.deepEqual(JSON.parse(requests[1].init.body), { expectedRevision: 1 });
  assert.deepEqual(invalidations, [[{ type: "change-events" }]]);
});

test("CMS conflicts are not retried or reported as successful", async () => {
  const client = createCmsClient({
    fetch: async () => jsonResponse({
      error: { code: "CONFLICT", message: "The document changed." },
    }, 409),
  });

  await assert.rejects(
    client.collection("stories").update(
      "document-1",
      { title: "Changed" },
      { expectedRevision: 2 },
    ),
    (error) =>
      error instanceof CmsClientError &&
      error.status === 409 &&
      error.code === "CONFLICT" &&
      !error.retryable,
  );
});

test("query invalidation failures report that the mutation already committed", async () => {
  const client = createCmsClient({
    fetch: async () => jsonResponse({ document: { id: "document-1" } }),
    onInvalidate: async () => {
      throw new Error("cache unavailable");
    },
  });

  await assert.rejects(
    client.collection("stories").update(
      "document-1",
      { title: "Changed" },
      { expectedRevision: 2 },
    ),
    (error) =>
      error instanceof CmsInvalidationError &&
      error.mutationCommitted === true &&
      error.invalidations.some((key) => key.type === "admin-entries"),
  );
});

test("singleton client dispatches without exposing arbitrary document ids", async () => {
  const requests = [];
  const client = createCmsClient({
    fetch: async (url, init) => {
      requests.push({ url: String(url), init });
      return jsonResponse({ document: { id: "singleton", name: "Puzzle" } });
    },
  });

  await client.singleton("settings").update(
    { name: "Puzzle" },
    { expectedRevision: 1 },
  );

  assert.equal(requests[0].url, "/api/cms/admin/collections/settings");
  assert.equal(requests[0].init.method, "PATCH");
  assert.deepEqual(JSON.parse(requests[0].init.body), {
    data: { name: "Puzzle" },
    expectedRevision: 1,
  });
});
