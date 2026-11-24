import {
  StorageConflictError,
  StorageDuplicateError,
  type StorageAdapter,
  type StorageBatchOperation,
  type StorageInsert,
  type StorageRecord,
} from "@puzzle-ui/storage";
import {
  CmsAuditError,
  CmsCapabilityError,
  CmsConflictError,
  CmsNotFoundError,
  CmsPermissionDeniedError,
  CmsValidationError,
} from "./errors";
import { signCmsWebhook } from "./webhook-signature";
import type {
  CmsAccessAction,
  CmsAccessPolicy,
  CmsAuditEvent,
  CmsChangeEvent,
  CmsContext,
} from "./types";

export const CMS_WEBHOOK_EVENTS = [
  "content-type:create",
  "content-type:update",
  "entry:create",
  "entry:save-draft",
  "entry:publish",
  "entry:unpublish",
  "entry:schedule",
  "entry:unschedule",
  "entry:archive",
  "entry:delete",
  "entry:restore",
  "entry:scheduled-publish",
] as const;
export type CmsWebhookEventType = (typeof CMS_WEBHOOK_EVENTS)[number];

export type CmsWebhookSubscription = StorageRecord & {
  readonly tenantId: string;
  readonly endpoint: string;
  readonly events: readonly CmsWebhookEventType[];
  readonly enabled: boolean;
  readonly secretRef: string;
};

export type CmsWebhookDelivery = StorageRecord & {
  readonly tenantId: string;
  readonly eventId: string;
  readonly subscriptionId: string;
  readonly event: {
    readonly resource: CmsChangeEvent["resource"];
    readonly resourceId: string;
    readonly action: string;
    readonly occurredAt: Date;
    readonly revisionNumber?: number;
  };
  readonly status: "pending" | "delivering" | "delivered" | "failed" | "cancelled";
  readonly attempts: number;
  readonly cycleAttempts: number;
  readonly nextAttemptAt: Date;
  readonly leaseToken: string | null;
  readonly lastStatus: number | null;
  readonly lastFailure: "transport" | "secret" | "http" | "invalid-response" | "lease-expired" | "disabled" | null;
};

export type CmsWebhookAttempt = StorageRecord & {
  readonly tenantId: string;
  readonly deliveryId: string;
  readonly number: number;
  readonly startedAt: Date;
  readonly completedAt: Date;
  readonly status: number | null;
  readonly failure: CmsWebhookDelivery["lastFailure"];
};

/**
 * The host transport must enforce HTTPS, reject private, local, and otherwise
 * disallowed addresses at connection time, pin the validated DNS result,
 * reject redirects, and enforce the given timeout and bounded response size.
 * The CMS deliberately provides no default network transport.
 */
export interface CmsWebhookTransport {
  send(input: {
    readonly endpoint: string;
    readonly deliveryId: string;
    readonly signature: string;
    readonly body: Uint8Array;
    readonly timeoutMs: number;
  }): Promise<{ readonly status: number }>;
}

export type CmsWebhookServiceOptions = {
  readonly storage: StorageAdapter;
  readonly accessPolicy: CmsAccessPolicy;
  readonly transport: CmsWebhookTransport;
  readonly resolveSecret: (input: {
    readonly tenantId: string;
    readonly secretRef: string;
  }) => Promise<Uint8Array>;
  readonly clock?: () => Date;
  readonly idGenerator?: () => string;
  readonly leaseMs?: number;
  readonly timeoutMs?: number;
  readonly retryDelayMs?: number;
  readonly maxAttempts?: number;
};

type WebhookRecord = CmsWebhookSubscription | CmsWebhookDelivery | CmsWebhookAttempt | CmsAuditEvent | CmsChangeEvent;
type SubscriptionInput = {
  readonly endpoint: string;
  readonly events: readonly CmsWebhookEventType[];
  readonly enabled: boolean;
  readonly secretRef: string;
};
const collections = {
  subscriptions: "cms_webhook_subscriptions",
  deliveries: "cms_webhook_deliveries",
  attempts: "cms_webhook_attempts",
  audit: "cms_audit_events",
  changeEvents: "cms_change_events",
} as const;
const equal = <T>(value: T) => ({ operator: "eq" as const, value });

