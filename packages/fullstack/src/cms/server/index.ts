import {
  CMS_WEBHOOK_EVENTS,
  CmsWebhookService,
  createCms,
  type CmsAccessAction,
  type CmsContext,
  type CmsVisibility,
  type CmsWebhookAttempt,
  type CmsWebhookDelivery,
  type CmsWebhookServiceOptions,
  type CmsWebhookSubscription,
} from "@puzzle-ui/cms";
import type {
  CmsApiDocument,
  CmsApiChangeEvent,
  CmsApiChangeEventPage,
  CmsApiError,
  CmsApiErrorCode,
  CmsApiMutationInput,
  CmsApiPage,
  CmsApiQueryInput,
  CmsApiRevision,
  CmsApiRestoreRevisionInput,
  CmsApiScheduledPublicationResult,
  CmsApiWebhookAttempt,
  CmsApiWebhookDelivery,
  CmsApiWebhookEventType,
  CmsApiWebhookSubscription,
  CmsApiWebhookSubscriptionInput,
} from "../shared";

type CmsFactoryOptions = Parameters<typeof createCms>[0];

export type CmsRouteAccess = {
  readonly context: CmsContext;
  readonly action: CmsAccessAction;
  readonly resource: "entry" | "revision" | "webhook" | "changeEvent";
  readonly collection: string;
  readonly request: Request;
  readonly resourceId?: string;
  readonly visibility: CmsVisibility;
};

export type CmsAuthorization = (
  access: CmsRouteAccess,
) => boolean | Promise<boolean>;

export type CmsServerOptions<
  Config extends CmsFactoryOptions["config"] = CmsFactoryOptions["config"],
> = Omit<
  CmsFactoryOptions,
  "context" | "config" | "scheduler" | "accessPolicy"
> & {
  readonly config: Config;
  readonly accessPolicy: NonNullable<CmsFactoryOptions["accessPolicy"]>;
  readonly scheduler: NonNullable<CmsFactoryOptions["scheduler"]>;
  readonly webhooks?: Omit<
    CmsWebhookServiceOptions,
    "storage" | "accessPolicy" | "clock" | "idGenerator"
  > & {
    readonly resolveSecretRef: (input: {
      readonly context: CmsContext;
      readonly request: Request;
      readonly purpose: "create" | "rotate";
      readonly subscriptionId?: string;
    }) => Promise<string>;
  };
  readonly basePath?: string;
  readonly resolveContext: (
    request: Request,
  ) => Promise<CmsContext | null> | CmsContext | null;
  readonly authorize: CmsAuthorization;
};

export type CmsHttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export type CmsRouteHandler = (
  request: Request,
  params: Readonly<Record<string, string>>,
) => Promise<Response>;

export type CmsRouteHandlerMap = Readonly<
  Record<string, Readonly<Partial<Record<CmsHttpMethod, CmsRouteHandler>>>>
>;

export type CmsServer = {
  readonly routes: CmsRouteHandlerMap;
  dispatch(request: Request): Promise<Response>;
};

type OperationResult = {
  readonly body: unknown;
  readonly status?: number;
};

type CmsRequestState = {
  readonly context: CmsContext;
  readonly cms: ReturnType<typeof createCms>;
};

type Operation = (
  request: Request,
  params: Readonly<Record<string, string>>,
  state: CmsRequestState,
) => Promise<OperationResult>;

type DynamicCmsCollection = Record<string, unknown>;

class CmsHttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: CmsApiErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "CmsHttpError";
  }
}

const noStoreHeaders = {
  "Cache-Control": "no-store, max-age=0, must-revalidate",
  "Content-Type": "application/json; charset=utf-8",
  Expires: "0",
  Pragma: "no-cache",
  Vary: "Cookie, Authorization",
} as const;

const identityKeys = new Set(["tenantId", "actor", "user", "permissions"]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const jsonResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), { status, headers: noStoreHeaders });

const emptyResponse = (status: number, headers: HeadersInit = {}): Response =>
  new Response(null, {
    status,
    headers: { ...noStoreHeaders, ...headers },
  });

const serializable = <T>(value: T): T =>
  JSON.parse(JSON.stringify(value)) as T;

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

const decodeSegments = (pathname: string): string[] | null => {
  try {
    return pathname.split("/").filter(Boolean).map(decodeURIComponent);
  } catch {
    return null;
  }
};

const matchRoute = (
  routes: CmsRouteHandlerMap,
  pathname: string,
): { readonly route: string; readonly params: Readonly<Record<string, string>> } | null => {
  const pathSegments = decodeSegments(pathname);
  if (!pathSegments) return null;
  for (const route of Object.keys(routes)) {
    const routeSegments = decodeSegments(route);
    if (!routeSegments || routeSegments.length !== pathSegments.length) continue;
    const params: Record<string, string> = {};
    let matched = true;
    for (const [index, segment] of routeSegments.entries()) {
      if (segment.startsWith(":")) {
        params[segment.slice(1)] = pathSegments[index]!;
      } else if (segment !== pathSegments[index]) {
        matched = false;
        break;
      }
    }
    if (matched) return { route, params };
  }
  return null;
};

const requiredString = (
  value: unknown,
  path: string,
  maxLength = 500,
): string => {
  if (typeof value !== "string" || !value.trim() || value.length > maxLength) {
    throw new CmsHttpError(400, "INVALID_REQUEST", `${path} is invalid.`);
  }
  return value;
};

const optionalString = (
  value: unknown,
  path: string,
  maxLength = 2_000,
): string | undefined => {
  if (value === undefined) return undefined;
  if (typeof value !== "string" || value.length > maxLength) {
    throw new CmsHttpError(400, "INVALID_REQUEST", `${path} is invalid.`);
  }
  return value;
};

const positiveInteger = (
  value: string | undefined,
  path: string,
  fallback: number,
  maximum: number,
): number => {
  if (value === undefined) return fallback;
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1 || number > maximum) {
    throw new CmsHttpError(
      400,
      "INVALID_REQUEST",
      `${path} must be an integer from 1 to ${maximum}.`,
    );
  }
  return number;
};

const parseJson = async (request: Request): Promise<Record<string, unknown>> => {
  let value: unknown;
  try {
    value = await request.json();
  } catch {
    throw new CmsHttpError(400, "INVALID_REQUEST", "The request body must be valid JSON.");
  }
  if (!isRecord(value)) {
    throw new CmsHttpError(400, "INVALID_REQUEST", "The request body must be a JSON object.");
  }
  return value;
};

const rejectClientIdentity = (record: Record<string, unknown>): void => {
  if (Object.keys(record).some((key) => identityKeys.has(key))) {
    throw new CmsHttpError(
      400,
      "INVALID_REQUEST",
      "Tenant, actor, user, and permission values are resolved by the server.",
    );
  }
};

const assertNoIdentityFilters = (where: unknown): void => {
  if (!isRecord(where)) {
    throw new CmsHttpError(400, "INVALID_REQUEST", "where must be an object.");
  }
  for (const [key, value] of Object.entries(where)) {
    if (identityKeys.has(key)) {
      throw new CmsHttpError(
        400,
        "INVALID_REQUEST",
        "Tenant, actor, user, and permission filters are not accepted.",
      );
    }
    if ((key === "and" || key === "or") && Array.isArray(value)) {
      value.forEach(assertNoIdentityFilters);
    }
  }
};

