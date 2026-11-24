import test from "node:test";
import assert from "node:assert/strict";

import { cmsRequest, createCmsFixture, json, storyConfig } from "./cms-fixtures.mjs";

test("CMS media fields validate tenant ownership and readiness through the host callback", async () => {
  const assets = new Map([
    ["uploading-asset", { id: "uploading-asset", tenantId: "tenant-a", status: "uploaded" }],
    ["foreign-asset", { id: "foreign-asset", tenantId: "tenant-b", status: "ready" }],
    ["ready-asset", { id: "ready-asset", tenantId: "tenant-a", status: "ready" }],
  ]);
  const fixture = await createCmsFixture({
    config: storyConfig(),
    mediaReferenceValidator: {
      async assertCanReference({ tenantId, assetId }) {
        const asset = assets.get(assetId);
        if (!asset || asset.tenantId !== tenantId || asset.status !== "ready") {
          throw new Error("Asset is unavailable.");
        }
      },
    },
  });
  const createStory = (media) =>
    fixture.server.dispatch(
      cmsRequest("POST", "/admin/collections/story", {
        data: { title: "Story", media },
        slug: "story",
        locale: "en-US",
      }),
    );

  assert.equal((await createStory("uploading-asset")).status, 400);
  assert.equal((await createStory("foreign-asset")).status, 400);

  const response = await createStory("ready-asset");
  assert.equal(response.status, 201, await response.clone().text());
  const { document } = await json(response);
  assert.equal(document.media, "ready-asset");
  assert.equal(document.tenantId, undefined);

  const publish = await fixture.server.dispatch(
    cmsRequest("POST", `/admin/collections/story/${document.id}/publish`, {
      expectedRevision: document.revision,
    }),
  );
  assert.equal(publish.status, 200, await publish.clone().text());
  const publicDocument = await fixture.server.dispatch(
    cmsRequest("GET", `/public/collections/story/${document.id}`),
  );
  assert.equal(publicDocument.status, 200);
  assert.equal((await json(publicDocument)).document.media, "ready-asset");
});
