import type {
  CmsApiAdminEntry,
  CmsApiAuditEvent,
  CmsApiContentType,
  CmsApiDate,
  CmsApiEntryMutationInput,
  CmsApiEntryPage,
  CmsApiEntryQuery,
  CmsApiError,
  CmsApiErrorCode,
  CmsApiFindPublishedInput,
  CmsApiListAuditEventsInput,
  CmsApiListContentTypesInput,
  CmsApiListRevisionsInput,
  CmsApiPublication,
  CmsApiRegisterContentTypeInput,
  CmsApiRestoreRevisionInput,
  CmsApiRevision,
  CmsApiScheduleEntryInput,
  CmsApiUpdateEntryInput,
  CmsApiWebhookSubscription,
  CmsApiWebhookSubscriptionInput,
  CmsApiWebhookSubscriptionUpdateInput,
  CmsApiWebhookDelivery,
  CmsApiWebhookAttempt,
  CmsInvalidationKey,
  CmsPublishedEntry,
  CmsPublishedEntryPage,
  CmsQueryInvalidator,
  CmsRelationshipLookupInput,
  CmsRelationshipLookupResult,
} from "../shared";

export type CmsClientErrorOptions = {
  readonly status: number;
  readonly code: CmsApiErrorCode;
  readonly retryable?: boolean;
};

export class CmsClientError extends Error {
  readonly status: number;
  readonly code: CmsApiErrorCode;
  readonly retryable: boolean;

  constructor(message: string, options: CmsClientErrorOptions) {
    super(message);
    this.name = "CmsClientError";
    this.status = options.status;
    this.code = options.code;
    this.retryable =
      options.retryable ??
      (options.status === 408 ||
        options.status === 425 ||
        options.status === 429 ||
        options.status >= 500);
  }
}

export class CmsInvalidationError extends Error {
  readonly mutationCommitted = true;
  readonly invalidations: readonly CmsInvalidationKey[];
  override readonly cause?: unknown;

  constructor(invalidations: readonly CmsInvalidationKey[], cause: unknown) {
    super(
      "The CMS mutation committed, but query invalidation failed. Refresh affected data before continuing.",
    );
    this.name = "CmsInvalidationError";
    this.invalidations = invalidations;
    this.cause = cause;
  }
}

export type CmsClientRequestOptions = {
  readonly signal?: AbortSignal;
};

export type CmsClientOptions = {
  readonly basePath?: string;
  readonly fetch?: typeof fetch;
  readonly onInvalidate?: CmsQueryInvalidator;
};

