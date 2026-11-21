import assert from "node:assert/strict";
import test from "node:test";

import { cmsRequest, createCmsFixture } from "./cms-fixtures.mjs";
import { createMediaFixture, mediaRequest } from "./media-fixtures.mjs";

test("CMS and media enforce tenant, readiness, published usage, and permanent deletion boundaries", async () => {
  const media = createMediaFixture();
  const cms = await createCmsFixture({
    mediaReferenceValidator: {
      async assertCanReference({ tenantId, assetId }) {
        const asset = media.assetsById.get(assetId);
        if (!asset || asset.tenantId !== tenantId || asset.status !== "ready") {
          throw new Error("Asset is unavailable.");
        }
      },
    },
  });
  const { CmsService } = await import("@puzzle-ui/cms");
  const usages = new CmsService({
    storage: cms.storage,
    accessPolicy: async () => true,
  });
  media.setDeletionGuard(async ({ asset, context }) => {
    const records = await usages.listMediaUsages({
      tenantId: context.tenantId,
      actor: { id: context.actorId },
      assetId: asset.id,
    });
    return records.length === 0;
  });

  const intentResponse = await media.server.dispatch(
    mediaRequest("POST", "/uploads/intent", {
      fileName: "cover.png",
      kind: "image",
      mimeType: "image/png",
      size: 4,
    }),
  );
  assert.equal(intentResponse.status, 201);
  const { intent } = await intentResponse.json();
  const completion = await media.server.dispatch(
    mediaRequest("POST", `/uploads/${intent.id}/complete`, {
      originalName: "cover.png",
      kind: "image",
      width: 2,
      height: 2,
    }),
  );
  assert.equal(completion.status, 200);
  const { asset } = await completion.json();
  assert.equal(asset.status, "uploaded");

  const typeResponse = await cms.server.dispatch(
    cmsRequest("POST", "/admin/content-types", {
      definition: {
        slug: "story",
        name: "Story",
        version: 1,
        fields: [
          { key: "title", type: "text", label: "Title", required: true },
          { key: "cover", type: "media", label: "Cover" },
        ],
      },
    }),
  );
  assert.equal(typeResponse.status, 201);
  const createStory = (cover) =>
    cms.server.dispatch(
      cmsRequest("POST", "/admin/entries", {
        contentType: "story",
        locale: "en-US",
        slug: "story",
        fields: { title: "Story", cover },
      }),
    );

  assert.equal((await createStory(asset.id)).status, 400);
  media.addAsset({ id: "foreign-asset", tenantId: "tenant-b", status: "ready" });
  assert.equal((await createStory("foreign-asset")).status, 400);
  media.assetsById.set(asset.id, { ...media.assetsById.get(asset.id), status: "ready" });
  const draftResponse = await createStory(asset.id);
  assert.equal(draftResponse.status, 201);
  const { entry: draft } = await draftResponse.json();
  const removeAsset = () =>
    media.server.dispatch(
      mediaRequest("DELETE", `/assets/${asset.id}/permanent`, {
        expectedRevision: asset.revision,
      }),
    );
  assert.equal((await removeAsset()).status, 403);
  assert.equal(media.calls.objectDelete, 0);

  const publication = await cms.server.dispatch(
    cmsRequest("POST", `/admin/entries/${draft.id}/publish`, {
      expectedRevision: draft.revision,
    }),
  );
  assert.equal(publication.status, 200);
  const { entry: published } = await publication.json();
  const save = await cms.server.dispatch(
    cmsRequest("PATCH", `/admin/entries/${draft.id}`, {
      expectedRevision: published.revision,
      slug: "story",
      fields: { title: "Changed draft" },
    }),
  );
  assert.equal(save.status, 200, await save.clone().text());
  const { entry: changed } = await save.json();
  const publicResponse = await cms.server.dispatch(
    cmsRequest("GET", `/public/entries/${draft.id}`),
  );
  assert.equal(publicResponse.status, 200);
  assert.equal((await publicResponse.json()).entry.fields.cover, asset.id);
  assert.equal((await removeAsset()).status, 403);

  const unpublish = await cms.server.dispatch(
    cmsRequest("POST", `/admin/entries/${draft.id}/unpublish`, {
      expectedRevision: changed.revision,
    }),
  );
  assert.equal(unpublish.status, 200);
  assert.equal((await removeAsset()).status, 200);
  assert.equal(media.calls.objectDelete, 1);
});