const readQueryValue = <T>(url: URL, name: string): T | undefined => {
  const value = url.searchParams.get(name);
  if (value === null) return undefined;
  try {
    return JSON.parse(value) as T;
  } catch {
    throw new CmsHttpError(400, "INVALID_REQUEST", `${name} must be valid JSON.`);
  }
};

const readQueryInput = (url: URL): CmsApiQueryInput => {
  const where = readQueryValue<unknown>(url, "where");
  if (where !== undefined) assertNoIdentityFilters(where);
  const sort = url.searchParams.get("sort") ?? undefined;
  const locale = url.searchParams.has("locale")
    ? requiredString(url.searchParams.get("locale"), "locale", 100)
    : undefined;
  const after = optionalString(url.searchParams.get("after") ?? undefined, "after", 10_000);
  return {
    ...(where === undefined ? {} : { where: where as CmsApiQueryInput["where"] }),
    ...(sort === undefined ? {} : { sort }),
    limit: positiveInteger(url.searchParams.get("limit") ?? undefined, "limit", 25, 100),
    page: positiveInteger(url.searchParams.get("page") ?? undefined, "page", 1, 100),
    ...(after === undefined ? {} : { after }),
    ...(locale === undefined ? {} : { locale }),
  };
};

const readLocaleFallbacks = (url: URL): readonly string[] | undefined => {
  const fallbackLocales = readQueryValue<unknown>(url, "fallbackLocales");
  if (fallbackLocales === undefined) return undefined;
  if (
    !Array.isArray(fallbackLocales) ||
    fallbackLocales.some((locale) => typeof locale !== "string")
  ) {
    throw new CmsHttpError(
      400,
      "INVALID_REQUEST",
      "fallbackLocales must be an array of locale strings.",
    );
  }
  return fallbackLocales;
};

const requestContextIsValid = (context: CmsContext | null): context is CmsContext =>
  Boolean(
    context &&
      typeof context.tenantId === "string" &&
      context.tenantId.trim() &&
      (context.actor === null ||
        (isRecord(context.actor) &&
          typeof context.actor.id === "string" &&
          context.actor.id.trim())),
  );

const statusForCode = (code: string): number => {
  switch (code) {
    case "VALIDATION":
    case "SCHEMA":
    case "INVALID_REQUEST":
      return 400;
    case "NOT_FOUND":
      return 404;
    case "CONFLICT":
    case "DUPLICATE":
      return 409;
    case "PERMISSION_DENIED":
    case "FORBIDDEN":
      return 403;
    case "UNAUTHENTICATED":
      return 401;
    case "CAPABILITY":
      return 501;
    case "SCHEDULER":
      return 503;
    default:
      return 500;
  }
};

const errorResponse = (error: unknown): Response => {
  if (error instanceof CmsHttpError) {
    return jsonResponse(
      { error: { code: error.code, message: error.message } } satisfies CmsApiError,
      error.status,
    );
  }
  const code =
    isRecord(error) && typeof error.code === "string"
      ? error.code
      : "INTERNAL";
  const recognized = [
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
  ].includes(code)
    ? code as CmsApiErrorCode
    : "INTERNAL";
  const details = isRecord(error) && isRecord(error.details)
    ? error.details
    : undefined;
  const issues = Array.isArray(details?.issues)
    ? details.issues.filter(
        (issue): issue is { path: string; code: string; message: string } =>
          isRecord(issue) &&
          typeof issue.path === "string" &&
          typeof issue.code === "string" &&
          typeof issue.message === "string",
      )
    : undefined;
  const message =
    error instanceof Error && recognized !== "INTERNAL"
      ? error.message
      : "The CMS request could not be completed.";
  return jsonResponse(
    {
      error: {
        code: recognized,
        message,
        ...(issues?.length ? { issues } : {}),
      },
    } satisfies CmsApiError,
    statusForCode(recognized),
  );
};

const collectionDefinition = (
  options: CmsServerOptions,
  name: string,
): Record<string, unknown> => {
  const config = options.config as unknown as {
    readonly collections?: Readonly<Record<string, unknown>>;
  };
  const definition = config.collections?.[name];
  if (!isRecord(definition)) {
    throw new CmsHttpError(404, "NOT_FOUND", "The configured CMS collection was not found.");
  }
  return definition;
};

const hasSlugField = (definition: Readonly<Record<string, unknown>>): boolean =>
  isRecord(definition.fields) &&
  Object.values(definition.fields).some(
    (field) => isRecord(field) && field.type === "slug",
  );

const collectionService = (
  cms: ReturnType<typeof createCms>,
  name: string,
): DynamicCmsCollection => {
  const service = (cms as unknown as Record<string, unknown>)[name];
  if (!isRecord(service)) {
    throw new CmsHttpError(404, "NOT_FOUND", "The configured CMS collection was not found.");
  }
  return service;
};

const invoke = async (
  service: DynamicCmsCollection,
  methodName: string,
  ...args: readonly unknown[]
): Promise<unknown> => {
  const method = service[methodName];
  if (typeof method !== "function") {
    throw new CmsHttpError(404, "NOT_FOUND", "The CMS operation is not available for this collection.");
  }
  return Reflect.apply(method, service, [...args]) as Promise<unknown>;
};

const invokeScheduler = async (
  cms: ReturnType<typeof createCms>,
  publication: {
    readonly entryId: string;
    readonly scheduledRevisionNumber: number;
    readonly publishAt: Date;
    readonly timeZone: string;
  },
): Promise<unknown> => {
  const scheduler = (cms as unknown as {
    readonly $scheduler?: Readonly<Record<string, unknown>>;
  }).$scheduler;
  const method = scheduler?.publishScheduled;
  if (typeof method !== "function") {
    throw new CmsHttpError(501, "CAPABILITY", "The configured CMS does not support this operation.");
  }
  return Reflect.apply(method, scheduler, [publication]) as Promise<unknown>;
};

const invokeNamespace = async (
  cms: ReturnType<typeof createCms>,
  namespaceName: string,
  methodName: string,
  ...args: readonly unknown[]
): Promise<unknown> => {
  const namespaces = cms as unknown as Record<string, unknown>;
  const namespace = namespaces[namespaceName];
  if (!isRecord(namespace)) {
    throw new CmsHttpError(501, "CAPABILITY", "The configured CMS does not support this operation.");
  }
  const method = namespace[methodName];
  if (typeof method !== "function") {
    throw new CmsHttpError(501, "CAPABILITY", "The configured CMS does not support this operation.");
  }
  return Reflect.apply(method, namespace, [...args]) as Promise<unknown>;
};

const publicMetadata = [
  "id",
  "slug",
  "locale",
  "publishedAt",
] as const;
const adminMetadata = [
  ...publicMetadata,
  "status",
  "createdAt",
  "updatedAt",
  "revision",
  "revisionNumber",
  "scheduledAt",
  "scheduledTimeZone",
  "scheduledRevisionNumber",
  "archivedAt",
  "deletedAt",
] as const;