export type CmsClient = {
  listContentTypes(
    input?: CmsApiListContentTypesInput,
    options?: CmsClientRequestOptions,
  ): Promise<readonly CmsApiContentType[]>;
  getContentType(
    slug: string,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiContentType>;
  registerContentType(
    input: CmsApiRegisterContentTypeInput,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiContentType>;
  listEntries(
    input: CmsApiEntryQuery,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiEntryPage>;
  getEntry(
    entryId: string,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiAdminEntry>;
  createEntry(
    input: CmsApiEntryCreateInput,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiAdminEntry>;
  saveDraft(
    entryId: string,
    input: CmsApiUpdateEntryInput,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiAdminEntry>;
  deleteEntry(
    entryId: string,
    input: CmsApiEntryMutationInput,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiAdminEntry>;
  archiveEntry(
    entryId: string,
    input: CmsApiEntryMutationInput,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiAdminEntry>;
  restoreRevision(
    entryId: string,
    input: CmsApiRestoreRevisionInput,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiAdminEntry>;
  publish(
    entryId: string,
    input: CmsApiEntryMutationInput,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiAdminEntry>;
  unpublish(
    entryId: string,
    input: CmsApiEntryMutationInput,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiAdminEntry>;
  schedulePublish(
    entryId: string,
    input: CmsApiScheduleEntryInput,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiAdminEntry>;
  unschedule(
    entryId: string,
    input: CmsApiEntryMutationInput,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiAdminEntry>;
  listRevisions(
    input: CmsApiListRevisionsInput,
    options?: CmsClientRequestOptions,
  ): Promise<readonly CmsApiRevision[]>;
  listLocaleVariants(
    entryId: string,
    first?: number,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiEntryPage>;
  listRelationshipOptions(
    input: CmsRelationshipLookupInput,
    options?: CmsClientRequestOptions,
  ): Promise<CmsRelationshipLookupResult>;
  listAuditEvents(
    input?: CmsApiListAuditEventsInput,
    options?: CmsClientRequestOptions,
  ): Promise<readonly CmsApiAuditEvent[]>;
  listWebhookSubscriptions(options?: CmsClientRequestOptions): Promise<readonly CmsApiWebhookSubscription[]>;
  getWebhookSubscription(subscriptionId: string, options?: CmsClientRequestOptions): Promise<CmsApiWebhookSubscription>;
  createWebhookSubscription(input: CmsApiWebhookSubscriptionInput, options?: CmsClientRequestOptions): Promise<CmsApiWebhookSubscription>;
  updateWebhookSubscription(subscriptionId: string, input: CmsApiWebhookSubscriptionUpdateInput, options?: CmsClientRequestOptions): Promise<CmsApiWebhookSubscription>;
  listWebhookDeliveries(subscriptionId: string, first?: number, options?: CmsClientRequestOptions): Promise<readonly CmsApiWebhookDelivery[]>;
  listWebhookAttempts(deliveryId: string, first?: number, options?: CmsClientRequestOptions): Promise<readonly CmsApiWebhookAttempt[]>;
  retryWebhookDelivery(deliveryId: string, expectedRevision: number, options?: CmsClientRequestOptions): Promise<void>;
  getPublishedEntry(
    entryId: string,
    options?: CmsClientRequestOptions,
  ): Promise<CmsPublishedEntry>;
  findPublishedEntry(
    input: CmsApiFindPublishedInput,
    options?: CmsClientRequestOptions,
  ): Promise<CmsPublishedEntry>;
  listPublishedEntries(
    input: CmsApiEntryQuery,
    options?: CmsClientRequestOptions,
  ): Promise<CmsPublishedEntryPage>;
  publishScheduled(
    publication: CmsApiPublication,
    options?: CmsClientRequestOptions,
  ): Promise<
    | { readonly published: true; readonly entry: CmsApiAdminEntry }
    | { readonly published: false; readonly reason: "stale" | "not-due" }
  >;
  invalidateQueries(keys: readonly CmsInvalidationKey[]): Promise<void>;
};

export type CmsApiEntryCreateInput = Omit<
  import("../shared").CmsApiCreateEntryInput,
  "translationGroupId"
> & {
  readonly translationGroupId?: string;
};

const encode = (value: string): string => encodeURIComponent(value);

const queryString = (input: Readonly<Record<string, unknown>>): string => {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(input)) {
    if (value === undefined) continue;
    query.set(
      key,
      Array.isArray(value) || (typeof value === "object" && value !== null)
        ? JSON.stringify(value)
        : String(value),
    );
  }
  const result = query.toString();
  return result ? `?${result}` : "";
};

const apiPath = (basePath: string, path: string): string =>
  `${basePath}${path}`;

const clientErrorFrom = (
  response: Response,
  body: unknown,
): CmsClientError => {
  const detail =
    typeof body === "object" && body !== null && "error" in body
      ? (body as CmsApiError).error
      : undefined;
  return new CmsClientError(
    typeof detail?.message === "string"
      ? detail.message
      : "The CMS request failed.",
    {
      status: response.status,
      code:
        typeof detail?.code === "string"
          ? detail.code
          : "INTERNAL",
    },
  );
};

export const createCmsClient = (
  options: CmsClientOptions = {},
): CmsClient => {
  const basePath = (options.basePath ?? "/api/cms").replace(/\/+$/, "");
  if (
    !basePath.startsWith("/") ||
    basePath.startsWith("//") ||
    basePath.includes("?") ||
    basePath.includes("#")
  ) {
    throw new TypeError("basePath must be an absolute URL path.");
  }
  const fetcher = options.fetch ?? ((input, init) => fetch(input, init));

  const request = async <T>(
    path: string,
    init: RequestInit = {},
  ): Promise<T> => {
    let response: Response;
    try {
      response = await fetcher(apiPath(basePath, path), {
        ...init,
        cache: "no-store",
        credentials: "same-origin",
        headers: {
          ...(init.body ? { "Content-Type": "application/json" } : {}),
          ...init.headers,
        },
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") throw error;
      throw new CmsClientError("The CMS service could not be reached.", {
        status: 503,
        code: "CAPABILITY",
        retryable: true,
      });
    }

    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = null;
    }
    if (!response.ok) throw clientErrorFrom(response, body);
    return body as T;
  };

  const invalidate = async (
    keys: readonly CmsInvalidationKey[],
  ): Promise<void> => {
    if (!options.onInvalidate) return;
    try {
      await options.onInvalidate(keys);
    } catch (error) {
      throw new CmsInvalidationError(keys, error);
    }
  };

  const mutate = async <T>(
    path: string,
    init: RequestInit,
    invalidations: readonly CmsInvalidationKey[],
  ): Promise<T> => {
    const result = await request<T>(path, init);
    await invalidate(invalidations);
    return result;
  };

  const json = (method: string, body: unknown, signal?: AbortSignal): RequestInit => ({
    method,
    body: JSON.stringify(body),
    signal,
  });

  return {
    async listContentTypes(input = {}, requestOptions) {
      const result = await request<{ readonly contentTypes: readonly CmsApiContentType[] }>(
        `/admin/content-types${queryString(input)}`,
        { signal: requestOptions?.signal },
      );
      return result.contentTypes;
    },
    async getContentType(slug, requestOptions) {
      const result = await request<{ readonly contentType: CmsApiContentType }>(
        `/admin/content-types/${encode(slug)}`,
        { signal: requestOptions?.signal },
      );
      return result.contentType;
    },
    async registerContentType(input, requestOptions) {
      const result = await mutate<{ readonly contentType: CmsApiContentType }>(
        "/admin/content-types",
        json("POST", input, requestOptions?.signal),
        [
          { type: "content-types" },
          { type: "admin-entries" },
          { type: "public-entries" },
        ],
      );
      return result.contentType;
    },
    async listEntries(input, requestOptions) {
      const result = await request<{ readonly page: CmsApiEntryPage }>(
        `/admin/entries${queryString(input)}`,
        { signal: requestOptions?.signal },
      );
      return result.page;
    },
    async getEntry(entryId, requestOptions) {
      const result = await request<{ readonly entry: CmsApiAdminEntry }>(
        `/admin/entries/${encode(entryId)}`,
        { signal: requestOptions?.signal },
      );
      return result.entry;
    },
    async createEntry(input, requestOptions) {
      const result = await mutate<{ readonly entry: CmsApiAdminEntry }>(
        "/admin/entries",
        json("POST", input, requestOptions?.signal),
        [
          { type: "admin-entries", contentType: input.contentType, locale: input.locale },
          { type: "relationships", contentType: "*", fieldPath: "*" },
        ],
      );
      return result.entry;
    },
    async saveDraft(entryId, input, requestOptions) {
      const result = await mutate<{ readonly entry: CmsApiAdminEntry }>(
        `/admin/entries/${encode(entryId)}`,
        json("PATCH", input, requestOptions?.signal),
        [
          { type: "admin-entries", entryId },
          { type: "revisions", entryId },
          { type: "relationships", contentType: "*", fieldPath: "*" },
        ],
      );
      return result.entry;
    },
    async deleteEntry(entryId, input, requestOptions) {
      const result = await mutate<{ readonly entry: CmsApiAdminEntry }>(
        `/admin/entries/${encode(entryId)}`,
        json("DELETE", input, requestOptions?.signal),
        [
          { type: "admin-entries", entryId },
          { type: "public-entries", entryId },
          { type: "revisions", entryId },
          { type: "audit", resourceId: entryId },
          { type: "relationships", contentType: "*", fieldPath: "*" },
        ],
      );
      return result.entry;
    },
    async archiveEntry(entryId, input, requestOptions) {
      const result = await mutate<{ readonly entry: CmsApiAdminEntry }>(
        `/admin/entries/${encode(entryId)}/archive`,
        json("POST", input, requestOptions?.signal),
        [
          { type: "admin-entries", entryId },
          { type: "public-entries", entryId },
          { type: "revisions", entryId },
          { type: "audit", resourceId: entryId },
          { type: "relationships", contentType: "*", fieldPath: "*" },
        ],
      );
      return result.entry;
    },
    async restoreRevision(entryId, input, requestOptions) {
      const result = await mutate<{ readonly entry: CmsApiAdminEntry }>(
        `/admin/entries/${encode(entryId)}/restore`,
        json("POST", input, requestOptions?.signal),
        [
          { type: "admin-entries", entryId },
          { type: "public-entries", entryId },
          { type: "revisions", entryId },
          { type: "audit", resourceId: entryId },
          { type: "relationships", contentType: "*", fieldPath: "*" },
        ],
      );
      return result.entry;
    },
    async publish(entryId, input, requestOptions) {
      const result = await mutate<{ readonly entry: CmsApiAdminEntry }>(
        `/admin/entries/${encode(entryId)}/publish`,
        json("POST", input, requestOptions?.signal),
        [
          { type: "admin-entries", entryId },
          { type: "public-entries", entryId },
          { type: "revisions", entryId },
          { type: "relationships", contentType: "*", fieldPath: "*" },
          { type: "audit", resourceId: entryId },
        ],
      );
      return result.entry;
    },
    async unpublish(entryId, input, requestOptions) {
      const result = await mutate<{ readonly entry: CmsApiAdminEntry }>(
        `/admin/entries/${encode(entryId)}/unpublish`,
        json("POST", input, requestOptions?.signal),
        [
          { type: "admin-entries", entryId },
          { type: "public-entries", entryId },
          { type: "revisions", entryId },
          { type: "relationships", contentType: "*", fieldPath: "*" },
          { type: "audit", resourceId: entryId },
        ],
      );
      return result.entry;
    },
    async schedulePublish(entryId, input, requestOptions) {
      const result = await mutate<{ readonly entry: CmsApiAdminEntry }>(
        `/admin/entries/${encode(entryId)}/schedule`,
        json("POST", input, requestOptions?.signal),
        [
          { type: "admin-entries", entryId },
          { type: "revisions", entryId },
          { type: "audit", resourceId: entryId },
          { type: "relationships", contentType: "*", fieldPath: "*" },
        ],
      );
      return result.entry;
    },
    async unschedule(entryId, input, requestOptions) {
      const result = await mutate<{ readonly entry: CmsApiAdminEntry }>(
        `/admin/entries/${encode(entryId)}/unschedule`,
        json("POST", input, requestOptions?.signal),
        [
          { type: "admin-entries", entryId },
          { type: "revisions", entryId },
          { type: "audit", resourceId: entryId },
          { type: "relationships", contentType: "*", fieldPath: "*" },
        ],
      );
      return result.entry;
    },
    async listRevisions(input, requestOptions) {
      const { entryId, ...query } = input;
      const result = await request<{ readonly revisions: readonly CmsApiRevision[] }>(
        `/admin/entries/${encode(entryId)}/revisions${queryString(query)}`,
        { signal: requestOptions?.signal },
      );
      return result.revisions;
    },
    async listLocaleVariants(entryId, first, requestOptions) {
      const result = await request<{ readonly page: CmsApiEntryPage }>(
        `/admin/entries/${encode(entryId)}/translations${queryString({ first })}`,
        { signal: requestOptions?.signal },
      );
      return result.page;
    },
    async listRelationshipOptions(input, requestOptions) {
      const result = await request<CmsRelationshipLookupResult>(
        `/admin/relationships${queryString(input)}`,
        { signal: requestOptions?.signal },
      );
      return result;
    },
    async listAuditEvents(input = {}, requestOptions) {
      const result = await request<{ readonly events: readonly CmsApiAuditEvent[] }>(
        `/admin/audit${queryString(input)}`,
        { signal: requestOptions?.signal },
      );
      return result.events;
    },
    async listWebhookSubscriptions(requestOptions) {
      const result = await request<{ readonly subscriptions: readonly CmsApiWebhookSubscription[] }>(
        "/admin/webhooks", { signal: requestOptions?.signal },
      );
      return result.subscriptions;
    },
    async getWebhookSubscription(subscriptionId, requestOptions) {
      const result = await request<{ readonly subscription: CmsApiWebhookSubscription }>(
        `/admin/webhooks/${encode(subscriptionId)}`, { signal: requestOptions?.signal },
      );
      return result.subscription;
    },
    async createWebhookSubscription(input, requestOptions) {
      const result = await mutate<{ readonly subscription: CmsApiWebhookSubscription }>(
        "/admin/webhooks", json("POST", input, requestOptions?.signal),
        [{ type: "webhook-subscriptions" }, { type: "audit" }],
      );
      return result.subscription;
    },
    async updateWebhookSubscription(subscriptionId, input, requestOptions) {
      const result = await mutate<{ readonly subscription: CmsApiWebhookSubscription }>(
        `/admin/webhooks/${encode(subscriptionId)}`, json("PATCH", input, requestOptions?.signal),
        [{ type: "webhook-subscriptions" }, { type: "audit", resourceId: subscriptionId }],
      );
      return result.subscription;
    },
    async listWebhookDeliveries(subscriptionId, first, requestOptions) {
      const result = await request<{ readonly deliveries: readonly CmsApiWebhookDelivery[] }>(
        `/admin/webhooks/${encode(subscriptionId)}/deliveries${queryString({ first })}`,
        { signal: requestOptions?.signal },
      );
      return result.deliveries;
    },
    async listWebhookAttempts(deliveryId, first, requestOptions) {
      const result = await request<{ readonly attempts: readonly CmsApiWebhookAttempt[] }>(
        `/admin/webhook-deliveries/${encode(deliveryId)}/attempts${queryString({ first })}`,
        { signal: requestOptions?.signal },
      );
      return result.attempts;
    },
    async retryWebhookDelivery(deliveryId, expectedRevision, requestOptions) {
      await mutate<{ readonly retried: true }>(
        `/admin/webhook-deliveries/${encode(deliveryId)}/retry`,
        json("POST", { expectedRevision }, requestOptions?.signal),
        [{ type: "webhook-deliveries" }, { type: "audit", resourceId: deliveryId }],
      );
    },
    async getPublishedEntry(entryId, requestOptions) {
      const result = await request<{ readonly entry: CmsPublishedEntry }>(
        `/public/entries/${encode(entryId)}`,
        { signal: requestOptions?.signal },
      );
      return result.entry;
    },
    async findPublishedEntry(input, requestOptions) {
      const query = queryString({
        fallbackLocales: input.fallbackLocales,
      });
      const result = await request<{ readonly entry: CmsPublishedEntry }>(
        `/public/entries/by-slug/${encode(input.contentType)}/${encode(input.locale)}/${encode(input.slug)}${query}`,
        { signal: requestOptions?.signal },
      );
      return result.entry;
    },
    async listPublishedEntries(input, requestOptions) {
      const result = await request<{ readonly page: CmsPublishedEntryPage }>(
        `/public/entries${queryString(input)}`,
        { signal: requestOptions?.signal },
      );
      return result.page;
    },
    async publishScheduled(publication, requestOptions) {
      return mutate(
        "/scheduler/publications",
        json("POST", { publication }, requestOptions?.signal),
        [
          { type: "admin-entries", entryId: publication.entryId },
          { type: "public-entries", entryId: publication.entryId },
          { type: "revisions", entryId: publication.entryId },
          { type: "audit", resourceId: publication.entryId },
          { type: "relationships", contentType: "*", fieldPath: "*" },
        ],
      );
    },
    async invalidateQueries(keys) {
      await invalidate(keys);
    },
  };
};
