import test from "node:test";
import assert from "node:assert/strict";

import { createNextMediaHandler, createNextMediaRouteHandlers } from "../dist/media/next/index.js";
import { createTanStackMediaHandler, createTanStackMediaRouteHandlers } from "../dist/media/tanstack/index.js";
import {
  createMediaFixture,
  mediaRequest,
} from "./media-fixtures.mjs";

test("Next adapter reuses the media route map and dispatches Requests", async () => {
  const fixture = createMediaFixture();
  const options = { media: fixture.server };
  const routes = createNextMediaRouteHandlers(options);
  assert.equal(routes, fixture.server.routes);

  const handler = createNextMediaHandler(options);
  const response = await handler.GET(mediaRequest("GET", "/assets"));
  assert.equal(response.status, 200);
  assert.match(response.headers.get("cache-control"), /no-store/);

  const notFound = await handler.GET(mediaRequest("GET", "/unknown"));
  assert.equal(notFound.status, 404);
  assert.match(notFound.headers.get("cache-control"), /no-store/);
});

test("TanStack adapter dispatches media requests through the same server", async () => {
  const fixture = createMediaFixture();
  const options = { media: fixture.server };
  const routes = createTanStackMediaRouteHandlers(options);
  assert.equal(routes, fixture.server.routes);

  const handler = createTanStackMediaHandler(options);
  const response = await handler(mediaRequest("POST", "/folders", { name: "Photos" }));
  assert.equal(response.status, 201);
  assert.equal((await response.json()).folder.name, "Photos");
  assert.equal(fixture.calls.folderCreate, 1);
});
