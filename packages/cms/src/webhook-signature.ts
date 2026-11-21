const encoder = new TextEncoder();
const signaturePattern = /^t=(0|[1-9][0-9]{0,15}),v1=([0-9a-f]{64})$/;
const identifierPattern = /^[A-Za-z0-9_-]{1,128}$/;
const defaultToleranceMs = 5 * 60 * 1_000;
const maximumToleranceMs = 24 * 60 * 60 * 1_000;
const maximumBodyBytes = 1_048_576;

export interface CmsWebhookReplayStore {
  /**
   * Atomically record this delivery until expiresAt. For a duplicate, retain
   * the record until at least the later of its current expiry and expiresAt,
   * and return false. Reject on store failure.
   */
  consume(input: {
    readonly scope: string;
    readonly deliveryId: string;
    readonly expiresAt: Date;
  }): Promise<boolean>;
}

export type CmsWebhookVerificationResult =
  | { readonly valid: true }
  | { readonly valid: false; readonly reason: "invalid" | "expired" | "replayed" };

const assertIdentifier = (value: string, name: string): void => {
  if (typeof value !== "string" || !identifierPattern.test(value)) {
    throw new TypeError(`${name} must contain 1 to 128 ASCII letters, numbers, underscores, or hyphens.`);
  }
};

const assertSecret = (secret: Uint8Array): void => {
  if (!(secret instanceof Uint8Array) || secret.byteLength < 32 || secret.byteLength > 1024) {
    throw new TypeError("Webhook secrets must contain between 32 and 1024 bytes.");
  }
};

const assertBody = (body: Uint8Array): void => {
  if (!(body instanceof Uint8Array) || body.byteLength > maximumBodyBytes) {
    throw new TypeError(`The raw webhook body must be a Uint8Array of at most ${maximumBodyBytes} bytes.`);
  }
};

const assertTimestamp = (value: number, name: string): void => {
  if (!Number.isSafeInteger(value) || value < 0 || value > 8_640_000_000_000_000 - maximumToleranceMs - 1) {
    throw new TypeError(`${name} must be a valid Unix timestamp in milliseconds.`);
  }
};

const message = (timestamp: number, deliveryId: string, body: Uint8Array): Uint8Array<ArrayBuffer> => {
  const prefix = encoder.encode(`v1.${timestamp}.${deliveryId}.`);
  const result = new Uint8Array(prefix.byteLength + body.byteLength);
  result.set(prefix);
  result.set(body, prefix.byteLength);
  return result;
};

const keyFor = (secret: Uint8Array): Promise<CryptoKey> => {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Web Crypto is required for webhook signatures.");
  }
  return globalThis.crypto.subtle.importKey(
    "raw",
    new Uint8Array(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
};

const hex = (bytes: Uint8Array): string =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

const fromHex = (value: string): Uint8Array<ArrayBuffer> => {
  const bytes = new Uint8Array(value.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(value.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
};

export const signCmsWebhook = async (input: {
  readonly secret: Uint8Array;
  readonly deliveryId: string;
  readonly timestamp: number;
  readonly body: Uint8Array;
}): Promise<string> => {
  assertSecret(input.secret);
  assertIdentifier(input.deliveryId, "deliveryId");
  assertTimestamp(input.timestamp, "timestamp");
  assertBody(input.body);
  const signedMessage = message(input.timestamp, input.deliveryId, input.body);
  const key = await keyFor(input.secret);
  const signature = await globalThis.crypto.subtle.sign(
    "HMAC",
    key,
    signedMessage,
  );
  return `t=${input.timestamp},v1=${hex(new Uint8Array(signature))}`;
};

export const verifyCmsWebhook = async (input: {
  readonly secrets: readonly Uint8Array[];
  readonly deliveryId: string;
  readonly signature: string;
  readonly body: Uint8Array;
  readonly scope: string;
  readonly replayStore: CmsWebhookReplayStore;
  readonly now?: number;
  readonly toleranceMs?: number;
}): Promise<CmsWebhookVerificationResult> => {
  if (!Array.isArray(input.secrets) || input.secrets.length < 1 || input.secrets.length > 3) {
    throw new TypeError("Provide one to three active webhook secrets.");
  }
  input.secrets.forEach(assertSecret);
  assertIdentifier(input.scope, "scope");
  assertBody(input.body);
  if (!input.replayStore || typeof input.replayStore.consume !== "function") {
    throw new TypeError("An atomic webhook replay store is required.");
  }
  const now = input.now ?? Date.now();
  const toleranceMs = input.toleranceMs ?? defaultToleranceMs;
  assertTimestamp(now, "now");
  if (!Number.isSafeInteger(toleranceMs) || toleranceMs < 1 || toleranceMs > maximumToleranceMs) {
    throw new TypeError("Webhook tolerance must be between 1 millisecond and 24 hours.");
  }
  if (typeof input.deliveryId !== "string" || !identifierPattern.test(input.deliveryId)) {
    return { valid: false, reason: "invalid" };
  }
  const match = typeof input.signature === "string" ? signaturePattern.exec(input.signature) : null;
  if (!match) return { valid: false, reason: "invalid" };
  const timestamp = Number(match[1]);
  if (!Number.isSafeInteger(timestamp) || timestamp > 8_640_000_000_000_000 - maximumToleranceMs - 1) {
    return { valid: false, reason: "invalid" };
  }
  if (Math.abs(now - timestamp) > toleranceMs) return { valid: false, reason: "expired" };
  const signedMessage = message(timestamp, input.deliveryId, input.body);
  const signature = fromHex(match[2]!);
  const matches = await Promise.all(input.secrets.map(async (secret) => {
    const key = await keyFor(secret);
    return globalThis.crypto.subtle.verify("HMAC", key, signature, signedMessage);
  }));
  if (!matches.some(Boolean)) return { valid: false, reason: "invalid" };
  const accepted = await input.replayStore.consume({
    scope: input.scope,
    deliveryId: input.deliveryId,
    expiresAt: new Date(timestamp + toleranceMs + 1),
  });
  if (typeof accepted !== "boolean") {
    throw new TypeError("The webhook replay store must return a boolean.");
  }
  if (!accepted) return { valid: false, reason: "replayed" };
  return { valid: true };
};