const validateSubscription = (input: SubscriptionInput): void => {
  if (
    typeof input.endpoint !== "string" || input.endpoint.length === 0 ||
    input.endpoint.length > 2_048 || /[\u0000-\u001f\u007f]/.test(input.endpoint)
  ) {
    throw new CmsValidationError([{ path: "endpoint", code: "invalid", message: "An absolute HTTPS endpoint is required." }]);
  }
  let url: URL;
  try {
    url = new URL(input.endpoint);
  } catch {
    throw new CmsValidationError([{ path: "endpoint", code: "invalid", message: "An absolute HTTPS endpoint is required." }]);
  }
  if (
    url.protocol !== "https:" || !url.hostname || url.username || url.password ||
    url.search || url.hash
  ) {
    throw new CmsValidationError([{
      path: "endpoint", code: "invalid",
      message: "The endpoint must be HTTPS without credentials, query, or fragment.",
    }]);
  }
  if (
    !Array.isArray(input.events) || input.events.length === 0 ||
    input.events.length > CMS_WEBHOOK_EVENTS.length ||
    new Set(input.events).size !== input.events.length ||
    input.events.some((event) => !(CMS_WEBHOOK_EVENTS as readonly string[]).includes(event))
  ) {
    throw new CmsValidationError([{ path: "events", code: "invalid", message: "Select distinct supported webhook events." }]);
  }
  if (typeof input.enabled !== "boolean") {
    throw new CmsValidationError([{ path: "enabled", code: "invalid", message: "Webhook enabled must be a boolean." }]);
  }
  if (typeof input.secretRef !== "string" || !input.secretRef.trim() || input.secretRef.length > 500) {
    throw new CmsValidationError([{ path: "secretRef", code: "invalid", message: "A server-side secret reference is required." }]);
  }
};

export class CmsWebhookService {
  readonly #options: CmsWebhookServiceOptions;
  readonly #leaseMs: number;
  readonly #timeoutMs: number;
  readonly #retryDelayMs: number;
  readonly #maxAttempts: number;
  #ready?: Promise<void>;