const apiDocument = (
  options: CmsServerOptions,
  collection: string,
  value: unknown,
  visibility: "admin" | "public",
): CmsApiDocument => {
  if (!isRecord(value)) {
    throw new CmsHttpError(404, "NOT_FOUND", "The CMS document was not found.");
  }
  const serialized = serializable(value);
  if (!isRecord(serialized) || typeof serialized.id !== "string") {
    throw new CmsHttpError(500, "INTERNAL", "The CMS returned an invalid document.");
  }
  const definition = collectionDefinition(options, collection);
  const fields = isRecord(definition.fields) ? definition.fields : {};
  const result: Record<string, unknown> = {};
  const metadata = visibility === "public" ? publicMetadata : adminMetadata;
  for (const key of metadata) {
    if (key in serialized) result[key] = serialized[key];
  }
  for (const key of Object.keys(fields)) {
    if (identityKeys.has(key) || key in result || !(key in serialized)) continue;
    result[key] = serialized[key];
  }
  return result as unknown as CmsApiDocument;
};

const apiAnyDocument = (
  options: CmsServerOptions,
  value: unknown,
): CmsApiDocument => {
  if (!isRecord(value)) {
    throw new CmsHttpError(500, "INTERNAL", "The scheduler returned an invalid document.");
  }
  const serialized = serializable(value);
  if (!isRecord(serialized) || typeof serialized.id !== "string") {
    throw new CmsHttpError(500, "INTERNAL", "The scheduler returned an invalid document.");
  }
  const fields = new Set<string>();
  const collections = (
    options.config as unknown as {
      readonly collections: Readonly<Record<string, unknown>>;
    }
  ).collections;
  for (const definition of Object.values(collections)) {
    if (isRecord(definition) && isRecord(definition.fields)) {
      for (const key of Object.keys(definition.fields)) fields.add(key);
    }
  }
  const source = isRecord(serialized.fields)
    ? { ...serialized, ...serialized.fields }
    : serialized;
  const result: Record<string, unknown> = {};
  for (const key of adminMetadata) {
    if (key in source) result[key] = source[key];
  }
  for (const key of fields) {
    if (identityKeys.has(key) || key in result || !(key in source)) continue;
    result[key] = source[key];
  }
  return result as unknown as CmsApiDocument;
};

const apiScheduledPublicationResult = (
  options: CmsServerOptions,
  value: unknown,
): CmsApiScheduledPublicationResult => {
  if (!isRecord(value) || typeof value.published !== "boolean") {
    throw new CmsHttpError(500, "INTERNAL", "The scheduler returned an invalid result.");
  }
  if (value.published === false) {
    if (value.reason !== "stale" && value.reason !== "not-due") {
      throw new CmsHttpError(500, "INTERNAL", "The scheduler returned an invalid status.");
    }
    return { published: false, reason: value.reason };
  }
  return {
    published: true,
    entry: apiAnyDocument(options, value.entry),
  };
};

const apiPage = (
  options: CmsServerOptions,
  collection: string,
  value: unknown,
  visibility: "admin" | "public",
): CmsApiPage => {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    throw new CmsHttpError(500, "INTERNAL", "The CMS returned an invalid collection page.");
  }
  return {
    items: value.items.map((item) =>
      apiDocument(options, collection, item, visibility),
    ),
    nextCursor: typeof value.nextCursor === "string" ? value.nextCursor : null,
    hasNextPage: value.hasNextPage === true,
    ...(typeof value.page === "number" ? { page: value.page } : {}),
    ...(typeof value.limit === "number" ? { limit: value.limit } : {}),
  };
};

const apiDate = (value: Date | string): string =>
  value instanceof Date ? value.toISOString() : new Date(value).toISOString();

const apiRevision = (value: unknown): CmsApiRevision => {
  if (!isRecord(value)) {
    throw new CmsHttpError(500, "INTERNAL", "The CMS returned an invalid revision.");
  }
  const record = serializable(value);
  if (!isRecord(record)) {
    throw new CmsHttpError(500, "INTERNAL", "The CMS returned an invalid revision.");
  }
  const {
    tenantId: _tenantId,
    createdAt,
    updatedAt,
    ...publicRecord
  } = record;
  if (
    !(createdAt instanceof Date || typeof createdAt === "string") ||
    !(updatedAt instanceof Date || typeof updatedAt === "string")
  ) {
    throw new CmsHttpError(500, "INTERNAL", "The CMS returned invalid revision timestamps.");
  }
  return {
    ...publicRecord,
    createdAt: apiDate(createdAt),
    updatedAt: apiDate(updatedAt),
  } as unknown as CmsApiRevision;
};

const apiChangeEvent = (value: unknown): CmsApiChangeEvent => {
  if (!isRecord(value)) {
    throw new CmsHttpError(500, "INTERNAL", "The CMS returned an invalid change event.");
  }
  const record = serializable(value);
  if (!isRecord(record)) {
    throw new CmsHttpError(500, "INTERNAL", "The CMS returned an invalid change event.");
  }
  const {
    tenantId: _tenantId,
    fanoutLeaseUntil: _fanoutLeaseUntil,
    occurredAt,
    createdAt,
    updatedAt,
    ...publicEvent
  } = record;
  if (
    typeof occurredAt !== "string" ||
    typeof createdAt !== "string" ||
    typeof updatedAt !== "string"
  ) {
    throw new CmsHttpError(500, "INTERNAL", "The CMS returned invalid event timestamps.");
  }
  return {
    ...publicEvent,
    occurredAt: apiDate(occurredAt),
    createdAt: apiDate(createdAt),
    updatedAt: apiDate(updatedAt),
  } as unknown as CmsApiChangeEvent;
};

const apiChangeEventPage = (value: unknown): CmsApiChangeEventPage => {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    throw new CmsHttpError(500, "INTERNAL", "The CMS returned an invalid change event page.");
  }
  return {
    items: value.items.map(apiChangeEvent),
    nextCursor: typeof value.nextCursor === "string" ? value.nextCursor : null,
    hasNextPage: value.hasNextPage === true,
  };
};

const apiWebhookSubscription = (
  record: CmsWebhookSubscription,
): CmsApiWebhookSubscription => {
  const {
    tenantId: _tenantId,
    secretRef: _secretRef,
    createdAt,
    updatedAt,
    ...publicRecord
  } = record;
  return {
    ...publicRecord,
    createdAt: apiDate(createdAt),
    updatedAt: apiDate(updatedAt),
    secretConfigured: true,
  };
};

const apiWebhookDelivery = (
  record: CmsWebhookDelivery,
): CmsApiWebhookDelivery => {
  const {
    tenantId: _tenantId,
    leaseToken: _leaseToken,
    createdAt,
    updatedAt,
    nextAttemptAt,
    event,
    ...publicRecord
  } = record;
  return {
    ...publicRecord,
    event: { ...event, occurredAt: apiDate(event.occurredAt) },
    createdAt: apiDate(createdAt),
    updatedAt: apiDate(updatedAt),
    nextAttemptAt: apiDate(nextAttemptAt),
  };
};

const apiWebhookAttempt = (
  record: CmsWebhookAttempt,
): CmsApiWebhookAttempt => {
  const {
    tenantId: _tenantId,
    createdAt,
    updatedAt,
    startedAt,
    completedAt,
    ...publicRecord
  } = record;
  return {
    ...publicRecord,
    createdAt: apiDate(createdAt),
    updatedAt: apiDate(updatedAt),
    startedAt: apiDate(startedAt),
    completedAt: apiDate(completedAt),
  };
};

