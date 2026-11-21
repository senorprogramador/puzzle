import {
  CmsError,
  CmsService,
  CmsWebhookService,
  CMS_WEBHOOK_EVENTS,
  type CmsAccessAction,
  type CmsAccessPolicy,
  type CmsContext,
  type CmsContentTypeRecord,
  type CmsCreateEntryInput,
  type CmsEntryMutationInput,
  type CmsEntryQuery,
  type CmsEntryView,
  type CmsFields,
  type CmsFieldDefinition,
  type CmsRegisterContentTypeInput,
  type CmsResourceType,
  type CmsRestoreRevisionInput,
  type CmsScheduleEntryInput,
  type CmsScheduledPublication,
  type CmsServiceOptions,
  type CmsUpdateEntryInput,
  type CmsVisibility,
  type CmsWebhookEventType,
  type CmsWebhookServiceOptions,
  type CmsWebhookSubscription,
  type CmsWebhookDelivery,
  type CmsWebhookAttempt,
  type ContentTypeDefinition,
} from "@puzzle-ui/cms";
import type {
  CmsApiAdminEntry,
  CmsApiAuditEvent,
  CmsApiContentType,
  CmsApiDate,
  CmsApiEntryPage,
  CmsApiError,
  CmsApiErrorCode,
  CmsApiMediaUsage,
  CmsApiPublishedSnapshot,
  CmsApiPublication,
  CmsApiRevision,
  CmsApiScheduleEntryInput,
  CmsApiWebhookSubscription,
  CmsApiWebhookDelivery,
  CmsApiWebhookAttempt,
  CmsApiWebhookSubscriptionInput,
  CmsPublishedEntryPage,
  CmsPublishedEntry,
  CmsRelationshipLookupResult,
  CmsRelationshipOption,
} from "../shared";

export type CmsRouteAccess = {
  readonly context: CmsContext;
  readonly action: CmsAccessAction;
  readonly resource: CmsResourceType;
  readonly request: Request;
  readonly resourceId?: string;
  readonly visibility?: CmsVisibility;
};

export type CmsAuthorization = (
  access: CmsRouteAccess,
) => boolean | Promise<boolean>;

export type CmsServerOptions = Omit<CmsServiceOptions, "scheduler"> & {
  readonly scheduler: NonNullable<CmsServiceOptions["scheduler"]>;
  readonly basePath?: string;
  readonly resolveContext: (
    request: Request,
  ) => Promise<CmsContext | null> | CmsContext | null;
  readonly authorize: CmsAuthorization;
  readonly webhooks?: Omit<CmsWebhookServiceOptions, "storage" | "accessPolicy" | "clock" | "idGenerator"> & {
    readonly resolveSecretRef: (input: {
      readonly context: CmsContext;
      readonly request: Request;
      readonly purpose: "create" | "rotate";
      readonly subscriptionId?: string;
    }) => Promise<string>;
  };
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

type Operation = (
  request: Request,
  params: Readonly<Record<string, string>>,
  context: CmsContext,
) => Promise<OperationResult>;

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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const jsonResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: noStoreHeaders,
  });

const emptyResponse = (status: number, headers: HeadersInit = {}): Response =>
  new Response(null, {
    status,
    headers: { ...noStoreHeaders, ...headers },
  });

const apiDate = (value: Date | string): CmsApiDate =>
  value instanceof Date ? value.toISOString() : new Date(value).toISOString();

const publicEntry = (entry: CmsEntryView): CmsPublishedEntry => {
  const snapshot = entry.publishedSnapshot;
  if (!snapshot) throw new CmsHttpError(404, "NOT_FOUND", "Published content entry was not found.");
  return {
    id: entry.id,
    contentType: entry.contentTypeSlug,
    locale: snapshot.locale,
    slug: snapshot.slug,
    revision: snapshot.revisionNumber,
    schemaVersion: snapshot.schemaVersion,
    fields: snapshot.fields,
    publishedAt: apiDate(snapshot.publishedAt),
  };
};

const publicPage = (page: {
  readonly items: readonly CmsEntryView[];
  readonly nextCursor: string | null;
  readonly hasNextPage: boolean;
}): CmsPublishedEntryPage => ({
  items: page.items.map(publicEntry),
  nextCursor: page.nextCursor,
  hasNextPage: page.hasNextPage,
});

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
  value: unknown,
  path: string,
  fallback: number,
  maximum: number,
): number => {
  if (value === undefined) return fallback;
  const number = typeof value === "string" ? Number(value) : value;
  if (!Number.isInteger(number) || Number(number) < 1 || Number(number) > maximum) {
    throw new CmsHttpError(400, "INVALID_REQUEST", `${path} must be an integer from 1 to ${maximum}.`);
  }
  return Number(number);
};

