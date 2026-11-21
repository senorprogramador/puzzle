export interface IdempotencyRecord<T = unknown> {
  readonly key: string;
  readonly scope?: string;
  readonly status: "in_progress" | "completed" | "failed";
  readonly response?: T;
  readonly error?: string;
  readonly createdAt: Date;
  readonly expiresAt?: Date;
}

export interface IdempotencyStore<T = unknown> {
  readonly get: (key: string, scope?: string) => Promise<IdempotencyRecord<T> | undefined>;
  readonly set: (record: IdempotencyRecord<T>) => Promise<void>;
}

export class InvalidIdempotencyKeyError extends Error {
  readonly code = "INVALID_IDEMPOTENCY_KEY";

  constructor(message = "Idempotency keys must contain 1 to 255 printable characters") {
    super(message);
    this.name = "InvalidIdempotencyKeyError";
  }
}

export function validateIdempotencyKey(key: string): string {
  if (typeof key !== "string" || key.length < 1 || key.length > 255 || /[\u0000-\u001f\u007f]/.test(key)) {
    throw new InvalidIdempotencyKeyError();
  }
  return key;
}

export function createIdempotencyKey(prefix = "idem"): string {
  const random = globalThis.crypto?.randomUUID?.();
  return validateIdempotencyKey(`${prefix}_${random ?? `${Date.now()}_${Math.random().toString(36).slice(2)}`}`);
}

export interface ExecuteIdempotentlyOptions {
  readonly scope?: string;
  readonly expiresAt?: Date;
}

export async function executeIdempotently<T>(
  store: IdempotencyStore<T>,
  key: string,
  operation: () => Promise<T>,
  options: ExecuteIdempotentlyOptions = {},
): Promise<T> {
  validateIdempotencyKey(key);
  const existing = await store.get(key, options.scope);
  if (existing?.status === "completed") return existing.response as T;
  if (existing?.status === "in_progress") throw new Error("An operation with this idempotency key is already in progress");
  const started: IdempotencyRecord<T> = {
    key,
    scope: options.scope,
    status: "in_progress",
    createdAt: new Date(),
    expiresAt: options.expiresAt,
  };
  await store.set(started);
  try {
    const response = await operation();
    await store.set({ ...started, status: "completed", response });
    return response;
  } catch (error) {
    await store.set({ ...started, status: "failed", error: error instanceof Error ? error.message : String(error) });
    throw error;
  }
}

export interface WebhookEvent<T = unknown> {
  readonly id: string;
  readonly provider: string;
  readonly type: string;
  readonly payload: T;
  readonly occurredAt: Date;
  readonly receivedAt?: Date;
}

export interface WebhookEventStore {
  readonly isProcessed: (provider: string, eventId: string) => Promise<boolean>;
  readonly markProcessed: (provider: string, eventId: string) => Promise<void>;
}

export interface WebhookProcessingResult {
  readonly duplicate: boolean;
  readonly eventId: string;
}

export async function processWebhook<T>(
  event: WebhookEvent<T>,
  store: WebhookEventStore,
  handler: (event: WebhookEvent<T>) => Promise<void>,
): Promise<WebhookProcessingResult> {
  if (await store.isProcessed(event.provider, event.id)) return { duplicate: true, eventId: event.id };
  await handler(event);
  await store.markProcessed(event.provider, event.id);
  return { duplicate: false, eventId: event.id };
}