  constructor(options: CmsWebhookServiceOptions) {
    if (!options?.storage || typeof options.accessPolicy !== "function" ||
        typeof options.transport?.send !== "function" || typeof options.resolveSecret !== "function") {
      throw new TypeError("Webhook service requires storage, access policy, a safe transport, and a secret resolver.");
    }
    this.#options = options;
    this.#leaseMs = options.leaseMs ?? 60_000;
    this.#timeoutMs = options.timeoutMs ?? 10_000;
    this.#retryDelayMs = options.retryDelayMs ?? 30_000;
    this.#maxAttempts = options.maxAttempts ?? 5;
    if (!Number.isSafeInteger(this.#leaseMs) || this.#leaseMs < 1_000 || this.#leaseMs > 3_600_000 ||
        !Number.isSafeInteger(this.#timeoutMs) || this.#timeoutMs < 1 || this.#timeoutMs >= this.#leaseMs ||
        !Number.isSafeInteger(this.#retryDelayMs) || this.#retryDelayMs < 1_000 || this.#retryDelayMs > 86_400_000 ||
        !Number.isSafeInteger(this.#maxAttempts) || this.#maxAttempts < 1 || this.#maxAttempts > 20) {
      throw new TypeError("Invalid webhook lease, timeout, retry delay, or attempt limit.");
    }
  }

  async createSubscription(input: CmsContext & SubscriptionInput): Promise<CmsWebhookSubscription> {
    await this.#initialize();
    this.#assertContext(input);
    await this.#authorize(input, "webhook:manage");
    validateSubscription(input);
    const now = this.#now();
    const record: CmsWebhookSubscription = {
      id: this.#id(), tenantId: input.tenantId, endpoint: new URL(input.endpoint).toString(),
      events: [...input.events], enabled: input.enabled, secretRef: input.secretRef,
      createdAt: now, updatedAt: now, revision: 1,
    };
    await this.#batch([
      { type: "insert", collection: collections.subscriptions, record },
      { type: "insert", collection: collections.audit, record: this.#audit(input, record.id, "webhook:create", "success") },
    ]);
    return record;
  }

  async updateSubscription(
    input: CmsContext & SubscriptionInput & { readonly subscriptionId: string; readonly expectedRevision: number },
  ): Promise<CmsWebhookSubscription> {
    await this.#initialize();
    this.#assertContext(input);
    const current = await this.#subscription(input.tenantId, input.subscriptionId);
    await this.#authorize(input, "webhook:manage", current.id, current);
    this.#assertRevision(input.expectedRevision);
    validateSubscription(input);
    const result = await this.#batch([
      {
        type: "update", collection: collections.subscriptions, id: current.id,
        condition: { expectedRevision: input.expectedRevision },
        changes: {
          endpoint: new URL(input.endpoint).toString(), events: [...input.events],
          enabled: input.enabled, secretRef: input.secretRef, updatedAt: this.#now(),
        },
      },
      { type: "insert", collection: collections.audit, record: this.#audit(input, current.id, "webhook:update", "success") },
    ]);
    const updated = result.results[0];
    if (!updated || updated.type !== "update" || !updated.record) throw new CmsConflictError();
    return updated.record as CmsWebhookSubscription;
  }

  async listSubscriptions(input: CmsContext): Promise<readonly CmsWebhookSubscription[]> {
    await this.#initialize();
    this.#assertContext(input);
    await this.#authorize(input, "webhook:read");
    const subscriptions = await this.#options.storage.findMany<CmsWebhookSubscription>(
      collections.subscriptions, { where: { tenantId: equal(input.tenantId) }, orderBy: [{ field: "id", direction: "asc" }] },
    );
    const visible: CmsWebhookSubscription[] = [];
    for (const subscription of subscriptions) {
      if (await this.#allowed(input, "webhook:read", subscription.id, subscription)) visible.push(subscription);
    }
    return visible;
  }

  async getSubscription(input: CmsContext & { readonly subscriptionId: string }): Promise<CmsWebhookSubscription> {
    await this.#initialize();
    this.#assertContext(input);
    const subscription = await this.#subscription(input.tenantId, input.subscriptionId);
    await this.#authorize(input, "webhook:read", subscription.id, subscription);
    return subscription;
  }

  async assertCanManage(input: CmsContext & { readonly subscriptionId?: string }): Promise<void> {
    await this.#initialize();
    this.#assertContext(input);
    const subscription = input.subscriptionId === undefined
      ? undefined
      : await this.#subscription(input.tenantId, input.subscriptionId);
    await this.#authorize(input, "webhook:manage", subscription?.id, subscription);
  }

  async fanout(input: CmsContext & { readonly eventId: string; readonly expectedRevision: number }): Promise<number> {
    await this.#initialize();
    this.#assertContext(input);
    await this.#authorize(input, "webhook:dispatch");
    this.#assertRevision(input.expectedRevision);
    if (typeof input.eventId !== "string" || !input.eventId.trim()) {
      throw new CmsValidationError([{ path: "eventId", code: "required", message: "A change event ID is required." }]);
    }
    const storedEvent = await this.#options.storage.findOne<CmsChangeEvent>(collections.changeEvents, {
      where: { id: equal(input.eventId), tenantId: equal(input.tenantId) },
    });
    if (!storedEvent) throw new CmsNotFoundError("Change event");
    let event: CmsChangeEvent = storedEvent;
    if (event.revision !== input.expectedRevision) throw new CmsConflictError();
    await this.#authorize(input, "change-event:ack", event.id, event, "changeEvent");
    const now = this.#now();
    if (event.fanoutLeaseUntil && event.fanoutLeaseUntil > now) {
      throw new CmsConflictError("The change event is already being fanned out.");
    }
    event = await this.#renewEventLease(event, now);
    const subscriptions = await this.#options.storage.findMany<CmsWebhookSubscription>(
      collections.subscriptions,
      { where: { tenantId: equal(input.tenantId), enabled: equal(true) } },
    );
    let created = 0;
    for (const subscription of subscriptions) {
      if (!subscription.events.some((type) => type === event.action)) continue;
      await this.#authorize(input, "webhook:dispatch", subscription.id, subscription);
      const currentTime = this.#now();
      if (!event.fanoutLeaseUntil || currentTime >= event.fanoutLeaseUntil) {
        throw new CmsConflictError("Webhook fanout lease expired.");
      }
      event = await this.#renewEventLease(event, currentTime);
      const now = this.#now();
      const delivery: StorageInsert<CmsWebhookDelivery> = {
        id: this.#id(), tenantId: input.tenantId, eventId: event.id, subscriptionId: subscription.id,
        event: {
          resource: event.resource, resourceId: event.resourceId, action: event.action,
          occurredAt: event.occurredAt,
          ...(event.revisionNumber === undefined ? {} : { revisionNumber: event.revisionNumber }),
        },
        status: "pending", attempts: 0, cycleAttempts: 0, nextAttemptAt: now,
        leaseToken: null, lastStatus: null, lastFailure: null,
        createdAt: now, updatedAt: now, revision: 1,
      };
      try {
        await this.#options.storage.insert<CmsWebhookDelivery>(collections.deliveries, delivery);
        created += 1;
      } catch (error) {
        if (!(error instanceof StorageDuplicateError)) throw error;
        const existing = await this.#options.storage.findOne<CmsWebhookDelivery>(collections.deliveries, {
          where: {
            tenantId: equal(input.tenantId), eventId: equal(event.id),
            subscriptionId: equal(subscription.id),
          },
        });
        if (!existing) throw error;
      }
      if (!event.fanoutLeaseUntil || this.#now() >= event.fanoutLeaseUntil) {
        throw new CmsConflictError("Webhook fanout lease expired.");
      }
    }
    try {
      const deleted = await this.#options.storage.delete<CmsChangeEvent>(
        collections.changeEvents, event.id, { expectedRevision: event.revision },
      );
      if (!deleted) throw new CmsNotFoundError("Change event");
    } catch (error) {
      if (error instanceof StorageConflictError) throw new CmsConflictError();
      throw error;
    }
    return created;
  }

  async #renewEventLease(event: CmsChangeEvent, now: Date): Promise<CmsChangeEvent> {
    const result = await this.#batch([{
      type: "update", collection: collections.changeEvents, id: event.id,
      condition: { expectedRevision: event.revision },
      changes: { fanoutLeaseUntil: new Date(now.getTime() + this.#leaseMs), updatedAt: now },
    }]);
    const updated = result.results[0];
    if (!updated || updated.type !== "update" || !updated.record) throw new CmsConflictError();
    return updated.record as CmsChangeEvent;
  }

  async listDeliveries(input: CmsContext & { readonly subscriptionId: string; readonly first?: number }): Promise<readonly CmsWebhookDelivery[]> {
    await this.#initialize();
    this.#assertContext(input);
    const subscription = await this.#subscription(input.tenantId, input.subscriptionId);
    await this.#authorize(input, "webhook:read", subscription.id, subscription);
    const first = input.first ?? 100;
    if (!Number.isInteger(first) || first < 1 || first > 500) {
      throw new CmsValidationError([{ path: "first", code: "range", message: "Delivery count must be from 1 to 500." }]);
    }
    const deliveries = await this.#options.storage.findMany<CmsWebhookDelivery>(collections.deliveries, {
      where: { tenantId: equal(input.tenantId), subscriptionId: equal(subscription.id) },
      orderBy: [{ field: "createdAt", direction: "desc" }], limit: first,
    });
    const visible: CmsWebhookDelivery[] = [];
    for (const delivery of deliveries) {
      if (await this.#allowed(input, "webhook:read", delivery.id, delivery)) visible.push(delivery);
    }
    return visible;
  }

  async listAttempts(input: CmsContext & { readonly deliveryId: string; readonly first?: number }): Promise<readonly CmsWebhookAttempt[]> {
    await this.#initialize();
    this.#assertContext(input);
    const delivery = await this.#delivery(input.tenantId, input.deliveryId);
    await this.#authorize(input, "webhook:read", delivery.subscriptionId, delivery);
    const first = input.first ?? 100;
    if (!Number.isInteger(first) || first < 1 || first > 500) {
      throw new CmsValidationError([{ path: "first", code: "range", message: "Attempt count must be from 1 to 500." }]);
    }
    const attempts = await this.#options.storage.findMany<CmsWebhookAttempt>(collections.attempts, {
      where: { tenantId: equal(input.tenantId), deliveryId: equal(delivery.id) },
      orderBy: [{ field: "number", direction: "desc" }], limit: first,
    });
    const visible: CmsWebhookAttempt[] = [];
    for (const attempt of attempts) {
      if (await this.#allowed(input, "webhook:read", attempt.id, attempt)) visible.push(attempt);
    }
    return visible;
  }

  async retryDelivery(input: CmsContext & { readonly deliveryId: string; readonly expectedRevision: number }): Promise<void> {
    await this.#initialize();
    this.#assertContext(input);
    const delivery = await this.#delivery(input.tenantId, input.deliveryId);
    await this.#authorize(input, "webhook:manage", delivery.subscriptionId, delivery);
    this.#assertRevision(input.expectedRevision);
    if (delivery.status !== "failed") throw new CmsConflictError("Only failed deliveries can be retried.");
    await this.#batch([
      {
        type: "update", collection: collections.deliveries, id: delivery.id,
        condition: { expectedRevision: input.expectedRevision },
        changes: {
          status: "pending", cycleAttempts: 0, nextAttemptAt: this.#now(),
          leaseToken: null, lastFailure: null, updatedAt: this.#now(),
        },
      },
      { type: "insert", collection: collections.audit, record: this.#audit(input, delivery.id, "webhook:retry", "success") },
    ]);
  }

  async runNext(input: CmsContext): Promise<CmsWebhookDelivery | null> {
    await this.#initialize();
    this.#assertContext(input);
    await this.#authorize(input, "webhook:dispatch");
    const now = this.#now();
    const [candidate] = await this.#options.storage.findMany<CmsWebhookDelivery>(
      collections.deliveries,
      {
        where: {
          tenantId: equal(input.tenantId),
          status: { operator: "in", value: ["pending", "delivering"] },
          nextAttemptAt: { operator: "lte", value: now },
        },
        orderBy: [{ field: "nextAttemptAt", direction: "asc" }, { field: "id", direction: "asc" }],
        limit: 1,
      },
    );
    if (!candidate) return null;
    await this.#authorize(input, "webhook:dispatch", candidate.id, candidate);
    const previousAttempt: StorageBatchOperation<WebhookRecord>[] = candidate.status === "delivering"
      ? [{
          type: "insert",
          collection: collections.attempts,
          record: this.#attempt(candidate, new Date(candidate.nextAttemptAt.getTime() - this.#leaseMs), now, null, "lease-expired"),
        }]
      : [];
    if (candidate.cycleAttempts >= this.#maxAttempts) {
      const result = await this.#batch([
        {
          type: "update", collection: collections.deliveries, id: candidate.id,
          condition: { expectedRevision: candidate.revision },
          changes: { status: "failed", leaseToken: null, lastFailure: "lease-expired", updatedAt: now },
        },
        ...previousAttempt,
      ]);
      return this.#updatedDelivery(result.results[0]);
    }
    const leaseToken = this.#id();
    const claim = await this.#batch([
      {
        type: "update", collection: collections.deliveries, id: candidate.id,
        condition: { expectedRevision: candidate.revision },
        changes: {
          status: "delivering", attempts: candidate.attempts + 1,
          cycleAttempts: candidate.cycleAttempts + 1, leaseToken,
          nextAttemptAt: new Date(now.getTime() + this.#leaseMs), updatedAt: now,
        },
      },
      ...previousAttempt,
    ]);
    const delivery = this.#updatedDelivery(claim.results[0]);
    const subscription = await this.#subscription(input.tenantId, delivery.subscriptionId);
    let status: number | null = null;
    let failure: CmsWebhookDelivery["lastFailure"] = null;
    if (!subscription.enabled) {
      failure = "disabled";
    } else {
      const payload = new TextEncoder().encode(JSON.stringify({
        id: delivery.eventId,
        deliveryId: delivery.id,
        tenantId: delivery.tenantId,
        ...delivery.event,
      }));
      let signature: string | undefined;
      try {
        const secret = await this.#options.resolveSecret({
          tenantId: input.tenantId, secretRef: subscription.secretRef,
        });
        signature = await signCmsWebhook({
          secret, deliveryId: delivery.id, timestamp: now.getTime(), body: payload,
        });
      } catch {
        failure = "secret";
      }
      if (signature !== undefined) {
        try {
          const response = await this.#options.transport.send({
            endpoint: subscription.endpoint, deliveryId: delivery.id,
            signature, body: payload, timeoutMs: this.#timeoutMs,
          });
          if (!Number.isInteger(response?.status) || response.status < 100 || response.status > 599) {
            failure = "invalid-response";
          } else {
            status = response.status;
            if (status < 200 || status >= 300) failure = "http";
          }
        } catch {
          failure = "transport";
        }
      }
    }
    const completedAt = this.#now();
    if (completedAt >= delivery.nextAttemptAt) {
      throw new CmsConflictError("Webhook delivery lease expired before completion.");
    }
    const retryable = failure === "secret" || failure === "transport" || failure === "invalid-response" ||
      (failure === "http" && (status === 408 || status === 429 || (status !== null && status >= 500)));
    const nextStatus: CmsWebhookDelivery["status"] =
      failure === "disabled" ? "cancelled" :
      failure === null ? "delivered" :
      retryable && delivery.cycleAttempts < this.#maxAttempts ? "pending" : "failed";
    const retryDelay = Math.min(this.#retryDelayMs * 2 ** (delivery.cycleAttempts - 1), 86_400_000);
    const result = await this.#batch([
      {
        type: "update", collection: collections.deliveries, id: delivery.id,
        condition: { expectedRevision: delivery.revision },
        changes: {
          status: nextStatus, leaseToken: null, lastStatus: status, lastFailure: failure,
          nextAttemptAt: nextStatus === "pending"
            ? new Date(completedAt.getTime() + retryDelay)
            : completedAt,
          updatedAt: completedAt,
        },
      },
      {
        type: "insert", collection: collections.attempts,
        record: this.#attempt(delivery, now, completedAt, status, failure),
      },
    ]);
    return this.#updatedDelivery(result.results[0]);
  }

  #attempt(
    delivery: CmsWebhookDelivery,
    startedAt: Date,
    completedAt: Date,
    status: number | null,
    failure: CmsWebhookDelivery["lastFailure"],
  ): StorageInsert<CmsWebhookAttempt> {
    return {
      id: this.#id(), tenantId: delivery.tenantId, deliveryId: delivery.id,
      number: delivery.attempts, startedAt, completedAt, status, failure,
      createdAt: completedAt, updatedAt: completedAt, revision: 1,
    };
  }

  #updatedDelivery(result: { readonly type: string; readonly record?: WebhookRecord | null } | undefined): CmsWebhookDelivery {
    if (!result || result.type !== "update" || !result.record) throw new CmsConflictError();
    return result.record as CmsWebhookDelivery;
  }

  async #subscription(tenantId: string, id: string): Promise<CmsWebhookSubscription> {
    if (typeof id !== "string" || !id.trim()) {
      throw new CmsValidationError([{ path: "subscriptionId", code: "required", message: "A subscription ID is required." }]);
    }
    const record = await this.#options.storage.findOne<CmsWebhookSubscription>(collections.subscriptions, {
      where: { id: equal(id), tenantId: equal(tenantId) },
    });
    if (!record) throw new CmsNotFoundError("Webhook subscription");
    return record;
  }

  async #delivery(tenantId: string, id: string): Promise<CmsWebhookDelivery> {
    if (typeof id !== "string" || !id.trim()) {
      throw new CmsValidationError([{ path: "deliveryId", code: "required", message: "A delivery ID is required." }]);
    }
    const record = await this.#options.storage.findOne<CmsWebhookDelivery>(collections.deliveries, {
      where: { id: equal(id), tenantId: equal(tenantId) },
    });
    if (!record) throw new CmsNotFoundError("Webhook delivery");
    return record;
  }

  #assertContext(input: CmsContext): void {
    if (!input || typeof input !== "object" ||
        typeof input.tenantId !== "string" || !input.tenantId.trim() ||
        (input.actor !== null && (!input.actor || typeof input.actor.id !== "string" || !input.actor.id.trim()))) {
      throw new CmsValidationError([{ path: "context", code: "invalid", message: "A tenant and valid actor or null are required." }]);
    }
  }

  #assertRevision(revision: number): void {
    if (!Number.isInteger(revision) || revision < 1) {
      throw new CmsValidationError([{ path: "expectedRevision", code: "invalid", message: "A positive expected revision is required." }]);
    }
  }

  async #allowed(input: CmsContext, action: CmsAccessAction, resourceId?: string, record?: unknown): Promise<boolean> {
    return (await this.#options.accessPolicy({
      tenantId: input.tenantId, actor: input.actor, resource: "webhook", action, resourceId, record,
    })) === true;
  }

  async #authorize(
    input: CmsContext,
    action: CmsAccessAction,
    resourceId?: string,
    record?: unknown,
    resource: "webhook" | "changeEvent" = "webhook",
  ): Promise<void> {
    const allowed = await this.#options.accessPolicy({
      tenantId: input.tenantId, actor: input.actor, resource, action, resourceId, record,
    });
    if (allowed === true) return;
    try {
      await this.#options.storage.insert<CmsAuditEvent>(
        collections.audit,
        this.#audit(input, resourceId ?? "unresolved", action, "denied", resource),
      );
    } catch (error) {
      throw new CmsAuditError({ cause: error });
    }
    throw new CmsPermissionDeniedError();
  }

  #audit(
    input: CmsContext,
    resourceId: string,
    action: string,
    result: "success" | "denied",
    resource: "webhook" | "changeEvent" = "webhook",
  ): StorageInsert<CmsAuditEvent> {
    const now = this.#now();
    return {
      id: this.#id(), tenantId: input.tenantId, actorId: input.actor?.id ?? null,
      resource, resourceId, action, result, timestamp: now,
      createdAt: now, updatedAt: now, revision: 1,
    };
  }

  async #batch(operations: readonly StorageBatchOperation<WebhookRecord>[]) {
    try {
      return await this.#options.storage.atomicBatch<WebhookRecord>(operations);
    } catch (error) {
      if (error instanceof StorageConflictError) throw new CmsConflictError();
      throw error;
    }
  }

  #now(): Date {
    const now = (this.#options.clock ?? (() => new Date()))();
    if (!(now instanceof Date) || !Number.isFinite(now.getTime()) || now.getTime() < 0 ||
        now.getTime() > 8_640_000_000_000_000 - 86_400_001) {
      throw new TypeError("Webhook clock must return a supported Date.");
    }
    return now;
  }

  #id(): string {
    const id = this.#options.idGenerator?.() ?? globalThis.crypto?.randomUUID?.();
    if (typeof id !== "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(id)) {
      throw new TypeError("Webhook ID generator must return 1 to 128 ASCII letters, numbers, underscores, or hyphens.");
    }
    return id;
  }

  async #initialize(): Promise<void> {
    const capabilities = this.#options.storage.getCapabilities().capabilities;
    for (const capability of ["atomicBatch", "conditionalWrites", "uniqueConstraints"] as const) {
      if (!capabilities[capability]) throw new CmsCapabilityError(capability);
    }
    this.#ready ??= Promise.all([
      this.#options.storage.registerCollection<CmsWebhookSubscription>({
        name: collections.subscriptions,
        indexes: [{ name: "by-tenant-enabled", fields: ["tenantId", "enabled"] }],
      }),
      this.#options.storage.registerCollection<CmsWebhookDelivery>({
        name: collections.deliveries,
        indexes: [
          { name: "by-event-subscription", fields: ["tenantId", "eventId", "subscriptionId"], unique: true },
          { name: "by-tenant-status-time", fields: ["tenantId", "status", "nextAttemptAt"] },
        ],
      }),
      this.#options.storage.registerCollection<CmsWebhookAttempt>({
        name: collections.attempts,
        indexes: [{ name: "by-delivery-number", fields: ["tenantId", "deliveryId", "number"], unique: true }],
      }),
      this.#options.storage.registerCollection<CmsAuditEvent>({
        name: collections.audit,
        indexes: [{ name: "by-tenant-resource", fields: ["tenantId", "resource", "resourceId", "timestamp"] }],
      }),
      this.#options.storage.registerCollection<CmsChangeEvent>({
        name: collections.changeEvents,
        indexes: [{ name: "by-tenant-id", fields: ["tenantId", "id"] }],
      }),
    ]).then(() => undefined);
    await this.#ready;
  }
}
