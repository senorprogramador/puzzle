import test from "node:test";
import assert from "node:assert/strict";

import { cmsRequest, createCmsFixture, json } from "./cms-fixtures.mjs";

const nextModule = await import("../dist/cms/next/index.js");
const tanstackModule = await import("../dist/cms/tanstack/index.js");

test("Next adapter exposes configured CMS routes and dispatches Requests", async () => {
  const fixture = await createCmsFixture();
  const options = { cms: fixture.server };
  const routes = nextModule.createNextCmsRouteHandlers(options);
  assert.equal(routes, fixture.server.routes);
  assert.ok("/api/cms/admin/collections/article" in routes);
  assert.equal("/api/cms/admin/content-types" in routes, false);

  const handler = nextModule.createNextCmsHandler(options);
  const response = await handler.GET(cmsRequest("GET", "/admin/collections/article"));
  assert.equal(response.status, 200);
  assert.match(response.headers.get("cache-control"), /no-store/);
  assert.deepEqual((await json(response)).page.items, []);

  const notFound = await handler.GET(cmsRequest("GET", "/admin/content-types"));
  assert.equal(notFound.status, 404);
  assert.match(notFound.headers.get("cache-control"), /no-store/);
});

test("TanStack adapter dispatches Requests through the configured CMS server", async () => {
  const fixture = await createCmsFixture();
  const options = { cms: fixture.server };
  const routes = tanstackModule.createTanStackCmsRouteHandlers(options);
  assert.equal(routes, fixture.server.routes);

  const handler = tanstackModule.createTanStackCmsHandler(options);
  const response = await handler(cmsRequest("GET", "/public/collections/article"));
  assert.equal(response.status, 200);
  assert.deepEqual((await json(response)).page.items, []);
  assert.match(response.headers.get("cache-control"), /no-store/);
});
