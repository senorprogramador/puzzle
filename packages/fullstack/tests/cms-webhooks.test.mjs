import test from "node:test";
import assert from "node:assert/strict";

import { articleDefinition, cmsRequest, createCmsFixture, json } from "./cms-fixtures.mjs";

test("webhook routes are opt-in and keep host secret references out of client responses", async () => {
  const disabled = await createCmsFixture();
  assert.equal((await disabled.server.dispatch(cmsRequest("GET", "/admin/webhooks"))).status, 404);

  const secretRequests = [];
  const { CmsWebhookService, verifyCmsWebhook } = await import("@puzzle-ui/cms");
  let status = 400;
  const secret = new Uint8Array(32).fill(3);
  const verified = [];
  const acceptedDeliveries = new Set();
  const webhooks = {
    resolveSecretRef: async (input) => {
      secretRequests.push({ purpose: input.purpose, tenantId: input.context.tenantId });
      return input.purpose === "create" ? "private-vault-reference" : "rotated-vault-reference";
    },
    resolveSecret: async () => secret,
    transport: {
      send: async (input) => {
        const verification = await verifyCmsWebhook({
          secrets: [secret],
          deliveryId: input.deliveryId,
          signature: input.signature,
          body: status === 400 ? new Uint8Array([...input.body, 0]) : input.body,
          scope: "test-endpoint",
          now: Date.parse("2026-01-01T00:00:00.000Z"),
          replayStore: {
            consume: async ({ deliveryId }) => {
              if (acceptedDeliveries.has(deliveryId)) return false;
              acceptedDeliveries.add(deliveryId);
              return true;
            },
          },
        });
        verified.push(verification);
        return { status: verification.valid ? status : 401 };
      },
    },
  };
  const fixture = await createCmsFixture({ webhooks });
  const { createCmsClient } = await import("../dist/cms/client/index.js");
  const invalidations = [];
  const client = createCmsClient({
    fetch: async (path, init) => fixture.server.dispatch(new Request(`https://example.test${path}`, init)),
    onInvalidate: (keys) => invalidations.push(...keys),
  });
  const input = {
    endpoint: "https://hooks.example.test/events",
    events: ["content-type:create"],
    enabled: true,
  };
  fixture.setPolicy(false);
  const denied = await fixture.server.dispatch(cmsRequest("POST", "/admin/webhooks", input));
  assert.equal(denied.status, 403);
  assert.equal(secretRequests.length, 0);
  fixture.setPolicy(true);
  const injected = await fixture.server.dispatch(cmsRequest("POST", "/admin/webhooks", {
    ...input, secretRef: "attacker-selected-reference",
  }));
  assert.equal(injected.status, 400);
  assert.equal(secretRequests.length, 0);
  const subscription = await client.createWebhookSubscription(input);
  assert.equal(subscription.secretConfigured, true);
  assert.equal("secretRef" in subscription, false);
  assert.equal("tenantId" in subscription, false);
  assert.equal(secretRequests[0].tenantId, "tenant-a");
  assert.ok(invalidations.some((key) => key.type === "webhook-subscriptions"));
  const getResponse = await fixture.server.dispatch(cmsRequest("GET", `/admin/webhooks/${subscription.id}`));
  assert.equal(getResponse.status, 200);
  assert.match(getResponse.headers.get("cache-control"), /no-store/);
  assert.doesNotMatch(await getResponse.text(), /private-vault-reference/);

  const registration = await fixture.server.dispatch(cmsRequest("POST", "/admin/content-types", {
    definition: articleDefinition(),
  }));
  assert.equal(registration.status, 201);
  const { CmsService } = await import("@puzzle-ui/cms");
  let nextId = 0;
  const context = { tenantId: "tenant-a", actor: { id: "worker" } };
  const policy = async () => true;
  const cms = new CmsService({ storage: fixture.storage, accessPolicy: policy });
  const worker = new CmsWebhookService({
    storage: fixture.storage,
    accessPolicy: policy,
    clock: () => new Date("2026-01-01T00:00:00.000Z"),
    idGenerator: () => `worker-${++nextId}`,
    transport: webhooks.transport,
    resolveSecret: webhooks.resolveSecret,
  });
  const event = (await cms.listChangeEvents(context)).items[0];
  await worker.fanout({ ...context, eventId: event.id, expectedRevision: event.revision });
  const failed = await worker.runNext(context);
  assert.equal(failed.status, "failed");
  assert.deepEqual(verified, [{ valid: false, reason: "invalid" }]);
  assert.equal(acceptedDeliveries.size, 0);
  const deliveries = await client.listWebhookDeliveries(subscription.id);
  assert.equal(deliveries.length, 1);
  assert.equal("leaseToken" in deliveries[0], false);
  assert.equal("tenantId" in deliveries[0], false);
  const attempts = await client.listWebhookAttempts(failed.id);
  assert.equal(attempts.length, 1);
  assert.equal(attempts[0].status, 401);
  await client.retryWebhookDelivery(failed.id, failed.revision);
  assert.ok(invalidations.some((key) => key.type === "webhook-deliveries" && key.deliveryId === undefined && key.subscriptionId === undefined));
  status = 204;
  assert.equal((await worker.runNext(context)).status, "delivered");
  assert.deepEqual(verified[1], { valid: true });

  const stale = await fixture.server.dispatch(cmsRequest("PATCH", `/admin/webhooks/${subscription.id}`, {
    ...input, rotateSecret: true, expectedRevision: subscription.revision + 1,
  }));
  assert.equal(stale.status, 409);
  assert.equal(secretRequests.length, 1);
  const updated = await client.updateWebhookSubscription(subscription.id, {
    ...input, rotateSecret: true, expectedRevision: subscription.revision,
  });
  assert.equal(updated.revision, subscription.revision + 1);
  assert.ok(invalidations.some((key) => key.type === "webhook-subscriptions" && key.subscriptionId === undefined));
  assert.equal(secretRequests[1].purpose, "rotate");
  assert.doesNotMatch(JSON.stringify(updated), /rotated-vault-reference/);

  fixture.setContext({ tenantId: "tenant-b", actor: { id: "editor-b" } });
  assert.deepEqual(await client.listWebhookSubscriptions(), []);
  const foreign = await fixture.server.dispatch(cmsRequest("GET", `/admin/webhooks/${subscription.id}`));
  assert.equal(foreign.status, 404);
  assert.equal((await json(foreign)).error.code, "NOT_FOUND");
});

test("invalid or failing host secret selectors fail closed without leaking details", async () => {
  for (const resolveSecretRef of [
    async () => " ",
    async () => { throw new Error("private secret store detail"); },
  ]) {
    const fixture = await createCmsFixture({
      webhooks: {
        resolveSecretRef,
        resolveSecret: async () => new Uint8Array(32).fill(1),
        transport: { send: async () => ({ status: 204 }) },
      },
    });
    const response = await fixture.server.dispatch(cmsRequest("POST", "/admin/webhooks", {
      endpoint: "https://hooks.example.test/events",
      events: ["entry:publish"],
      enabled: true,
    }));
    assert.equal(response.status, 500);
    assert.doesNotMatch(await response.text(), /private secret store detail|reference resolver/);
    const list = await fixture.server.dispatch(cmsRequest("GET", "/admin/webhooks"));
    assert.deepEqual((await json(list)).subscriptions, []);
  }
});