const optionalNumber = (value: unknown, path: string): number | undefined => {
  if (value === undefined) return undefined;
  if (!Number.isInteger(value) || Number(value) < 1) {
    throw new CmsHttpError(400, "INVALID_REQUEST", `${path} must be a positive integer.`);
  }
  return Number(value);
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

const readQueryArray = <T>(url: URL, name: string): readonly T[] | undefined => {
  const value = readQueryValue<unknown>(url, name);
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) {
    throw new CmsHttpError(400, "INVALID_REQUEST", `${name} must be a JSON array.`);
  }
  return value as readonly T[];
};

const readFilters = (url: URL): CmsEntryQuery["filters"] => {
  const filters = readQueryArray<unknown>(url, "filters");
  if (
    filters?.some(
      (filter) =>
        !isRecord(filter) ||
        typeof filter.field !== "string" ||
        typeof filter.operator !== "string" ||
        !Object.prototype.hasOwnProperty.call(filter, "value"),
    )
  ) {
    throw new CmsHttpError(400, "INVALID_REQUEST", "filters contains an invalid entry.");
  }
  return filters as CmsEntryQuery["filters"];
};

const readOrderBy = (url: URL): CmsEntryQuery["orderBy"] => {
  const orderBy = readQueryArray<unknown>(url, "orderBy");
  if (
    orderBy?.some(
      (order) =>
        !isRecord(order) ||
        typeof order.field !== "string" ||
        (order.direction !== "asc" && order.direction !== "desc"),
    )
  ) {
    throw new CmsHttpError(400, "INVALID_REQUEST", "orderBy contains an invalid entry.");
  }
  return orderBy as CmsEntryQuery["orderBy"];
};

