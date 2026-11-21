import test from "node:test";
import assert from "node:assert/strict";

import { cmsRequest, createCmsFixture, json } from "./cms-fixtures.mjs";

const nextModule = await import("../dist/cms/next/index.js");
const tanstackModule = await import("../dist/cms/tanstack/index.js");

test("Next adapter exports CMS route maps and dispatches Request handlers", async () => {
  const fixture = await createCmsFixture();
  const options = { cms: fixture.server };
  const routes = nextModule.createNextCmsRouteHandlers(options);
  assert.equal(routes, fixture.server.routes);

  const handler = nextModule.createNextCmsHandler(options);
  const response = await handler.GET(cmsRequest("GET", "/admin/content-types"));
  assert.equal(response.status, 200);
  assert.match(response.headers.get("cache-control"), /no-store/);
  assert.deepEqual((await json(response)).contentTypes, []);

  const notFound = await handler.GET(cmsRequest("GET", "/unknown"));
  assert.equal(notFound.status, 404);
  assert.match(notFound.headers.get("cache-control"), /no-store/);
});

test("TanStack adapter dispatches Requests through the same CMS server", async () => {
  const fixture = await createCmsFixture();
  const options = { cms: fixture.server };
  const routes = tanstackModule.createTanStackCmsRouteHandlers(options);
  assert.equal(routes, fixture.server.routes);

  const handler = tanstackModule.createTanStackCmsHandler(options);
  const response = await handler(cmsRequest("GET", "/admin/content-types"));
  assert.equal(response.status, 200);
  assert.deepEqual((await json(response)).contentTypes, []);
});
