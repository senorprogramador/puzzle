import { describe, expect, it } from "bun:test";
import { createHmac } from "node:crypto";
import {
  signCmsWebhook,
  verifyCmsWebhook,
  type CmsWebhookReplayStore,
} from "../src";

const secret = new Uint8Array(32).fill(42);
const previousSecret = new Uint8Array(32).fill(17);
const body = new TextEncoder().encode('{"type":"entry:publish"}');
const timestamp = 1_800_000_000_000;
const deliveryId = "delivery-123";
const scope = "tenant-a_endpoint-b";

const replayStore = () => {
  const consumed = new Map<string, number>();
  const calls: Array<{ scope: string; deliveryId: string; expiresAt: Date }> = [];
  const store: CmsWebhookReplayStore = {
    async consume(input) {
      calls.push(input);
      const key = JSON.stringify([input.scope, input.deliveryId]);
      const previous = consumed.get(key);
      consumed.set(key, Math.max(previous ?? 0, input.expiresAt.getTime()));
      if (previous !== undefined) return false;
      return true;
    },
  };
  return { store, calls, consumed };
};

describe("CMS webhook signatures", () => {
  it("signs the exact bytes with interoperable HMAC-SHA256", async () => {
    const signature = await signCmsWebhook({ secret, deliveryId, timestamp, body });
    const expected = createHmac("sha256", secret)
      .update(`v1.${timestamp}.${deliveryId}.`)
      .update(body)
      .digest("hex");
    expect(signature).toBe(`t=${timestamp},v1=${expected}`);
    const { store, calls } = replayStore();
    expect(await verifyCmsWebhook({
      secrets: [secret], deliveryId, signature, body, scope, replayStore: store, now: timestamp,
    })).toEqual({ valid: true });
    expect(calls[0]?.expiresAt.getTime()).toBe(timestamp + 300_001);
  });

  it("rejects tampering and malformed signatures before consuming replay state", async () => {
    const signature = await signCmsWebhook({ secret, deliveryId, timestamp, body });
    const { store, calls } = replayStore();
    const base = { secrets: [secret], deliveryId, signature, body, scope, replayStore: store, now: timestamp };
    expect(await verifyCmsWebhook({ ...base, body: new Uint8Array([0]) })).toEqual({ valid: false, reason: "invalid" });
    expect(await verifyCmsWebhook({ ...base, deliveryId: "another-delivery" })).toEqual({ valid: false, reason: "invalid" });
    expect(await verifyCmsWebhook({ ...base, deliveryId: "invalid.delivery" })).toEqual({ valid: false, reason: "invalid" });
    expect(await verifyCmsWebhook({ ...base, signature: `${signature},v1=00` })).toEqual({ valid: false, reason: "invalid" });
    expect(await verifyCmsWebhook({ ...base, signature: signature.toUpperCase() })).toEqual({ valid: false, reason: "invalid" });
    expect(calls).toHaveLength(0);
  });

  it("enforces the clock window and retains replay state through the inclusive boundary", async () => {
    const signature = await signCmsWebhook({ secret, deliveryId, timestamp, body });
    const { store, calls } = replayStore();
    const base = { secrets: [secret], deliveryId, signature, body, scope, replayStore: store, toleranceMs: 1_000 };
    expect(await verifyCmsWebhook({ ...base, now: timestamp - 1_001 })).toEqual({ valid: false, reason: "expired" });
    expect(await verifyCmsWebhook({ ...base, now: timestamp + 1_001 })).toEqual({ valid: false, reason: "expired" });
    expect(calls).toHaveLength(0);
    expect(await verifyCmsWebhook({ ...base, now: timestamp + 1_000 })).toEqual({ valid: true });
    expect(calls[0]?.expiresAt.getTime()).toBe(timestamp + 1_001);
    expect(await verifyCmsWebhook({ ...base, now: timestamp + 1_000 })).toEqual({ valid: false, reason: "replayed" });
  });

  it("accepts an explicitly retained previous secret but rejects concurrent replays", async () => {
    const signature = await signCmsWebhook({ secret: previousSecret, deliveryId, timestamp, body });
    const { store } = replayStore();
    const input = {
      secrets: [secret, previousSecret], deliveryId, signature, body, scope, replayStore: store, now: timestamp,
    };
    const results = await Promise.all([verifyCmsWebhook(input), verifyCmsWebhook(input)]);
    expect(results.filter((result) => result.valid)).toHaveLength(1);
    expect(results.filter((result) => !result.valid && result.reason === "replayed")).toHaveLength(1);
    expect(await verifyCmsWebhook({ ...input, secrets: [secret], replayStore: replayStore().store }))
      .toEqual({ valid: false, reason: "invalid" });
  });

  it("extends replay retention when a retry has a later signed timestamp", async () => {
    const first = await signCmsWebhook({ secret, deliveryId, timestamp, body });
    const later = await signCmsWebhook({ secret, deliveryId, timestamp: timestamp + 500, body });
    const { store, consumed } = replayStore();
    const base = { secrets: [secret], deliveryId, body, scope, replayStore: store, toleranceMs: 1_000 };
    expect(await verifyCmsWebhook({ ...base, signature: first, now: timestamp })).toEqual({ valid: true });
    expect(await verifyCmsWebhook({ ...base, signature: later, now: timestamp + 500 }))
      .toEqual({ valid: false, reason: "replayed" });
    expect(consumed.get(JSON.stringify([scope, deliveryId]))).toBe(timestamp + 1_501);
  });

  it("fails closed on replay-store errors and invalid configuration", async () => {
    const signature = await signCmsWebhook({ secret, deliveryId, timestamp, body });
    const input = {
      secrets: [secret], deliveryId, signature, body, scope, now: timestamp,
      replayStore: { consume: async () => { throw new Error("Store unavailable"); } },
    };
    await expect(verifyCmsWebhook(input)).rejects.toThrow("Store unavailable");
    await expect(verifyCmsWebhook({ ...input, secrets: [] })).rejects.toThrow("one to three");
    await expect(verifyCmsWebhook({ ...input, toleranceMs: 0 })).rejects.toThrow("tolerance");
    await expect(verifyCmsWebhook({
      ...input,
      replayStore: { consume: async () => "accepted" as never },
    })).rejects.toThrow("must return a boolean");
    await expect(signCmsWebhook({ secret: new Uint8Array(31), deliveryId, timestamp, body }))
      .rejects.toThrow("32 and 1024");
    await expect(signCmsWebhook({ secret, deliveryId, timestamp, body: new Uint8Array(1_048_577) }))
      .rejects.toThrow("at most");
  });

  it("rejects malformed raw-body and timestamp inputs before replay-store access", async () => {
    const signature = await signCmsWebhook({ secret, deliveryId, timestamp, body });
    const { store, calls } = replayStore();
    const base = { secrets: [secret], deliveryId, signature, body, scope, replayStore: store, now: timestamp };

    await expect(verifyCmsWebhook({ ...base, body: "not raw bytes" as never }))
      .rejects.toThrow("raw webhook body");
    await expect(verifyCmsWebhook({ ...base, now: Number.MAX_SAFE_INTEGER }))
      .rejects.toThrow("Unix timestamp");
    await expect(verifyCmsWebhook({ ...base, toleranceMs: Number.POSITIVE_INFINITY }))
      .rejects.toThrow("tolerance");
    await expect(verifyCmsWebhook({ ...base, secrets: [new Uint8Array(31)] }))
      .rejects.toThrow("32 and 1024");
    expect(await verifyCmsWebhook({ ...base, signature: "t=1800000000000,v2=00" }))
      .toEqual({ valid: false, reason: "invalid" });
    expect(calls).toHaveLength(0);
  });
});