const readLocaleFallbacks = (url: URL): readonly string[] | undefined => {
  const locales = readQueryArray<unknown>(url, "fallbackLocales");
  if (locales?.some((locale) => typeof locale !== "string")) {
    throw new CmsHttpError(400, "INVALID_REQUEST", "fallbackLocales must contain locale strings.");
  }
  return locales as readonly string[] | undefined;
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

const cmsErrorStatus = (code: CmsApiErrorCode): number => {
  switch (code) {
    case "VALIDATION":
    case "SCHEMA":
      return 400;
    case "NOT_FOUND":
      return 404;
    case "CONFLICT":
    case "DUPLICATE":
      return 409;
    case "PERMISSION_DENIED":
      return 403;
    case "CAPABILITY":
      return 501;
    case "SCHEDULER":
      return 503;
    case "AUDIT":
    case "INTERNAL":
      return 500;
    case "UNAUTHENTICATED":
      return 401;
    case "FORBIDDEN":
      return 403;
    case "INVALID_REQUEST":
      return 400;
  }
};

const errorResponse = (error: unknown): Response => {
  if (error instanceof CmsHttpError) {
    return jsonResponse(
      { error: { code: error.code, message: error.message } } satisfies CmsApiError,
      error.status,
    );
  }
  if (error instanceof CmsError) {
    const issues = Array.isArray(error.details?.issues)
      ? error.details.issues.filter(
          (issue): issue is { path: string; message: string; code: string } =>
            isRecord(issue) &&
            typeof issue.path === "string" &&
            typeof issue.message === "string" &&
            typeof issue.code === "string",
        )
      : undefined;
    return jsonResponse(
      {
        error: {
          code: error.code,
          message: error.message,
          ...(issues?.length ? { issues } : {}),
        },
      } satisfies CmsApiError,
      cmsErrorStatus(error.code),
    );
  }
  return jsonResponse(
    {
      error: {
        code: "INTERNAL",
        message: "The CMS request could not be completed.",
      },
    } satisfies CmsApiError,
    500,
  );
};

const apiAdminEntry = (entry: CmsEntryView): CmsApiAdminEntry =>
  JSON.parse(JSON.stringify(entry)) as CmsApiAdminEntry;

const apiContentType = (record: CmsContentTypeRecord): CmsApiContentType =>
  JSON.parse(JSON.stringify(record)) as CmsApiContentType;

const apiRevision = (record: unknown): CmsApiRevision =>
  JSON.parse(JSON.stringify(record)) as CmsApiRevision;

const apiAuditEvent = (record: unknown): CmsApiAuditEvent =>
  JSON.parse(JSON.stringify(record)) as CmsApiAuditEvent;

const apiWebhookSubscription = (record: CmsWebhookSubscription): CmsApiWebhookSubscription => {
  const { tenantId: _tenantId, secretRef: _secretRef, createdAt, updatedAt, ...rest } = record;
  return { ...rest, createdAt: apiDate(createdAt), updatedAt: apiDate(updatedAt), secretConfigured: true };
};

const apiWebhookDelivery = (record: CmsWebhookDelivery): CmsApiWebhookDelivery => {
  const { tenantId: _tenantId, leaseToken: _leaseToken, createdAt, updatedAt, nextAttemptAt, event, ...rest } = record;
  return {
    ...rest,
    event: { ...event, occurredAt: apiDate(event.occurredAt) },
    createdAt: apiDate(createdAt), updatedAt: apiDate(updatedAt), nextAttemptAt: apiDate(nextAttemptAt),
  };
};

const apiWebhookAttempt = (record: CmsWebhookAttempt): CmsApiWebhookAttempt => {
  const { tenantId: _tenantId, createdAt, updatedAt, startedAt, completedAt, ...rest } = record;
  return {
    ...rest, createdAt: apiDate(createdAt), updatedAt: apiDate(updatedAt),
    startedAt: apiDate(startedAt), completedAt: apiDate(completedAt),
  };
};

const webhookSubscriptionInput = (body: Record<string, unknown>): CmsApiWebhookSubscriptionInput => {
  if ("secretRef" in body || "secret" in body) {
    throw new CmsHttpError(400, "INVALID_REQUEST", "Webhook secrets are managed by the host.");
  }
  if (!Array.isArray(body.events) || !body.events.every(
    (value): value is CmsWebhookEventType => CMS_WEBHOOK_EVENTS.some((event) => event === value),
  )) {
    throw new CmsHttpError(400, "INVALID_REQUEST", "events must contain supported webhook events.");
  }
  if (typeof body.enabled !== "boolean") {
    throw new CmsHttpError(400, "INVALID_REQUEST", "enabled must be a boolean.");
  }
  return {
    endpoint: requiredString(body.endpoint, "endpoint", 2_048),
    events: body.events,
    enabled: body.enabled,
  };
};

const apiMediaUsage = (record: unknown): CmsApiMediaUsage =>
  JSON.parse(JSON.stringify(record)) as CmsApiMediaUsage;

const findRelationshipField = (
  definitions: readonly CmsFieldDefinition[],
  path: readonly string[],
): CmsFieldDefinition | undefined => {
  const [head, ...tail] = path;
  if (!head) return undefined;
  for (const field of definitions) {
    if (field.key !== head) continue;
    if (!tail.length) return field;
    const nested = field.fields
      ? findRelationshipField(field.fields, tail)
      : field.blocks
        ? field.blocks
            .map((block) => findRelationshipField(block.fields, tail))
            .find((match) => match !== undefined)
        : undefined;
    if (nested) return nested;
  }
  return undefined;
};

export const createCmsServer = (options: CmsServerOptions): CmsServer => {
  if (
    !options ||
    typeof options.resolveContext !== "function" ||
    typeof options.authorize !== "function"
  ) {
    throw new TypeError("CMS server requires context resolution and authorization callbacks.");
  }
  if (
    !options.scheduler ||
    typeof options.scheduler.schedule !== "function" ||
    typeof options.scheduler.cancel !== "function"
  ) {
    throw new TypeError("CMS server routes support scheduling and require an explicit scheduler.");
  }
  if (typeof options.accessPolicy !== "function") {
    throw new TypeError("CMS server requires an explicit CMS accessPolicy.");
  }
  if (!options.storage) {
    throw new TypeError("CMS server requires a storage adapter.");
  }
  if (options.webhooks && typeof options.webhooks.resolveSecretRef !== "function") {
    throw new TypeError("Webhook routes require a host-managed secret reference resolver.");
  }
  if (options.webhooks && options.emitChangeEvents === false) {
    throw new TypeError("Webhook routes require change-event emission.");
  }

  const basePath = normalizeBasePath(options.basePath);
  const {
    basePath: _basePath,
    resolveContext,
    authorize,
    accessPolicy,
    webhooks,
    ...serviceOptions
  } = options;
  const cms = new CmsService({
    ...serviceOptions,
    ...(webhooks ? { emitChangeEvents: true } : {}),
    accessPolicy: async (access) => (await accessPolicy(access)) === true,
  });
  const webhookService = webhooks
    ? new CmsWebhookService({
        ...webhooks,
        storage: serviceOptions.storage,
        accessPolicy,
        clock: serviceOptions.clock,
        idGenerator: serviceOptions.idGenerator,
      })
    : null;

  const secure = (
    action: CmsAccessAction,
    resource: CmsResourceType,
    operation: Operation,
    options: {
      readonly visibility?: CmsVisibility;
      readonly resourceParam?: string;
    } = {},
  ): CmsRouteHandler =>
    async (request, params) => {
      let context: CmsContext | null;
      try {
        context = await resolveContext(request);
      } catch {
        throw new CmsHttpError(401, "UNAUTHENTICATED", "A valid actor and tenant context is required.");
      }
      if (!requestContextIsValid(context)) {
        throw new CmsHttpError(401, "UNAUTHENTICATED", "A valid actor and tenant context is required.");
      }
      const visibility = options.visibility ?? "admin";
      if (visibility === "admin" && context.actor === null) {
        throw new CmsHttpError(401, "UNAUTHENTICATED", "Authentication is required.");
      }
      const access: CmsRouteAccess = {
        context,
        action,
        resource,
        request,
        visibility,
        ...(options.resourceParam && params[options.resourceParam]
          ? { resourceId: params[options.resourceParam] }
          : {}),
      };
      if ((await authorize(access)) !== true) {
        throw new CmsHttpError(403, "FORBIDDEN", "The actor is not permitted to perform this operation.");
      }
      const result = await operation(request, params, context);
      return jsonResponse(result.body, result.status);
    };

  const routes: Record<string, Partial<Record<CmsHttpMethod, CmsRouteHandler>>> = {
    "/admin/content-types": {
      GET: secure("content-type:read", "contentType", async (request, _params, context) => {
        const url = new URL(request.url);
        const records = await cms.listContentTypes({
          ...context,
          first: positiveInteger(url.searchParams.get("first") ?? undefined, "first", 100, 500),
        });
        return { body: { contentTypes: records.map(apiContentType) } };
      }),
      POST: secure("content-type:register", "contentType", async (request, _params, context) => {
        const body = await parseJson(request);
        if (!isRecord(body.definition)) {
          throw new CmsHttpError(400, "INVALID_REQUEST", "definition is required.");
        }
        const input: CmsRegisterContentTypeInput = {
          ...context,
          definition: body.definition as unknown as ContentTypeDefinition,
          ...(body.expectedRevision === undefined
            ? {}
            : { expectedRevision: optionalNumber(body.expectedRevision, "expectedRevision") }),
        };
        const record = await cms.registerContentType(input);
        return { body: { contentType: apiContentType(record) }, status: 201 };
      }),
    },
    "/admin/content-types/:slug": {
      GET: secure("content-type:read", "contentType", async (_request, params, context) => ({
        body: {
          contentType: apiContentType(
            await cms.getContentType({ ...context, slug: requiredString(params.slug, "slug") }),
          ),
        },
      })),
    },
    "/admin/entries": {
      GET: secure("entry:read", "entry", async (request, _params, context) => {
        const url = new URL(request.url);
        const filters = readFilters(url);
        const orderBy = readOrderBy(url);
        const input: CmsEntryQuery = {
          ...context,
          contentType: requiredString(url.searchParams.get("contentType"), "contentType"),
          visibility: "admin",
          first: positiveInteger(url.searchParams.get("first") ?? undefined, "first", 25, 100),
          ...(url.searchParams.has("locale")
            ? { locale: requiredString(url.searchParams.get("locale"), "locale", 100) }
            : {}),
          ...(url.searchParams.has("search")
            ? { search: optionalString(url.searchParams.get("search"), "search") }
            : {}),
          ...(url.searchParams.has("after")
            ? { after: requiredString(url.searchParams.get("after"), "after", 10_000) }
            : {}),
          ...(filters ? { filters } : {}),
          ...(orderBy ? { orderBy } : {}),
        };
        const page = await cms.listEntries(input);
        return { body: { page: JSON.parse(JSON.stringify(page)) as CmsApiEntryPage } };
      }),
      POST: secure("entry:create", "entry", async (request, _params, context) => {
        const body = await parseJson(request);
        if (!isRecord(body.fields)) {
          throw new CmsHttpError(400, "INVALID_REQUEST", "fields must be an object.");
        }
        const input: CmsCreateEntryInput = {
          ...context,
          contentType: requiredString(body.contentType, "contentType"),
          locale: requiredString(body.locale, "locale", 100),
          fields: body.fields as CmsFields,
          ...(body.slug === undefined ? {} : { slug: requiredString(body.slug, "slug") }),
          ...(body.translationGroupId === undefined
            ? {}
            : { translationGroupId: requiredString(body.translationGroupId, "translationGroupId") }),
          ...(body.changeSummary === undefined
            ? {}
            : { changeSummary: optionalString(body.changeSummary, "changeSummary") }),
        };
        const entry = await cms.createEntry(input);
        return { body: { entry: apiAdminEntry(entry) }, status: 201 };
      }),
    },
    "/admin/entries/:entryId": {
      GET: secure(
        "entry:read",
        "entry",
        async (_request, params, context) => ({
          body: {
            entry: apiAdminEntry(
              await cms.getEntry({
                ...context,
                entryId: requiredString(params.entryId, "entryId"),
                visibility: "admin",
              }),
            ),
          },
        }),
        { resourceParam: "entryId" },
      ),
      PATCH: secure(
        "entry:update",
        "entry",
        async (request, params, context) => {
          const body = await parseJson(request);
          if (!isRecord(body.fields)) {
            throw new CmsHttpError(400, "INVALID_REQUEST", "fields must be an object.");
          }
          const input: CmsUpdateEntryInput = {
            ...context,
            entryId: requiredString(params.entryId, "entryId"),
            expectedRevision: optionalNumber(body.expectedRevision, "expectedRevision")!,
            fields: body.fields as CmsFields,
            ...(body.slug === undefined ? {} : { slug: requiredString(body.slug, "slug") }),
            ...(body.changeSummary === undefined
              ? {}
              : { changeSummary: optionalString(body.changeSummary, "changeSummary") }),
          };
          return { body: { entry: apiAdminEntry(await cms.saveDraft(input)) } };
        },
        { resourceParam: "entryId" },
      ),
      DELETE: secure(
        "entry:delete",
        "entry",
        async (request, params, context) => {
          const body = await parseJson(request);
          const input: CmsEntryMutationInput = {
            ...context,
            entryId: requiredString(params.entryId, "entryId"),
            expectedRevision: optionalNumber(body.expectedRevision, "expectedRevision")!,
            ...(body.changeSummary === undefined
              ? {}
              : { changeSummary: optionalString(body.changeSummary, "changeSummary") }),
          };
          return { body: { entry: apiAdminEntry(await cms.deleteEntry(input)) } };
        },
        { resourceParam: "entryId" },
      ),
    },
    "/admin/entries/:entryId/publish": {
      POST: secure(
        "entry:publish",
        "entry",
        async (request, params, context) => ({
          body: {
            entry: apiAdminEntry(
              await cms.publish({
                ...context,
                entryId: requiredString(params.entryId, "entryId"),
                ...await mutationInput(request),
              }),
            ),
          },
        }),
        { resourceParam: "entryId" },
      ),
    },
    "/admin/entries/:entryId/unpublish": {
      POST: secure(
        "entry:unpublish",
        "entry",
        async (request, params, context) => ({
          body: {
            entry: apiAdminEntry(
              await cms.unpublish({
                ...context,
                entryId: requiredString(params.entryId, "entryId"),
                ...await mutationInput(request),
              }),
            ),
          },
        }),
        { resourceParam: "entryId" },
      ),
    },
    "/admin/entries/:entryId/schedule": {
      POST: secure(
        "entry:schedule",
        "entry",
        async (request, params, context) => {
          const body = await parseJson(request);
          const input: CmsScheduleEntryInput = {
            ...context,
            entryId: requiredString(params.entryId, "entryId"),
            expectedRevision: optionalNumber(body.expectedRevision, "expectedRevision")!,
            publishAt: new Date(requiredString(body.publishAt, "publishAt", 100)),
            timeZone: requiredString(body.timeZone, "timeZone", 100),
            ...(body.changeSummary === undefined
              ? {}
              : { changeSummary: optionalString(body.changeSummary, "changeSummary") }),
          };
          return { body: { entry: apiAdminEntry(await cms.schedulePublish(input)) } };
        },
        { resourceParam: "entryId" },
      ),
    },
    "/admin/entries/:entryId/unschedule": {
      POST: secure(
        "entry:unschedule",
        "entry",
        async (request, params, context) => ({
          body: {
            entry: apiAdminEntry(
              await cms.unschedule({
                ...context,
                entryId: requiredString(params.entryId, "entryId"),
                ...await mutationInput(request),
              }),
            ),
          },
        }),
        { resourceParam: "entryId" },
      ),
    },
    "/admin/entries/:entryId/archive": {
      POST: secure(
        "entry:archive",
        "entry",
        async (request, params, context) => ({
          body: {
            entry: apiAdminEntry(
              await cms.archive({
                ...context,
                entryId: requiredString(params.entryId, "entryId"),
                ...await mutationInput(request),
              }),
            ),
          },
        }),
        { resourceParam: "entryId" },
      ),
    },
    "/admin/entries/:entryId/restore": {
      POST: secure(
        "entry:restore",
        "entry",
        async (request, params, context) => {
          const body = await parseJson(request);
          const input: CmsRestoreRevisionInput = {
            ...context,
            entryId: requiredString(params.entryId, "entryId"),
            expectedRevision: optionalNumber(body.expectedRevision, "expectedRevision")!,
            revisionId: requiredString(body.revisionId, "revisionId"),
            ...(body.changeSummary === undefined
              ? {}
              : { changeSummary: optionalString(body.changeSummary, "changeSummary") }),
          };
          return { body: { entry: apiAdminEntry(await cms.restoreRevision(input)) } };
        },
        { resourceParam: "entryId" },
      ),
    },
    "/admin/entries/:entryId/revisions": {
      GET: secure(
        "revision:read",
        "revision",
        async (request, params, context) => {
          const url = new URL(request.url);
          const revisions = await cms.listRevisions({
            ...context,
            entryId: requiredString(params.entryId, "entryId"),
            first: positiveInteger(url.searchParams.get("first") ?? undefined, "first", 100, 500),
          });
          return { body: { revisions: revisions.map(apiRevision) } };
        },
        { resourceParam: "entryId" },
      ),
    },
    "/admin/entries/:entryId/translations": {
      GET: secure(
        "entry:read",
        "entry",
        async (request, params, context) => {
          const entry = await cms.getEntry({
            ...context,
            entryId: requiredString(params.entryId, "entryId"),
            visibility: "admin",
          });
          const url = new URL(request.url);
          const page = await cms.listEntries({
            ...context,
            contentType: entry.contentTypeSlug,
            visibility: "admin",
            first: positiveInteger(url.searchParams.get("first") ?? undefined, "first", 100, 100),
            filters: [
              {
                field: "translationGroupId",
                operator: "eq",
                value: entry.translationGroupId,
              },
            ],
          });
          return { body: { page: JSON.parse(JSON.stringify(page)) as CmsApiEntryPage } };
        },
        { resourceParam: "entryId" },
      ),
    },
    "/admin/relationships": {
      GET: secure("entry:read", "entry", async (request, _params, context) => {
        const url = new URL(request.url);
        const contentType = requiredString(url.searchParams.get("contentType"), "contentType");
        const fieldPath = requiredString(url.searchParams.get("fieldPath"), "fieldPath");
        const record = await cms.getContentType({ ...context, slug: contentType });
        const field = findRelationshipField(
          record.fields,
          fieldPath.split(".").filter(Boolean),
        );
        if (field?.type !== "relationship" || !field.relation) {
          throw new CmsHttpError(400, "INVALID_REQUEST", "fieldPath must identify a relationship field.");
        }
        const first = positiveInteger(url.searchParams.get("first") ?? undefined, "first", 25, 100);
        const locale = url.searchParams.has("locale")
          ? requiredString(url.searchParams.get("locale"), "locale", 100)
          : undefined;
        if (field.relation.sameLocale && !locale) {
          throw new CmsHttpError(
            400,
            "INVALID_REQUEST",
            "locale is required for same-locale relationships.",
          );
        }
        const search = optionalString(url.searchParams.get("search") ?? undefined, "search");
        const targetTypes = field.relation.targetTypes;
        const pages = await Promise.all(
          targetTypes.map(async (targetType) => ({
            targetType,
            page: await cms.listEntries({
              ...context,
              contentType: targetType,
              ...(locale ? { locale } : {}),
              ...(search ? { search } : {}),
              visibility: "admin",
              first,
              filters: [
                field.relation?.allowedStatuses
                  ? {
                      field: "status",
                      operator: "in" as const,
                      value: field.relation.allowedStatuses,
                    }
                  : {
                      field: "status",
                      operator: "ne" as const,
                      value: "archived",
                    },
              ],
            }),
          })),
        );
        const items: CmsRelationshipOption[] = pages.flatMap(({ targetType, page }) =>
          page.items.map((entry) => ({
            contentType: targetType,
            entry: apiAdminEntry(entry),
          })),
        );
        return {
          body: {
            targetTypes,
            items,
          } satisfies CmsRelationshipLookupResult,
        };
      }),
    },
    "/admin/audit": {
      GET: secure("audit:read", "audit", async (request, _params, context) => {
        const url = new URL(request.url);
        const events = await cms.listAuditEvents({
          ...context,
          first: positiveInteger(url.searchParams.get("first") ?? undefined, "first", 100, 500),
          ...(url.searchParams.has("resourceId")
            ? { resourceId: requiredString(url.searchParams.get("resourceId"), "resourceId") }
            : {}),
        });
        return { body: { events: events.map(apiAuditEvent) } };
      }),
    },
    "/public/entries": {
      GET: secure(
        "entry:read",
        "entry",
        async (request, _params, context) => {
          const url = new URL(request.url);
          const filters = readFilters(url);
          const orderBy = readOrderBy(url);
          const query: CmsEntryQuery = {
            ...context,
            contentType: requiredString(url.searchParams.get("contentType"), "contentType"),
            visibility: "public",
            first: positiveInteger(url.searchParams.get("first") ?? undefined, "first", 25, 100),
            ...(url.searchParams.has("locale")
              ? { locale: requiredString(url.searchParams.get("locale"), "locale", 100) }
              : {}),
            ...(url.searchParams.has("search")
              ? { search: optionalString(url.searchParams.get("search"), "search") }
              : {}),
            ...(url.searchParams.has("after")
              ? { after: requiredString(url.searchParams.get("after"), "after", 10_000) }
              : {}),
            ...(filters ? { filters } : {}),
            ...(orderBy ? { orderBy } : {}),
          };
          return { body: { page: publicPage(await cms.listEntries(query)) } };
        },
        { visibility: "public" },
      ),
    },
    "/public/entries/:entryId": {
      GET: secure(
        "entry:read",
        "entry",
        async (_request, params, context) => {
          const entry = await cms.getEntry({
            ...context,
            entryId: requiredString(params.entryId, "entryId"),
            visibility: "public",
          });
          return { body: { entry: publicEntry(entry) } };
        },
        { visibility: "public", resourceParam: "entryId" },
      ),
    },
    "/public/entries/by-slug/:contentType/:locale/:slug": {
      GET: secure(
        "entry:read",
        "entry",
        async (request, params, context) => {
          const url = new URL(request.url);
          const fallbackLocales = readLocaleFallbacks(url);
          const entry = await cms.findEntry({
            ...context,
            contentType: requiredString(params.contentType, "contentType"),
            locale: requiredString(params.locale, "locale", 100),
            slug: requiredString(params.slug, "slug"),
            ...(fallbackLocales ? { fallbackLocales } : {}),
            visibility: "public",
          });
          return { body: { entry: publicEntry(entry) } };
        },
        { visibility: "public" },
      ),
    },
    "/scheduler/publications": {
      POST: secure("entry:publish", "entry", async (request, _params, context) => {
        const body = await parseJson(request);
        if (!isRecord(body.publication)) {
          throw new CmsHttpError(400, "INVALID_REQUEST", "publication is required.");
        }
        const publicationBody = body.publication;
        const entryId = requiredString(publicationBody.entryId, "publication.entryId");
        const scheduledRevisionNumber = optionalNumber(
          publicationBody.scheduledRevisionNumber,
          "publication.scheduledRevisionNumber",
        );
        if (scheduledRevisionNumber === undefined) {
          throw new CmsHttpError(
            400,
            "INVALID_REQUEST",
            "publication.scheduledRevisionNumber is required.",
          );
        }
        const publication: CmsScheduledPublication = {
          id: `${entryId}:${scheduledRevisionNumber}`,
          tenantId: context.tenantId,
          entryId,
          scheduledRevisionNumber,
          publishAt: new Date(requiredString(publicationBody.publishAt, "publication.publishAt", 100)),
          timeZone: requiredString(publicationBody.timeZone, "publication.timeZone", 100),
        };
        const result = await cms.publishScheduled({ ...context, publication });
        return {
          body: {
            ...result,
            ...(result.published
              ? { entry: apiAdminEntry(result.entry) }
              : {}),
          },
        };
      }),
    },
  };
  if (webhooks && webhookService) {
    const secretReference = async (
      input: Parameters<typeof webhooks.resolveSecretRef>[0],
    ): Promise<string> => {
      const value = await webhooks.resolveSecretRef(input);
      if (typeof value !== "string" || !value.trim() || value.length > 500) {
        throw new TypeError("The host webhook secret reference resolver returned an invalid reference.");
      }
      return value;
    };
    routes["/admin/webhooks"] = {
      GET: secure("webhook:read", "webhook", async (_request, _params, context) => ({
        body: { subscriptions: (await webhookService.listSubscriptions(context)).map(apiWebhookSubscription) },
      })),
      POST: secure("webhook:manage", "webhook", async (request, _params, context) => {
        const input = webhookSubscriptionInput(await parseJson(request));
        await webhookService.assertCanManage(context);
        const secretRef = await secretReference({ context, request, purpose: "create" });
        const subscription = await webhookService.createSubscription({ ...context, ...input, secretRef });
        return { status: 201, body: { subscription: apiWebhookSubscription(subscription) } };
      }),
    };
    routes["/admin/webhooks/:subscriptionId"] = {
      GET: secure("webhook:read", "webhook", async (_request, params, context) => ({
        body: {
          subscription: apiWebhookSubscription(await webhookService.getSubscription({
            ...context, subscriptionId: requiredString(params.subscriptionId, "subscriptionId"),
          })),
        },
      }), { resourceParam: "subscriptionId" }),
      PATCH: secure("webhook:manage", "webhook", async (request, params, context) => {
        const subscriptionId = requiredString(params.subscriptionId, "subscriptionId");
        const body = await parseJson(request);
        const input = webhookSubscriptionInput(body);
        const expectedRevision = optionalNumber(body.expectedRevision, "expectedRevision");
        if (expectedRevision === undefined) {
          throw new CmsHttpError(400, "INVALID_REQUEST", "expectedRevision is required.");
        }
        if (body.rotateSecret !== undefined && typeof body.rotateSecret !== "boolean") {
          throw new CmsHttpError(400, "INVALID_REQUEST", "rotateSecret must be a boolean.");
        }
        const current = await webhookService.getSubscription({ ...context, subscriptionId });
        await webhookService.assertCanManage({ ...context, subscriptionId });
        if (current.revision !== expectedRevision) {
          throw new CmsHttpError(409, "CONFLICT", "The webhook subscription changed since it was read.");
        }
        const secretRef = body.rotateSecret === true
          ? await secretReference({ context, request, purpose: "rotate", subscriptionId })
          : current.secretRef;
        const subscription = await webhookService.updateSubscription({
          ...context, ...input, subscriptionId, expectedRevision, secretRef,
        });
        return { body: { subscription: apiWebhookSubscription(subscription) } };
      }, { resourceParam: "subscriptionId" }),
    };
    routes["/admin/webhooks/:subscriptionId/deliveries"] = {
      GET: secure("webhook:read", "webhook", async (request, params, context) => {
        const first = positiveInteger(new URL(request.url).searchParams.get("first") ?? undefined, "first", 100, 500);
        const deliveries = await webhookService.listDeliveries({
          ...context, subscriptionId: requiredString(params.subscriptionId, "subscriptionId"), first,
        });
        return { body: { deliveries: deliveries.map(apiWebhookDelivery) } };
      }, { resourceParam: "subscriptionId" }),
    };
    routes["/admin/webhook-deliveries/:deliveryId/attempts"] = {
      GET: secure("webhook:read", "webhook", async (request, params, context) => {
        const first = positiveInteger(new URL(request.url).searchParams.get("first") ?? undefined, "first", 100, 500);
        const attempts = await webhookService.listAttempts({
          ...context, deliveryId: requiredString(params.deliveryId, "deliveryId"), first,
        });
        return { body: { attempts: attempts.map(apiWebhookAttempt) } };
      }, { resourceParam: "deliveryId" }),
    };
    routes["/admin/webhook-deliveries/:deliveryId/retry"] = {
      POST: secure("webhook:manage", "webhook", async (request, params, context) => {
        const body = await parseJson(request);
        const expectedRevision = optionalNumber(body.expectedRevision, "expectedRevision");
        if (expectedRevision === undefined) {
          throw new CmsHttpError(400, "INVALID_REQUEST", "expectedRevision is required.");
        }
        await webhookService.retryDelivery({
          ...context, deliveryId: requiredString(params.deliveryId, "deliveryId"), expectedRevision,
        });
        return { body: { retried: true } };
      }, { resourceParam: "deliveryId" }),
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

  async function mutationInput(request: Request): Promise<
    Pick<CmsEntryMutationInput, "expectedRevision" | "changeSummary">
  > {
    const body = await parseJson(request);
    return {
      expectedRevision: optionalNumber(body.expectedRevision, "expectedRevision")!,
      ...(body.changeSummary === undefined
        ? {}
        : { changeSummary: optionalString(body.changeSummary, "changeSummary") }),
    };
  }
};

export type {
  CmsApiDate,
  CmsApiMediaUsage,
  CmsApiPublishedSnapshot,
  CmsApiScheduleEntryInput,
  CmsApiPublication,
  CmsPublishedEntryPage,
  CmsPublishedEntry,
};
