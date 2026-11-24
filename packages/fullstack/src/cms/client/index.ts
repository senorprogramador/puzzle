import type {
  CmsApiCreateOptions,
  CmsApiDocument,
  CmsApiChangeEventPage,
  CmsApiError,
  CmsApiErrorCode,
  CmsApiPage,
  CmsApiQueryInput,
  CmsApiRecord,
  CmsApiRevision,
  CmsApiSlugInput,
  CmsApiMutationInput,
  CmsApiRestoreRevisionInput,
  CmsApiScheduleInput,
  CmsApiSingletonCreateOptions,
  CmsApiTranslationCreateOptions,
  CmsApiUpdateOptions,
  CmsApiWebhookAttempt,
  CmsApiWebhookDelivery,
  CmsApiWebhookSubscription,
  CmsApiWebhookSubscriptionInput,
  CmsApiWebhookSubscriptionUpdateInput,
  CmsInvalidationKey,
  CmsQueryInvalidator,
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

export type CmsCollectionClient = {
  find(
    input?: CmsApiQueryInput,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiPage>;
  findById(
    id: string,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiDocument>;
  findBySlug(
    slug: string,
    input?: CmsApiSlugInput,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiDocument>;
  create(
    data: CmsApiRecord,
    input?: CmsApiCreateOptions,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiDocument>;
  update(
    id: string,
    data: CmsApiRecord,
    input: CmsApiUpdateOptions,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiDocument>;
  delete(
    id: string,
    input: CmsApiMutationInput,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiDocument>;
  purge(
    id: string,
    input: CmsApiMutationInput,
    options?: CmsClientRequestOptions,
  ): Promise<void>;
  publish(
    id: string,
    input: CmsApiMutationInput,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiDocument>;
  unpublish(
    id: string,
    input: CmsApiMutationInput,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiDocument>;
  archive(
    id: string,
    input: CmsApiMutationInput,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiDocument>;
  schedulePublish(
    id: string,
    input: CmsApiScheduleInput,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiDocument>;
  unschedule(
    id: string,
    input: CmsApiMutationInput,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiDocument>;
  listRevisions(
    id: string,
    first?: number,
    options?: CmsClientRequestOptions,
  ): Promise<readonly CmsApiRevision[]>;
  restoreRevision(
    id: string,
    input: CmsApiRestoreRevisionInput,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiDocument>;
  listLocaleVariants(
    id: string,
    input?: Omit<CmsApiQueryInput, "locale">,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiPage>;
  createTranslation(
    id: string,
    data: CmsApiRecord,
    input: CmsApiTranslationCreateOptions,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiDocument>;
  readonly public: {
    find(
      input?: CmsApiQueryInput,
      options?: CmsClientRequestOptions,
    ): Promise<CmsApiPage>;
    findById(
      id: string,
      options?: CmsClientRequestOptions,
    ): Promise<CmsApiDocument>;
    findBySlug(
      slug: string,
      input?: CmsApiSlugInput,
      options?: CmsClientRequestOptions,
    ): Promise<CmsApiDocument>;
  };
};

export type CmsSingletonClient = {
  find(
    input?: Pick<CmsApiQueryInput, "locale">,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiDocument>;
  create(
    data: CmsApiRecord,
    input?: CmsApiSingletonCreateOptions,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiDocument>;
  update(
    data: CmsApiRecord,
    input: CmsApiMutationInput & Pick<CmsApiCreateOptions, "locale">,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiDocument>;
  delete(
    input: CmsApiMutationInput & Pick<CmsApiCreateOptions, "locale">,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiDocument>;
  purge(
    input: CmsApiMutationInput & Pick<CmsApiCreateOptions, "locale">,
    options?: CmsClientRequestOptions,
  ): Promise<void>;
  publish(
    input: CmsApiMutationInput & Pick<CmsApiCreateOptions, "locale">,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiDocument>;
  unpublish(
    input: CmsApiMutationInput & Pick<CmsApiCreateOptions, "locale">,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiDocument>;
  archive(
    input: CmsApiMutationInput & Pick<CmsApiCreateOptions, "locale">,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiDocument>;
  schedulePublish(
    input: CmsApiScheduleInput & Pick<CmsApiCreateOptions, "locale">,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiDocument>;
  unschedule(
    input: CmsApiMutationInput & Pick<CmsApiCreateOptions, "locale">,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiDocument>;
  listRevisions(
    input?: { readonly first?: number } & Pick<CmsApiCreateOptions, "locale">,
    options?: CmsClientRequestOptions,
  ): Promise<readonly CmsApiRevision[]>;
  restoreRevision(
    revisionId: string,
    input: CmsApiMutationInput & Pick<CmsApiCreateOptions, "locale">,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiDocument>;
  createTranslation(
    data: CmsApiRecord,
    input: Pick<CmsApiTranslationCreateOptions, "locale" | "changeSummary">,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiDocument>;
  listLocaleVariants(
    input?: Omit<CmsApiQueryInput, "locale">,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiPage>;
  readonly public: {
    find(
      input?: Pick<CmsApiQueryInput, "locale">,
      options?: CmsClientRequestOptions,
    ): Promise<CmsApiDocument>;
  };
};

export type CmsClient = {
  collection(name: string): CmsCollectionClient;
  singleton(name: string): CmsSingletonClient;
  listWebhookSubscriptions(
    options?: CmsClientRequestOptions,
  ): Promise<readonly CmsApiWebhookSubscription[]>;
  getWebhookSubscription(
    subscriptionId: string,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiWebhookSubscription>;
  createWebhookSubscription(
    input: CmsApiWebhookSubscriptionInput,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiWebhookSubscription>;
  updateWebhookSubscription(
    subscriptionId: string,
    input: CmsApiWebhookSubscriptionUpdateInput,
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiWebhookSubscription>;
  listWebhookDeliveries(
    subscriptionId: string,
    first?: number,
    options?: CmsClientRequestOptions,
  ): Promise<readonly CmsApiWebhookDelivery[]>;
  listWebhookAttempts(
    deliveryId: string,
    first?: number,
    options?: CmsClientRequestOptions,
  ): Promise<readonly CmsApiWebhookAttempt[]>;
  retryWebhookDelivery(
    deliveryId: string,
    expectedRevision: number,
    options?: CmsClientRequestOptions,
  ): Promise<void>;
  listChangeEvents(
    input?: { readonly first?: number; readonly after?: string },
    options?: CmsClientRequestOptions,
  ): Promise<CmsApiChangeEventPage>;
  acknowledgeChangeEvent(
    eventId: string,
    expectedRevision: number,
    options?: CmsClientRequestOptions,
  ): Promise<void>;
  invalidateQueries(keys: readonly CmsInvalidationKey[]): Promise<void>;
};

const encode = (value: string): string => encodeURIComponent(value);

const queryString = (input: object): string => {
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

const clientErrorFrom = (
  response: Response,
  body: unknown,
): CmsClientError => {
  const detail =
    typeof body === "object" && body !== null && "error" in body
      ? (body as CmsApiError).error
      : undefined;
  const code =
    typeof detail?.code === "string" &&
    [
      "VALIDATION",
      "SCHEMA",
      "NOT_FOUND",
      "CONFLICT",
      "DUPLICATE",
      "PERMISSION_DENIED",
      "CAPABILITY",
      "SCHEDULER",
      "AUDIT",
      "INTERNAL",
      "UNAUTHENTICATED",
      "FORBIDDEN",
      "INVALID_REQUEST",
    ].includes(detail.code)
      ? detail.code as CmsApiErrorCode
      : "INTERNAL";
  return new CmsClientError(
    typeof detail?.message === "string"
      ? detail.message
      : "The CMS request failed.",
    { status: response.status, code },
  );
};

const normalizeBasePath = (basePath: string | undefined): string => {
  const value = (basePath ?? "/api/cms").trim();
  if (
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("?") ||
    value.includes("#")
  ) {
    throw new TypeError("basePath must be an absolute URL path.");
  }
  const normalized = `/${value.split("/").filter(Boolean).join("/")}`;
  return normalized === "/" ? "" : normalized;
};

const assertDocumentData = (data: CmsApiRecord): void => {
  if (
    !data ||
    typeof data !== "object" ||
    Array.isArray(data) ||
    ["tenantId", "actor", "user", "permissions"].some((key) =>
      Object.hasOwn(data, key),
    )
  ) {
    throw new TypeError("Tenant, actor, user, and permission values are resolved by the server.");
  }
};

export const createCmsClient = (
  options: CmsClientOptions = {},
): CmsClient => {
  const basePath = normalizeBasePath(options.basePath);
  const fetcher = options.fetch ?? ((input, init) => fetch(input, init));

  const request = async <T>(
    path: string,
    init: RequestInit = {},
  ): Promise<T> => {
    let response: Response;
    try {
      response = await fetcher(`${basePath}${path}`, {
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
    collection(name) {
      if (!name.trim()) throw new TypeError("collection name is required.");
      const base = `/collections/${encode(name)}`;
      const admin = `/admin${base}`;
      const publicPath = `/public${base}`;

      const readPage = async (
        path: string,
        input: CmsApiQueryInput | undefined,
        requestOptions: CmsClientRequestOptions | undefined,
      ): Promise<CmsApiPage> => {
        const result = await request<{ readonly page: CmsApiPage }>(
          `${path}${queryString(input ?? {})}`,
          { signal: requestOptions?.signal },
        );
        return result.page;
      };

      const readDocument = async (
        path: string,
        requestOptions: CmsClientRequestOptions | undefined,
      ): Promise<CmsApiDocument> => {
        const result = await request<{ readonly document: CmsApiDocument }>(
          path,
          { signal: requestOptions?.signal },
        );
        return result.document;
      };
      const mutateLifecycle = async (
        id: string,
        action: string,
        input: CmsApiMutationInput | CmsApiScheduleInput | CmsApiRestoreRevisionInput,
        requestOptions: CmsClientRequestOptions | undefined,
        invalidations: readonly CmsInvalidationKey[],
      ): Promise<CmsApiDocument> => {
        const result = await mutate<{ readonly document: CmsApiDocument }>(
          `${admin}/${encode(id)}/${action}`,
          json("POST", input, requestOptions?.signal),
          invalidations,
        );
        return result.document;
      };
      return {
        async find(input = {}, requestOptions) {
          return readPage(admin, input, requestOptions);
        },
        async findById(id, requestOptions) {
          return readDocument(`${admin}/${encode(id)}`, requestOptions);
        },
        async findBySlug(slug, input = {}, requestOptions) {
          return readDocument(
            `${admin}/by-slug/${encode(slug)}${queryString(input)}`,
            requestOptions,
          );
        },
        async create(data, input = {}, requestOptions) {
          assertDocumentData(data);
          const invalidations: CmsInvalidationKey[] = [
            {
              type: "admin-entries",
              contentType: name,
              ...(input.locale ? { locale: input.locale } : {}),
            },
            { type: "relationships", contentType: "*", fieldPath: "*" },
          ];
          const result = await mutate<{ readonly document: CmsApiDocument }>(
            admin,
            json("POST", { data, ...input }, requestOptions?.signal),
            invalidations,
          );
          return result.document;
        },
        async update(id, data, input, requestOptions) {
          assertDocumentData(data);
          const result = await mutate<{ readonly document: CmsApiDocument }>(
            `${admin}/${encode(id)}`,
            json("PATCH", { data, ...input }, requestOptions?.signal),
            [
              { type: "admin-entries", entryId: id },
              { type: "revisions", entryId: id },
              { type: "relationships", contentType: "*", fieldPath: "*" },
            ],
          );
          return result.document;
        },
        async delete(id, input, requestOptions) {
          const result = await mutate<{ readonly document: CmsApiDocument }>(
            `${admin}/${encode(id)}`,
            json("DELETE", input, requestOptions?.signal),
            [
              { type: "admin-entries", entryId: id },
              { type: "public-entries", entryId: id },
              { type: "revisions", entryId: id },
              { type: "audit", resourceId: id },
              { type: "relationships", contentType: "*", fieldPath: "*" },
            ],
          );
          return result.document;
        },
        async purge(id, input, requestOptions) {
          await mutate<{ readonly purged: true }>(
            `${admin}/${encode(id)}/permanent`,
            json("DELETE", input, requestOptions?.signal),
            [
              { type: "admin-entries", entryId: id },
              { type: "public-entries", entryId: id },
              { type: "revisions", entryId: id },
              { type: "audit", resourceId: id },
              { type: "relationships", contentType: "*", fieldPath: "*" },
            ],
          );
        },
        async publish(id, input, requestOptions) {
          return mutateLifecycle(
            id,
            "publish",
            input,
            requestOptions,
            [
              { type: "admin-entries", entryId: id },
              { type: "public-entries", entryId: id },
              { type: "revisions", entryId: id },
              { type: "relationships", contentType: "*", fieldPath: "*" },
              { type: "audit", resourceId: id },
            ],
          );
        },
        async unpublish(id, input, requestOptions) {
          return mutateLifecycle(
            id,
            "unpublish",
            input,
            requestOptions,
            [
              { type: "admin-entries", entryId: id },
              { type: "public-entries", entryId: id },
              { type: "revisions", entryId: id },
              { type: "relationships", contentType: "*", fieldPath: "*" },
              { type: "audit", resourceId: id },
            ],
          );
        },
        async archive(id, input, requestOptions) {
          return mutateLifecycle(
            id,
            "archive",
            input,
            requestOptions,
            [
              { type: "admin-entries", entryId: id },
              { type: "public-entries", entryId: id },
              { type: "revisions", entryId: id },
              { type: "audit", resourceId: id },
              { type: "relationships", contentType: "*", fieldPath: "*" },
            ],
          );
        },
        async schedulePublish(id, input, requestOptions) {
          return mutateLifecycle(
            id,
            "schedule",
            input,
            requestOptions,
            [
              { type: "admin-entries", entryId: id },
              { type: "revisions", entryId: id },
              { type: "audit", resourceId: id },
              { type: "relationships", contentType: "*", fieldPath: "*" },
            ],
          );
        },
        async unschedule(id, input, requestOptions) {
          return mutateLifecycle(
            id,
            "unschedule",
            input,
            requestOptions,
            [
              { type: "admin-entries", entryId: id },
              { type: "revisions", entryId: id },
              { type: "audit", resourceId: id },
              { type: "relationships", contentType: "*", fieldPath: "*" },
            ],
          );
        },
        async listRevisions(id, first, requestOptions) {
          const result = await request<{
            readonly revisions: readonly CmsApiRevision[];
          }>(
            `${admin}/${encode(id)}/revisions${queryString({ first })}`,
            { signal: requestOptions?.signal },
          );
          return result.revisions;
        },
        async restoreRevision(id, input, requestOptions) {
          return mutateLifecycle(
            id,
            "restore",
            input,
            requestOptions,
            [
              { type: "admin-entries", entryId: id },
              { type: "public-entries", entryId: id },
              { type: "revisions", entryId: id },
              { type: "audit", resourceId: id },
              { type: "relationships", contentType: "*", fieldPath: "*" },
            ],
          );
        },
        async listLocaleVariants(id, input = {}, requestOptions) {
          const result = await request<{ readonly page: CmsApiPage }>(
            `${admin}/${encode(id)}/translations${queryString(input)}`,
            { signal: requestOptions?.signal },
          );
          return result.page;
        },
        async createTranslation(id, data, input, requestOptions) {
          assertDocumentData(data);
          const result = await mutate<{ readonly document: CmsApiDocument }>(
            `${admin}/${encode(id)}/translations`,
            json("POST", { data, ...input }, requestOptions?.signal),
            [
              {
                type: "admin-entries",
                contentType: name,
                locale: input.locale,
              },
              { type: "relationships", contentType: "*", fieldPath: "*" },
            ],
          );
          return result.document;
        },
        public: {
          async find(input = {}, requestOptions) {
            return readPage(publicPath, input, requestOptions);
          },
          async findById(id, requestOptions) {
            return readDocument(`${publicPath}/${encode(id)}`, requestOptions);
          },
          async findBySlug(slug, input = {}, requestOptions) {
            return readDocument(
              `${publicPath}/by-slug/${encode(slug)}${queryString(input)}`,
              requestOptions,
            );
          },
        },
      };
    },
    singleton(name) {
      if (!name.trim()) throw new TypeError("collection name is required.");
      const base = `/collections/${encode(name)}`;
      const admin = `/admin${base}`;
      const publicPath = `/public${base}`;
      const readDocument = async (
        path: string,
        requestOptions: CmsClientRequestOptions | undefined,
      ): Promise<CmsApiDocument> => {
        const result = await request<{ readonly document: CmsApiDocument }>(
          path,
          { signal: requestOptions?.signal },
        );
        return result.document;
      };
      const mutateSingletonLifecycle = async (
        action: string,
        input: CmsApiMutationInput | CmsApiScheduleInput,
        requestOptions: CmsClientRequestOptions | undefined,
        invalidationsFor: (id: string) => readonly CmsInvalidationKey[],
      ): Promise<CmsApiDocument> => {
        const result = await request<{ readonly document: CmsApiDocument }>(
          `${admin}/${action}`,
          json("POST", input, requestOptions?.signal),
        );
        await invalidate(invalidationsFor(result.document.id));
        return result.document;
      };

      return {
        async find(input = {}, requestOptions) {
          return readDocument(
            `${admin}${queryString(input)}`,
            requestOptions,
          );
        },
        async create(data, input = {}, requestOptions) {
          assertDocumentData(data);
          const result = await mutate<{ readonly document: CmsApiDocument }>(
            admin,
            json("POST", { data, ...input }, requestOptions?.signal),
            [
              {
                type: "admin-entries",
                contentType: name,
                ...(input.locale ? { locale: input.locale } : {}),
              },
              { type: "relationships", contentType: "*", fieldPath: "*" },
            ],
          );
          return result.document;
        },
        async update(data, input, requestOptions) {
          assertDocumentData(data);
          const result = await mutate<{ readonly document: CmsApiDocument }>(
            admin,
            json("PATCH", { data, ...input }, requestOptions?.signal),
            [
              { type: "admin-entries", contentType: name },
              { type: "relationships", contentType: "*", fieldPath: "*" },
            ],
          );
          return result.document;
        },
        async delete(input, requestOptions) {
          const result = await mutate<{ readonly document: CmsApiDocument }>(
            admin,
            json("DELETE", input, requestOptions?.signal),
            [
              { type: "admin-entries", contentType: name },
              { type: "public-entries", contentType: name },
              { type: "audit" },
              { type: "relationships", contentType: "*", fieldPath: "*" },
            ],
          );
          return result.document;
        },
        async purge(input, requestOptions) {
          await mutate<{ readonly purged: true }>(
            `${admin}/permanent`,
            json("DELETE", input, requestOptions?.signal),
            [
              { type: "admin-entries", contentType: name },
              { type: "public-entries", contentType: name },
              { type: "audit" },
              { type: "relationships", contentType: "*", fieldPath: "*" },
            ],
          );
        },
        async publish(input, requestOptions) {
          return mutateSingletonLifecycle(
            "publish",
            input,
            requestOptions,
            (id) => [
              { type: "admin-entries", contentType: name, entryId: id },
              { type: "public-entries", contentType: name, entryId: id },
              { type: "revisions", entryId: id },
              { type: "audit", resourceId: id },
              { type: "relationships", contentType: "*", fieldPath: "*" },
            ],
          );
        },
        async unpublish(input, requestOptions) {
          return mutateSingletonLifecycle(
            "unpublish",
            input,
            requestOptions,
            (id) => [
              { type: "admin-entries", contentType: name, entryId: id },
              { type: "public-entries", contentType: name, entryId: id },
              { type: "revisions", entryId: id },
              { type: "audit", resourceId: id },
              { type: "relationships", contentType: "*", fieldPath: "*" },
            ],
          );
        },
        async archive(input, requestOptions) {
          return mutateSingletonLifecycle(
            "archive",
            input,
            requestOptions,
            (id) => [
              { type: "admin-entries", contentType: name, entryId: id },
              { type: "public-entries", contentType: name, entryId: id },
              { type: "revisions", entryId: id },
              { type: "audit", resourceId: id },
              { type: "relationships", contentType: "*", fieldPath: "*" },
            ],
          );
        },
        async schedulePublish(input, requestOptions) {
          return mutateSingletonLifecycle(
            "schedule",
            input,
            requestOptions,
            (id) => [
              { type: "admin-entries", contentType: name, entryId: id },
              { type: "revisions", entryId: id },
              { type: "audit", resourceId: id },
              { type: "relationships", contentType: "*", fieldPath: "*" },
            ],
          );
        },
        async unschedule(input, requestOptions) {
          return mutateSingletonLifecycle(
            "unschedule",
            input,
            requestOptions,
            (id) => [
              { type: "admin-entries", contentType: name, entryId: id },
              { type: "revisions", entryId: id },
              { type: "audit", resourceId: id },
              { type: "relationships", contentType: "*", fieldPath: "*" },
            ],
          );
        },
        async listRevisions(input = {}, requestOptions) {
          const result = await request<{
            readonly revisions: readonly CmsApiRevision[];
          }>(
            `${admin}/revisions${queryString(input)}`,
            { signal: requestOptions?.signal },
          );
          return result.revisions;
        },
        async restoreRevision(revisionId, input, requestOptions) {
          const result = await request<{ readonly document: CmsApiDocument }>(
            `${admin}/restore`,
            json("POST", { revisionId, ...input }, requestOptions?.signal),
          );
          await invalidate([
            { type: "admin-entries", contentType: name, entryId: result.document.id },
            { type: "public-entries", contentType: name, entryId: result.document.id },
            { type: "revisions", entryId: result.document.id },
            { type: "audit", resourceId: result.document.id },
            { type: "relationships", contentType: "*", fieldPath: "*" },
          ]);
          return result.document;
        },
        async createTranslation(data, input, requestOptions) {
          assertDocumentData(data);
          const result = await request<{ readonly document: CmsApiDocument }>(
            `${admin}/translations`,
            json("POST", { data, ...input }, requestOptions?.signal),
          );
          await invalidate([
            {
              type: "admin-entries",
              contentType: name,
              locale: input.locale,
            },
            { type: "relationships", contentType: "*", fieldPath: "*" },
          ]);
          return result.document;
        },
        async listLocaleVariants(input = {}, requestOptions) {
          const result = await request<{ readonly page: CmsApiPage }>(
            `${admin}/translations${queryString(input)}`,
            { signal: requestOptions?.signal },
          );
          return result.page;
        },
        public: {
          async find(input = {}, requestOptions) {
            return readDocument(
              `${publicPath}${queryString(input)}`,
              requestOptions,
            );
          },
        },
      };
    },
    async listWebhookSubscriptions(requestOptions) {
      const result = await request<{
        readonly subscriptions: readonly CmsApiWebhookSubscription[];
      }>("/admin/webhooks", { signal: requestOptions?.signal });
      return result.subscriptions;
    },
    async getWebhookSubscription(subscriptionId, requestOptions) {
      const result = await request<{ readonly subscription: CmsApiWebhookSubscription }>(
        `/admin/webhooks/${encode(subscriptionId)}`,
        { signal: requestOptions?.signal },
      );
      return result.subscription;
    },
    async createWebhookSubscription(input, requestOptions) {
      const result = await mutate<{ readonly subscription: CmsApiWebhookSubscription }>(
        "/admin/webhooks",
        json("POST", input, requestOptions?.signal),
        [{ type: "webhook-subscriptions" }, { type: "audit" }],
      );
      return result.subscription;
    },
    async updateWebhookSubscription(subscriptionId, input, requestOptions) {
      const result = await mutate<{ readonly subscription: CmsApiWebhookSubscription }>(
        `/admin/webhooks/${encode(subscriptionId)}`,
        json("PATCH", input, requestOptions?.signal),
        [
          { type: "webhook-subscriptions" },
          { type: "audit", resourceId: subscriptionId },
        ],
      );
      return result.subscription;
    },
    async listWebhookDeliveries(subscriptionId, first, requestOptions) {
      const result = await request<{
        readonly deliveries: readonly CmsApiWebhookDelivery[];
      }>(
        `/admin/webhooks/${encode(subscriptionId)}/deliveries${queryString({ first })}`,
        { signal: requestOptions?.signal },
      );
      return result.deliveries;
    },
    async listWebhookAttempts(deliveryId, first, requestOptions) {
      const result = await request<{
        readonly attempts: readonly CmsApiWebhookAttempt[];
      }>(
        `/admin/webhook-deliveries/${encode(deliveryId)}/attempts${queryString({ first })}`,
        { signal: requestOptions?.signal },
      );
      return result.attempts;
    },
    async retryWebhookDelivery(deliveryId, expectedRevision, requestOptions) {
      await mutate<{ readonly retried: true }>(
        `/admin/webhook-deliveries/${encode(deliveryId)}/retry`,
        json("POST", { expectedRevision }, requestOptions?.signal),
        [
          { type: "webhook-deliveries" },
          { type: "audit", resourceId: deliveryId },
        ],
      );
    },
    async listChangeEvents(input = {}, requestOptions) {
      return request<CmsApiChangeEventPage>(
        `/admin/change-events${queryString(input)}`,
        { signal: requestOptions?.signal },
      );
    },
    async acknowledgeChangeEvent(eventId, expectedRevision, requestOptions) {
      await mutate<{ readonly acknowledged: true }>(
        `/admin/change-events/${encode(eventId)}/ack`,
        json("POST", { expectedRevision }, requestOptions?.signal),
        [{ type: "change-events" }],
      );
    },
    async invalidateQueries(keys) {
      await invalidate(keys);
    },
  };
};
