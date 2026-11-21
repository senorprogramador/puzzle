import { createFileRoute } from "@tanstack/react-router";
import { createCmsMediaBrowserFixture } from "../../../backend.mjs";

let fixture;
const dispatch = async ({ request }) => {
  fixture ??= createCmsMediaBrowserFixture("tanstack");
  return (await fixture)(request);
};

export const Route = createFileRoute("/api/$")({
  server: { handlers: { GET: dispatch, POST: dispatch, PATCH: dispatch, DELETE: dispatch, PUT: dispatch } },
});
