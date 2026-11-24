import test from "node:test";
import assert from "node:assert/strict";

import { cmsRequest, createCmsFixture, json } from "./cms-fixtures.mjs";

test("webhook routes stay opt-in and keep host secrets and tenant data server-side", async () => {
  const disabled = await createCmsFixture();
  const unavailable = await disabled.server.dispatch(
    cmsRequest("GET", "/admin/webhooks"),
  );
  assert.equal(unavailable.status, 404);
  assert.match(unavailable.headers.get("cache-control"), /no-store/);

  const secretRequests = [];
  const secret = new Uint8Array(32).fill(3);
  const webhooks = {
    resolveSecretRef: async ({ context, purpose }) => {
      secretRequests.push({ purpose, tenantId: context.tenantId });
      return purpose === "create"
        ? "private-vault-reference"
        : "rotated-vault-reference";
    },
    resolveSecret: async () => secret,
    transport: { send: async () => ({ status: 204 }) },
  };
  const fixture = await createCmsFixture({ webhooks });
  const { createCmsClient } = await import("../dist/cms/client/index.js");
  const invalidations = [];
  const client = createCmsClient({
    fetch: (path, init) =>
      fixture.server.dispatch(new Request(`https://example.test${path}`, init)),
    onInvalidate: (keys) => invalidations.push(...keys),
  });
  const input = {
    endpoint: "https://hooks.example.test/events",
    events: ["entry:create"],
    enabled: true,
  };

  fixture.setAuthorization(false);
  const denied = await fixture.server.dispatch(
    cmsRequest("POST", "/admin/webhooks", input),
  );
  assert.equal(denied.status, 403);
  assert.equal(secretRequests.length, 0);

  fixture.setAuthorization(true);
  const injected = await fixture.server.dispatch(
    cmsRequest("POST", "/admin/webhooks", {
      ...input,
      secretRef: "attacker-selected-reference",
    }),
  );
  assert.equal(injected.status, 400);
  assert.equal(secretRequests.length, 0);

  const subscription = await client.createWebhookSubscription(input);
  assert.equal(subscription.secretConfigured, true);
  assert.equal("secretRef" in subscription, false);
  assert.equal("tenantId" in subscription, false);
  assert.equal(secretRequests[0].tenantId, "tenant-a");
  assert.ok(invalidations.some((key) => key.type === "webhook-subscriptions"));

  const response = await fixture.server.dispatch(
    cmsRequest("GET", `/admin/webhooks/${subscription.id}`),
  );
  assert.equal(response.status, 200);
  assert.match(response.headers.get("cache-control"), /no-store/);
  assert.doesNotMatch(await response.text(), /private-vault-reference/);
  assert.equal((await client.listWebhookDeliveries(subscription.id)).length, 0);

  const stale = await fixture.server.dispatch(
    cmsRequest("PATCH", `/admin/webhooks/${subscription.id}`, {
      ...input,
      rotateSecret: true,
      expectedRevision: subscription.revision + 1,
    }),
  );
  assert.equal(stale.status, 409);
  assert.equal(secretRequests.length, 1);

  const updated = await client.updateWebhookSubscription(subscription.id, {
    ...input,
    rotateSecret: true,
    expectedRevision: subscription.revision,
  });
  assert.equal(updated.revision, subscription.revision + 1);
  assert.equal(secretRequests[1].purpose, "rotate");
  assert.doesNotMatch(JSON.stringify(updated), /rotated-vault-reference/);
  assert.ok(invalidations.some((key) => key.type === "webhook-subscriptions"));

  fixture.setContext({ tenantId: "tenant-b", actor: { id: "editor-b" } });
  assert.deepEqual(await client.listWebhookSubscriptions(), []);
  const foreign = await fixture.server.dispatch(
    cmsRequest("GET", `/admin/webhooks/${subscription.id}`),
  );
  assert.equal(foreign.status, 404);
  assert.equal((await json(foreign)).error.code, "NOT_FOUND");
});

test("invalid or failing host secret selectors fail closed without leaking details", async () => {
  for (const resolveSecretRef of [
    async () => " ",
    async () => {
      throw new Error("private secret store detail");
    },
  ]) {
    const fixture = await createCmsFixture({
      webhooks: {
        resolveSecretRef,
        resolveSecret: async () => new Uint8Array(32).fill(1),
        transport: { send: async () => ({ status: 204 }) },
      },
    });
    const response = await fixture.server.dispatch(
      cmsRequest("POST", "/admin/webhooks", {
        endpoint: "https://hooks.example.test/events",
        events: ["entry:create"],
        enabled: true,
      }),
    );
    assert.equal(response.status, 500);
    assert.doesNotMatch(
      await response.text(),
      /private secret store detail|reference resolver/,
    );
    const list = await fixture.server.dispatch(
      cmsRequest("GET", "/admin/webhooks"),
    );
    assert.deepEqual((await json(list)).subscriptions, []);
  }
});