const webhookSubscriptionInput = (
  body: Record<string, unknown>,
): CmsApiWebhookSubscriptionInput => {
  rejectClientIdentity(body);
  if ("secretRef" in body || "secret" in body) {
    throw new CmsHttpError(400, "INVALID_REQUEST", "Webhook secrets are managed by the host.");
  }
  if (
    !Array.isArray(body.events) ||
    !body.events.every((value) =>
      CMS_WEBHOOK_EVENTS.some((event) => event === value),
    )
  ) {
    throw new CmsHttpError(400, "INVALID_REQUEST", "events contains an unsupported webhook event.");
  }
  if (typeof body.enabled !== "boolean") {
    throw new CmsHttpError(400, "INVALID_REQUEST", "enabled must be a boolean.");
  }
  return {
    endpoint: requiredString(body.endpoint, "endpoint", 2_048),
    events: body.events as readonly CmsApiWebhookEventType[],
    enabled: body.enabled,
  };
};

const dataFromBody = async (
  request: Request,
  requireData = true,
): Promise<{
  readonly data?: Record<string, unknown>;
  readonly slug?: string;
  readonly locale?: string;
  readonly translationGroupId?: string;
  readonly expectedRevision?: number;
  readonly changeSummary?: string;
}> => {
  const body = await parseJson(request);
  rejectClientIdentity(body);
  if (body.data === undefined && !requireData) {
    return {
      ...(body.locale === undefined
        ? {}
        : { locale: requiredString(body.locale, "locale", 100) }),
      ...(body.expectedRevision === undefined
        ? {}
        : { expectedRevision: expectedRevisionFromBody(body) }),
      ...(body.changeSummary === undefined
        ? {}
        : { changeSummary: optionalString(body.changeSummary, "changeSummary") }),
    };
  }
  if (!isRecord(body.data)) {
    throw new CmsHttpError(400, "INVALID_REQUEST", "data must be an object.");
  }
  rejectClientIdentity(body.data);
  return {
    data: body.data,
    ...(body.slug === undefined ? {} : { slug: requiredString(body.slug, "slug") }),
    ...(body.locale === undefined
      ? {}
      : { locale: requiredString(body.locale, "locale", 100) }),
    ...(body.translationGroupId === undefined
      ? {}
      : {
          translationGroupId: requiredString(
            body.translationGroupId,
            "translationGroupId",
          ),
        }),
    ...(body.expectedRevision === undefined
      ? {}
      : { expectedRevision: expectedRevisionFromBody(body) }),
    ...(body.changeSummary === undefined
      ? {}
      : { changeSummary: optionalString(body.changeSummary, "changeSummary") }),
  };
};

const expectedRevisionFromBody = (body: Record<string, unknown>): number => {
  const value = body.expectedRevision;
  if (!Number.isInteger(value) || typeof value !== "number" || value < 1) {
    throw new CmsHttpError(
      400,
      "INVALID_REQUEST",
      "expectedRevision must be a positive integer.",
    );
  }
  return value;
};

const mutationInputFromBody = (
  body: Record<string, unknown>,
): CmsApiMutationInput => {
  rejectClientIdentity(body);
  return {
    expectedRevision: expectedRevisionFromBody(body),
    ...(body.changeSummary === undefined
      ? {}
      : { changeSummary: optionalString(body.changeSummary, "changeSummary") }),
  };
};

const mutationInputWithLocale = (
  body: Record<string, unknown>,
): CmsApiMutationInput & { readonly locale?: string } => ({
  ...mutationInputFromBody(body),
  ...(body.locale === undefined
    ? {}
    : { locale: requiredString(body.locale, "locale", 100) }),
});

const scheduleInputFromBody = (
  body: Record<string, unknown>,
): {
  readonly expectedRevision: number;
  readonly publishAt: Date;
  readonly timeZone: string;
  readonly changeSummary?: string;
  readonly locale?: string;
} => {
  const mutation = mutationInputFromBody(body);
  const publishAt = new Date(requiredString(body.publishAt, "publishAt", 100));
  if (!Number.isFinite(publishAt.getTime())) {
    throw new CmsHttpError(400, "INVALID_REQUEST", "publishAt must be a valid date.");
  }
  return {
    ...mutation,
    publishAt,
    timeZone: requiredString(body.timeZone, "timeZone", 100),
    ...(body.locale === undefined
      ? {}
      : { locale: requiredString(body.locale, "locale", 100) }),
  };
};

const restoreInputFromBody = (
  body: Record<string, unknown>,
): CmsApiRestoreRevisionInput => ({
  ...mutationInputFromBody(body),
  revisionId: requiredString(body.revisionId, "revisionId"),
});

export const createCmsServer = (options: CmsServerOptions): CmsServer => {
  if (
    !options ||
    typeof options.resolveContext !== "function" ||
    typeof options.authorize !== "function"
  ) {
    throw new TypeError("CMS server requires context resolution and authorization callbacks.");
  }
  if (typeof options.accessPolicy !== "function") {
    throw new TypeError("CMS server requires an explicit CMS accessPolicy.");
  }
  if (
    !options.scheduler ||
    typeof options.scheduler.schedule !== "function" ||
    typeof options.scheduler.cancel !== "function"
  ) {
    throw new TypeError("CMS server lifecycle routes require an explicit scheduler.");
  }
  if (!options.storage || !options.config) {
    throw new TypeError("CMS server requires a code-first config and storage adapter.");
  }
  const config = options.config as unknown as {
    readonly collections?: Readonly<Record<string, unknown>>;
  };
  if (!isRecord(config.collections)) {
    throw new TypeError("CMS server requires a configured collections object.");
  }
  const basePath = normalizeBasePath(options.basePath);
  const {
    basePath: _basePath,
    resolveContext,
    authorize,
    webhooks,
    ...factoryOptions
  } = options;
  if (webhooks && typeof webhooks.resolveSecretRef !== "function") {
    throw new TypeError("Webhook routes require a host-managed secret reference resolver.");
  }
  if (webhooks && options.emitChangeEvents === false) {
    throw new TypeError("Webhook routes require change-event emission.");
  }
  const changeEventsEnabled =
    options.emitChangeEvents === true || webhooks !== undefined;
  const webhookService = webhooks
    ? new CmsWebhookService({
        ...(({ resolveSecretRef: _resolveSecretRef, ...serviceOptions }) => serviceOptions)(webhooks),
        storage: options.storage,
        accessPolicy: options.accessPolicy,
        ...(options.clock ? { clock: options.clock } : {}),
        ...(options.idGenerator ? { idGenerator: options.idGenerator } : {}),
      })
    : null;

  const secure = (
    collection: string,
    action: CmsRouteAccess["action"],
    resource: CmsRouteAccess["resource"],
    visibility: "admin" | "public",
    operation: Operation,
    resourceParam?: string,
  ): CmsRouteHandler =>
    async (request, params) => {
      let context: CmsContext | null;
      try {
        context = await resolveContext(request);
      } catch {
        throw new CmsHttpError(
          401,
          "UNAUTHENTICATED",
          "A valid actor and tenant context is required.",
        );
      }
      if (!requestContextIsValid(context)) {
        throw new CmsHttpError(
          401,
          "UNAUTHENTICATED",
          "A valid actor and tenant context is required.",
        );
      }
      if (visibility === "admin" && context.actor === null) {
        throw new CmsHttpError(401, "UNAUTHENTICATED", "Authentication is required.");
      }
      const resourceId = resourceParam ? params[resourceParam] : undefined;
      if (
        (await authorize({
          context,
          action,
          resource,
          collection,
          request,
          visibility,
          ...(resourceId ? { resourceId } : {}),
        })) !== true
      ) {
        throw new CmsHttpError(
          403,
          "FORBIDDEN",
          "The actor is not permitted to perform this operation.",
        );
      }
      const cms = createCms({
        ...factoryOptions,
        config: options.config,
        emitChangeEvents: changeEventsEnabled,
        context,
      });
      const result = await operation(request, params, { context, cms });
      return jsonResponse(result.body, result.status);
    };

  const addEntryLifecycleRoute = (
    collectionName: string,
    collectionBase: string,
    endpoint: string,
    action: CmsAccessAction,
    methodName: string,
    parseInput: (body: Record<string, unknown>) => unknown,
  ): void => {
    routes[`${collectionBase}/:documentId/${endpoint}`] = {
      POST: secure(
        collectionName,
        action,
        "entry",
        "admin",
        async (request, params, { cms }) => {
          const input = parseInput(await parseJson(request));
          const documentId = requiredString(params.documentId, "documentId");
          const args = methodName === "restoreRevision" && isRecord(input)
            ? [
                documentId,
                requiredString(input.revisionId, "revisionId"),
                {
                  expectedRevision: input.expectedRevision,
                  ...(input.changeSummary === undefined
                    ? {}
                    : { changeSummary: input.changeSummary }),
                },
              ]
            : [documentId, input];
          const result = await invoke(
            collectionService(cms, collectionName),
            methodName,
            ...args,
          );
          return {
            body: {
              document: apiDocument(options, collectionName, result, "admin"),
            },
          };
        },
        "documentId",
      ),
    };
  };

  const addSingletonLifecycleRoute = (
    collectionName: string,
    collectionBase: string,
    endpoint: string,
    action: CmsAccessAction,
    methodName: string,
    parseInput: (body: Record<string, unknown>) => unknown,
  ): void => {
    routes[`${collectionBase}/${endpoint}`] = {
      POST: secure(
        collectionName,
        action,
        "entry",
        "admin",
        async (request, _params, { cms }) => {
          const input = parseInput(await parseJson(request));
          const args = methodName === "restoreRevision" && isRecord(input)
            ? [
                requiredString(input.revisionId, "revisionId"),
                {
                  expectedRevision: input.expectedRevision,
                  ...(input.changeSummary === undefined
                    ? {}
                    : { changeSummary: input.changeSummary }),
                  ...(input.locale === undefined
                    ? {}
                    : { locale: input.locale }),
                },
              ]
            : [input];
          const result = await invoke(
            collectionService(cms, collectionName),
            methodName,
            ...args,
          );
          return {
            body: {
              document: apiDocument(options, collectionName, result, "admin"),
            },
          };
        },
      ),
    };
  };

  const routes: Record<string, Partial<Record<CmsHttpMethod, CmsRouteHandler>>> = {};
  for (const collectionName of Object.keys(config.collections)) {
    const base = `/collections/${encodeURIComponent(collectionName)}`;
    const definition = collectionDefinition(options, collectionName);
    const singleton = definition.kind === "singleton";
    const slugLookup = !singleton && hasSlugField(definition);
    const hasDrafts = definition.drafts === true;
    const localized = isRecord(definition.localization);
    routes[`/admin${base}`] = {
      GET: secure(
        collectionName,
        "entry:read",
        "entry",
        "admin",
        async (request, _params, { cms }) => {
          const url = new URL(request.url);
          if (singleton) {
            const locale = url.searchParams.has("locale")
              ? requiredString(url.searchParams.get("locale"), "locale", 100)
              : undefined;
            const result = await invoke(
              collectionService(cms, collectionName),
              "find",
              { ...(locale === undefined ? {} : { locale }), visibility: "admin" },
            );
            return {
              body: {
                document: apiDocument(options, collectionName, result, "admin"),
              },
            };
          }
          const query = readQueryInput(url);
          const result = await invoke(
            collectionService(cms, collectionName),
            "find",
            { ...query, visibility: "admin" },
          );
          return { body: { page: apiPage(options, collectionName, result, "admin") } };
        },
      ),
      POST: secure(
        collectionName,
        "entry:create",
        "entry",
        "admin",
        async (request, _params, { cms }) => {
          const {
            data,
            slug,
            locale,
            translationGroupId,
            changeSummary,
          } = await dataFromBody(request);
          if (!singleton && !hasSlugField(definition) && !slug) {
            throw new CmsHttpError(
              400,
              "INVALID_REQUEST",
              "slug is required for collections without a slug field.",
            );
          }
          const result = await invoke(
            collectionService(cms, collectionName),
            "create",
            data!,
            singleton
              ? {
                  ...(locale === undefined ? {} : { locale }),
                  ...(translationGroupId === undefined ? {} : { translationGroupId }),
                  ...(changeSummary === undefined ? {} : { changeSummary }),
                }
              : {
                  ...(slug === undefined ? {} : { slug }),
                  ...(locale === undefined ? {} : { locale }),
                  ...(translationGroupId === undefined
                    ? {}
                    : { translationGroupId }),
                  ...(changeSummary === undefined ? {} : { changeSummary }),
                },
          );
          return {
            body: { document: apiDocument(options, collectionName, result, "admin") },
            status: 201,
          };
        },
      ),
    };
    if (singleton) {
      routes[`/admin${base}`]!.PATCH = secure(
        collectionName,
        "entry:update",
        "entry",
        "admin",
        async (request, _params, { cms }) => {
          const {
            data,
            locale,
            expectedRevision,
            changeSummary,
          } = await dataFromBody(request);
          if (expectedRevision === undefined) {
            throw new CmsHttpError(400, "INVALID_REQUEST", "expectedRevision is required.");
          }
          const result = await invoke(
            collectionService(cms, collectionName),
            "update",
            data!,
            {
              expectedRevision,
              ...(locale === undefined ? {} : { locale }),
              ...(changeSummary === undefined ? {} : { changeSummary }),
            },
          );
          return {
            body: { document: apiDocument(options, collectionName, result, "admin") },
          };
        },
      );
      routes[`/admin${base}`]!.DELETE = secure(
        collectionName,
        "entry:delete",
        "entry",
        "admin",
        async (request, _params, { cms }) => {
          const {
            locale,
            expectedRevision,
            changeSummary,
          } = await dataFromBody(request, false);
          if (expectedRevision === undefined) {
            throw new CmsHttpError(400, "INVALID_REQUEST", "expectedRevision is required.");
          }
          const result = await invoke(
            collectionService(cms, collectionName),
            "delete",
            {
              expectedRevision,
              ...(locale === undefined ? {} : { locale }),
              ...(changeSummary === undefined ? {} : { changeSummary }),
            },
          );
          routes[`/admin${base}/permanent`] = {
            DELETE: secure(
              collectionName,
              "entry:delete",
              "entry",
              "admin",
              async (request, _params, { cms }) => {
                const mutation = mutationInputWithLocale(await parseJson(request));
                await invoke(
                  collectionService(cms, collectionName),
                  "purge",
                  mutation,
                );
                return { body: { purged: true } };
              },
            ),
          };
          return {
            body: { document: apiDocument(options, collectionName, result, "admin") },
          };
        },
      );
      const singletonBase = `/admin${base}`;
      addSingletonLifecycleRoute(
        collectionName,
        singletonBase,
        "archive",
        "entry:archive",
        "archive",
        mutationInputWithLocale,
      );
      if (hasDrafts) {
        addSingletonLifecycleRoute(
          collectionName,
          singletonBase,
          "publish",
          "entry:publish",
          "publish",
          mutationInputWithLocale,
        );
        addSingletonLifecycleRoute(
          collectionName,
          singletonBase,
          "unpublish",
          "entry:unpublish",
          "unpublish",
          mutationInputWithLocale,
        );
        addSingletonLifecycleRoute(
          collectionName,
          singletonBase,
          "restore",
          "entry:restore",
          "restoreRevision",
          restoreInputFromBody,
        );
        routes[`${singletonBase}/revisions`] = {
          GET: secure(
            collectionName,
            "revision:read",
            "revision",
            "admin",
            async (request, _params, { cms }) => {
              const url = new URL(request.url);
              const first = positiveInteger(
                url.searchParams.get("first") ?? undefined,
                "first",
                100,
                500,
              );
              const input = {
                first,
                ...(url.searchParams.has("locale")
                  ? { locale: requiredString(url.searchParams.get("locale"), "locale", 100) }
                  : {}),
              };
              const revisions = await invoke(
                collectionService(cms, collectionName),
                "listRevisions",
                input,
              );
              if (!Array.isArray(revisions)) {
                throw new CmsHttpError(500, "INTERNAL", "The CMS returned invalid revisions.");
              }
              return { body: { revisions: revisions.map(apiRevision) } };
            },
          ),
        };
        if (options.scheduler) {
          addSingletonLifecycleRoute(
            collectionName,
            singletonBase,
            "schedule",
            "entry:schedule",
            "schedulePublish",
            scheduleInputFromBody,
          );
          addSingletonLifecycleRoute(
            collectionName,
            singletonBase,
            "unschedule",
            "entry:unschedule",
            "unschedule",
            mutationInputWithLocale,
          );
        }
      }
      if (localized) {
        routes[`${singletonBase}/translations`] = {
          GET: secure(
            collectionName,
            "entry:read",
            "entry",
            "admin",
            async (request, _params, { cms }) => {
              const url = new URL(request.url);
              const { locale: _locale, ...query } = readQueryInput(url);
              const page = await invoke(
                collectionService(cms, collectionName),
                "listLocaleVariants",
                query,
              );
              return {
                body: { page: apiPage(options, collectionName, page, "admin") },
              };
            },
          ),
          POST: secure(
            collectionName,
            "entry:create",
            "entry",
            "admin",
            async (request, _params, { cms }) => {
              const { data, locale, changeSummary } = await dataFromBody(request);
              if (!locale) {
                throw new CmsHttpError(400, "INVALID_REQUEST", "locale is required.");
              }
              const result = await invoke(
                collectionService(cms, collectionName),
                "createTranslation",
                data!,
                { locale, ...(changeSummary === undefined ? {} : { changeSummary }) },
              );
              return {
                body: { document: apiDocument(options, collectionName, result, "admin") },
                status: 201,
              };
            },
          ),
        };
      }
    }
    if (!singleton) routes[`/admin${base}/:documentId`] = {
      GET: secure(
        collectionName,
        "entry:read",
        "entry",
        "admin",
        async (_request, params, { cms }) => {
          const result = await invoke(
            collectionService(cms, collectionName),
            "findById",
            requiredString(params.documentId, "documentId"),
            { visibility: "admin" },
          );
          return { body: { document: apiDocument(options, collectionName, result, "admin") } };
        },
        "documentId",
      ),
      PATCH: secure(
        collectionName,
        "entry:update",
        "entry",
        "admin",
        async (request, params, { cms }) => {
          const {
            data,
            slug,
            expectedRevision,
            changeSummary,
          } = await dataFromBody(request);
          if (expectedRevision === undefined) {
            throw new CmsHttpError(400, "INVALID_REQUEST", "expectedRevision is required.");
          }
          const result = await invoke(
            collectionService(cms, collectionName),
            "update",
            requiredString(params.documentId, "documentId"),
            data!,
            {
              expectedRevision,
              ...(slug === undefined ? {} : { slug }),
              ...(changeSummary === undefined ? {} : { changeSummary }),
            },
          );
          return { body: { document: apiDocument(options, collectionName, result, "admin") } };
        },
        "documentId",
      ),
      DELETE: secure(
        collectionName,
        "entry:delete",
        "entry",
        "admin",
        async (request, params, { cms }) => {
          const mutation = mutationInputFromBody(await parseJson(request));
          const result = await invoke(
            collectionService(cms, collectionName),
            "delete",
            requiredString(params.documentId, "documentId"),
            mutation,
          );
          return { body: { document: apiDocument(options, collectionName, result, "admin") } };
        },
        "documentId",
      ),
    };
    if (!singleton) {
      routes[`/admin${base}/:documentId/permanent`] = {
        DELETE: secure(
          collectionName,
          "entry:delete",
          "entry",
          "admin",
          async (request, params, { cms }) => {
            const mutation = mutationInputFromBody(await parseJson(request));
            await invoke(
              collectionService(cms, collectionName),
              "purge",
              requiredString(params.documentId, "documentId"),
              mutation,
            );
            return { body: { purged: true } };
          },
          "documentId",
        ),
      };
    }
    if (slugLookup) routes[`/admin${base}/by-slug/:slug`] = {
      GET: secure(
        collectionName,
        "entry:read",
        "entry",
        "admin",
        async (request, params, { cms }) => {
          const url = new URL(request.url);
          const locale = url.searchParams.has("locale")
            ? requiredString(url.searchParams.get("locale"), "locale", 100)
            : undefined;
          const fallbackLocales = readLocaleFallbacks(url);
          const result = await invoke(
            collectionService(cms, collectionName),
            "findBySlug",
            requiredString(params.slug, "slug"),
            {
              ...(locale === undefined ? {} : { locale }),
              ...(fallbackLocales === undefined ? {} : { fallbackLocales }),
              visibility: "admin",
            },
          );
          return { body: { document: apiDocument(options, collectionName, result, "admin") } };
        },
      ),
    };
    if (!singleton) {
      const adminCollectionBase = `/admin${base}`;
      const itemBase = `${adminCollectionBase}/:documentId`;
      addEntryLifecycleRoute(
        collectionName,
        adminCollectionBase,
        "archive",
        "entry:archive",
        "archive",
        mutationInputFromBody,
      );
      if (hasDrafts) {
        addEntryLifecycleRoute(
          collectionName,
          adminCollectionBase,
          "publish",
          "entry:publish",
          "publish",
          mutationInputFromBody,
        );
        addEntryLifecycleRoute(
          collectionName,
          adminCollectionBase,
          "unpublish",
          "entry:unpublish",
          "unpublish",
          mutationInputFromBody,
        );
        addEntryLifecycleRoute(
          collectionName,
          adminCollectionBase,
          "restore",
          "entry:restore",
          "restoreRevision",
          restoreInputFromBody,
        );
        routes[`${itemBase}/revisions`] = {
          GET: secure(
            collectionName,
            "revision:read",
            "revision",
            "admin",
            async (request, params, { cms }) => {
              const first = positiveInteger(
                new URL(request.url).searchParams.get("first") ?? undefined,
                "first",
                100,
                500,
              );
              const revisions = await invoke(
                collectionService(cms, collectionName),
                "listRevisions",
                requiredString(params.documentId, "documentId"),
                { first },
              );
              if (!Array.isArray(revisions)) {
                throw new CmsHttpError(500, "INTERNAL", "The CMS returned invalid revisions.");
              }
              return { body: { revisions: revisions.map(apiRevision) } };
            },
            "documentId",
          ),
        };
        if (options.scheduler) {
          addEntryLifecycleRoute(
            collectionName,
            adminCollectionBase,
            "schedule",
            "entry:schedule",
            "schedulePublish",
            scheduleInputFromBody,
          );
          addEntryLifecycleRoute(
            collectionName,
            adminCollectionBase,
            "unschedule",
            "entry:unschedule",
            "unschedule",
            mutationInputFromBody,
          );
        }
      }
      if (localized) {
        routes[`${itemBase}/translations`] = {
          GET: secure(
            collectionName,
            "entry:read",
            "entry",
            "admin",
            async (request, params, { cms }) => {
              const url = new URL(request.url);
              const { locale: _locale, ...query } = readQueryInput(url);
              const limit = positiveInteger(
                url.searchParams.get("first") ?? undefined,
                "first",
                query.limit ?? 25,
                100,
              );
              const page = await invoke(
                collectionService(cms, collectionName),
                "listLocaleVariants",
                requiredString(params.documentId, "documentId"),
                { ...query, limit, visibility: "admin" },
              );
              return {
                body: { page: apiPage(options, collectionName, page, "admin") },
              };
            },
            "documentId",
          ),
          POST: secure(
            collectionName,
            "entry:create",
            "entry",
            "admin",
            async (request, params, { cms }) => {
              const { data, slug, locale, changeSummary } = await dataFromBody(request);
              if (!locale) {
                throw new CmsHttpError(400, "INVALID_REQUEST", "locale is required.");
              }
              const result = await invoke(
                collectionService(cms, collectionName),
                "createTranslation",
                requiredString(params.documentId, "documentId"),
                data!,
                {
                  locale,
                  ...(slug === undefined ? {} : { slug }),
                  ...(changeSummary === undefined ? {} : { changeSummary }),
                },
              );
              return {
                body: {
                  document: apiDocument(options, collectionName, result, "admin"),
                },
                status: 201,
              };
            },
            "documentId",
          ),
        };
      }
    }
    routes[`/public${base}`] = {
      GET: secure(
        collectionName,
        "entry:read",
        "entry",
        "public",
        async (request, _params, { cms }) => {
          const url = new URL(request.url);
          if (singleton) {
            const locale = url.searchParams.has("locale")
              ? requiredString(url.searchParams.get("locale"), "locale", 100)
              : undefined;
            const result = await invoke(
              collectionService(cms, collectionName),
              "find",
              { ...(locale === undefined ? {} : { locale }), visibility: "public" },
            );
            return {
              body: {
                document: apiDocument(options, collectionName, result, "public"),
              },
            };
          }
          const query = readQueryInput(url);
          const result = await invoke(
            collectionService(cms, collectionName),
            "find",
            { ...query, visibility: "public" },
          );
          return { body: { page: apiPage(options, collectionName, result, "public") } };
        },
      ),
    };
    if (!singleton) routes[`/public${base}/:documentId`] = {
      GET: secure(
        collectionName,
        "entry:read",
        "entry",
        "public",
        async (_request, params, { cms }) => {
          const result = await invoke(
            collectionService(cms, collectionName),
            "findById",
            requiredString(params.documentId, "documentId"),
            { visibility: "public" },
          );
          return { body: { document: apiDocument(options, collectionName, result, "public") } };
        },
        "documentId",
      ),
    };
    if (slugLookup) routes[`/public${base}/by-slug/:slug`] = {
      GET: secure(
        collectionName,
        "entry:read",
        "entry",
        "public",
        async (request, params, { cms }) => {
          const url = new URL(request.url);
          const locale = url.searchParams.has("locale")
            ? requiredString(url.searchParams.get("locale"), "locale", 100)
            : undefined;
          const fallbackLocales = readLocaleFallbacks(url);
          const result = await invoke(
            collectionService(cms, collectionName),
            "findBySlug",
            requiredString(params.slug, "slug"),
            {
              ...(locale === undefined ? {} : { locale }),
              ...(fallbackLocales === undefined ? {} : { fallbackLocales }),
              visibility: "public",
            },
          );
          return { body: { document: apiDocument(options, collectionName, result, "public") } };
        },
      ),
    };
  }

  if (changeEventsEnabled) {
    routes["/admin/change-events"] = {
      GET: secure(
        "change-events",
        "change-event:read",
        "changeEvent",
        "admin",
        async (request, _params, { cms }) => {
          const url = new URL(request.url);
          const first = positiveInteger(
            url.searchParams.get("first") ?? undefined,
            "first",
            100,
            500,
          );
          const after = optionalString(
            url.searchParams.get("after") ?? undefined,
            "after",
            4_096,
          );
          const page = await invokeNamespace(cms, "events", "list", {
            first,
            ...(after === undefined ? {} : { after }),
          });
          return { body: apiChangeEventPage(page) };
        },
      ),
    };
    routes["/admin/change-events/:eventId/ack"] = {
      POST: secure(
        "change-events",
        "change-event:ack",
        "changeEvent",
        "admin",
        async (request, params, { cms }) => {
          const input = mutationInputFromBody(await parseJson(request));
          await invokeNamespace(
            cms,
            "events",
            "acknowledge",
            requiredString(params.eventId, "eventId"),
            { expectedRevision: input.expectedRevision },
          );
          return { body: { acknowledged: true } };
        },
        "eventId",
      ),
    };
  }

  routes["/scheduler/publications"] = {
    POST: secure(
      "scheduler",
      "entry:publish",
      "entry",
      "admin",
      async (request, _params, { context, cms }) => {
        const body = await parseJson(request);
        rejectClientIdentity(body);
        if (!isRecord(body.publication)) {
          throw new CmsHttpError(400, "INVALID_REQUEST", "publication is required.");
        }
        const input = body.publication;
        const entryId = requiredString(input.entryId, "publication.entryId");
        const revisionNumber = input.scheduledRevisionNumber;
        if (
          typeof revisionNumber !== "number" ||
          !Number.isInteger(revisionNumber) ||
          revisionNumber < 1
        ) {
          throw new CmsHttpError(
            400,
            "INVALID_REQUEST",
            "publication.scheduledRevisionNumber must be a positive integer.",
          );
        }
        const publishAt = new Date(
          requiredString(input.publishAt, "publication.publishAt", 100),
        );
        if (!Number.isFinite(publishAt.getTime())) {
          throw new CmsHttpError(
            400,
            "INVALID_REQUEST",
            "publication.publishAt must be a valid date.",
          );
        }
        const publication = {
          entryId,
          scheduledRevisionNumber: revisionNumber,
          publishAt,
          timeZone: requiredString(input.timeZone, "publication.timeZone", 100),
        };
        const result = await invokeScheduler(cms, publication);
        return {
          body: apiScheduledPublicationResult(options, result),
        };
      },
    ),
  };

  if (webhooks && webhookService) {
    const secretReference = async (
      input: Parameters<typeof webhooks.resolveSecretRef>[0],
    ): Promise<string> => {
      const value = await webhooks.resolveSecretRef(input);
      if (typeof value !== "string" || !value.trim() || value.length > 500) {
        throw new TypeError("The host secret reference resolver returned an invalid reference.");
      }
      return value;
    };
    routes["/admin/webhooks"] = {
      GET: secure(
        "webhooks",
        "webhook:read",
        "webhook",
        "admin",
        async (_request, _params, { context }) => ({
          body: {
            subscriptions: (await webhookService.listSubscriptions(context))
              .map(apiWebhookSubscription),
          },
        }),
      ),
      POST: secure(
        "webhooks",
        "webhook:manage",
        "webhook",
        "admin",
        async (request, _params, { context }) => {
          const input = webhookSubscriptionInput(await parseJson(request));
          await webhookService.assertCanManage(context);
          const secretRef = await secretReference({
            context,
            request,
            purpose: "create",
          });
          const subscription = await webhookService.createSubscription({
            ...context,
            ...input,
            secretRef,
          });
          return {
            status: 201,
            body: { subscription: apiWebhookSubscription(subscription) },
          };
        },
      ),
    };
    routes["/admin/webhooks/:subscriptionId"] = {
      GET: secure(
        "webhooks",
        "webhook:read",
        "webhook",
        "admin",
        async (_request, params, { context }) => ({
          body: {
            subscription: apiWebhookSubscription(
              await webhookService.getSubscription({
                ...context,
                subscriptionId: requiredString(params.subscriptionId, "subscriptionId"),
              }),
            ),
          },
        }),
        "subscriptionId",
      ),
      PATCH: secure(
        "webhooks",
        "webhook:manage",
        "webhook",
        "admin",
        async (request, params, { context }) => {
          const subscriptionId = requiredString(params.subscriptionId, "subscriptionId");
          const body = await parseJson(request);
          const input = webhookSubscriptionInput(body);
          const expectedRevision = positiveInteger(
            body.expectedRevision === undefined
              ? undefined
              : String(body.expectedRevision),
            "expectedRevision",
            0,
            Number.MAX_SAFE_INTEGER,
          );
          if (expectedRevision < 1) {
            throw new CmsHttpError(400, "INVALID_REQUEST", "expectedRevision is required.");
          }
          if (body.rotateSecret !== undefined && typeof body.rotateSecret !== "boolean") {
            throw new CmsHttpError(400, "INVALID_REQUEST", "rotateSecret must be a boolean.");
          }
          const current = await webhookService.getSubscription({
            ...context,
            subscriptionId,
          });
          await webhookService.assertCanManage({ ...context, subscriptionId });
          if (current.revision !== expectedRevision) {
            throw new CmsHttpError(
              409,
              "CONFLICT",
              "The webhook subscription changed since it was read.",
            );
          }
          const secretRef = body.rotateSecret === true
            ? await secretReference({
                context,
                request,
                purpose: "rotate",
                subscriptionId,
              })
            : current.secretRef;
          const subscription = await webhookService.updateSubscription({
            ...context,
            ...input,
            subscriptionId,
            expectedRevision,
            secretRef,
          });
          return { body: { subscription: apiWebhookSubscription(subscription) } };
        },
        "subscriptionId",
      ),
    };
    routes["/admin/webhooks/:subscriptionId/deliveries"] = {
      GET: secure(
        "webhooks",
        "webhook:read",
        "webhook",
        "admin",
        async (request, params, { context }) => {
          const first = positiveInteger(
            new URL(request.url).searchParams.get("first") ?? undefined,
            "first",
            100,
            500,
          );
          const deliveries = await webhookService.listDeliveries({
            ...context,
            subscriptionId: requiredString(params.subscriptionId, "subscriptionId"),
            first,
          });
          return { body: { deliveries: deliveries.map(apiWebhookDelivery) } };
        },
        "subscriptionId",
      ),
    };
    routes["/admin/webhook-deliveries/:deliveryId/attempts"] = {
      GET: secure(
        "webhooks",
        "webhook:read",
        "webhook",
        "admin",
        async (request, params, { context }) => {
          const first = positiveInteger(
            new URL(request.url).searchParams.get("first") ?? undefined,
            "first",
            100,
            500,
          );
          const attempts = await webhookService.listAttempts({
            ...context,
            deliveryId: requiredString(params.deliveryId, "deliveryId"),
            first,
          });
          return { body: { attempts: attempts.map(apiWebhookAttempt) } };
        },
        "deliveryId",
      ),
    };
    routes["/admin/webhook-deliveries/:deliveryId/retry"] = {
      POST: secure(
        "webhooks",
        "webhook:manage",
        "webhook",
        "admin",
        async (request, params, { context }) => {
          const body = await parseJson(request);
          rejectClientIdentity(body);
          const expectedRevision = positiveInteger(
            body.expectedRevision === undefined
              ? undefined
              : String(body.expectedRevision),
            "expectedRevision",
            0,
            Number.MAX_SAFE_INTEGER,
          );
          if (expectedRevision < 1) {
            throw new CmsHttpError(400, "INVALID_REQUEST", "expectedRevision is required.");
          }
          await webhookService.retryDelivery({
            ...context,
            deliveryId: requiredString(params.deliveryId, "deliveryId"),
            expectedRevision,
          });
          return { body: { retried: true } };
        },
        "deliveryId",
      ),
    };
  }

  const routeMap = Object.fromEntries(
    Object.entries(routes).map(([route, handlers]) => [
      `${basePath}${route}`,
      handlers,
    ]),
  ) as CmsRouteHandlerMap;

  const dispatch = async (request: Request): Promise<Response> => {
    let pathname: string;
    try {
      pathname = new URL(request.url).pathname;
    } catch {
      return jsonResponse(
        { error: { code: "INVALID_REQUEST", message: "The request URL is invalid." } },
        400,
      );
    }
    const match = matchRoute(routeMap, pathname);
    if (!match) {
      return jsonResponse(
        { error: { code: "NOT_FOUND", message: "The CMS route was not found." } },
        404,
      );
    }
    const route = routeMap[match.route]!;
    const method = request.method.toUpperCase();
    if (!["GET", "POST", "PATCH", "DELETE"].includes(method)) {
      return emptyResponse(405, { Allow: Object.keys(route).join(", ") });
    }
    const handler = route[method as CmsHttpMethod];
    if (!handler) {
      return emptyResponse(405, { Allow: Object.keys(route).join(", ") });
    }
    try {
      return await handler(request, match.params);
    } catch (error) {
      return errorResponse(error);
    }
  };

  return { routes: routeMap, dispatch };
};
