import type { StorageAdapter } from "@puzzle-ui/storage";
import { CmsService } from "./service";
import { toCmsFieldDefinition } from "./fields";
import type { RuntimeCmsFieldDefinition } from "./fields";
import type {
  CmsAccessPolicy,
  CmsActor,
  CmsContext,
  CmsCustomFieldValidator,
  CmsChangeEventPage,
  CmsMediaReferenceValidator,
  CmsScheduler,
  CmsSchemaMigration,
  ContentTypeDefinition,
} from "./types";
import type { CmsConfig, CmsCollectionRegistry } from "./config/define-cms";
import type {
  CmsCollectionRuntimeOptions,
  CollectionDefinition,
  CollectionKind,
  CollectionOptions,
  FieldMap,
} from "./collections/collection";
import {
  createCollectionService,
  flattenCmsEntry,
  type CmsDocument,
  type CmsCollectionService,
  type CmsScheduledPublicationInput,
} from "./collections/collection-api";
import { normalizeCmsSlug } from "./schema";
import { CmsNotFoundError } from "./errors";
import type { CmsScheduledPublicationResult } from "./service";

type RuntimeContentTypeDefinition = Omit<ContentTypeDefinition, "fields"> & {
  readonly fields: readonly RuntimeCmsFieldDefinition[];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getCollectionDefinition = (
  value: unknown,
  key: string,
): CollectionDefinition<FieldMap, CollectionKind> => {
  if (
    !isRecord(value) ||
    !isRecord(value.fields) ||
    (value.kind !== "collection" && value.kind !== "singleton")
  ) {
    throw new TypeError(`Invalid code-first collection "${key}".`);
  }
  return value as unknown as CollectionDefinition<FieldMap, CollectionKind>;
};

export type CmsRequestContext = {
  readonly tenantId: string;
  readonly actor?: CmsActor | null;
  readonly user?: CmsActor | null;
};

type CreateCmsBaseOptions<TCollections extends CmsCollectionRegistry> = {
  readonly config: CmsConfig<TCollections>;
  readonly storage: StorageAdapter;
  readonly scheduler?: CmsScheduler;
  readonly mediaReferenceValidator?: CmsMediaReferenceValidator;
  readonly customValidators?: Readonly<Record<string, CmsCustomFieldValidator>>;
  readonly migrations?: readonly CmsSchemaMigration[];
  readonly clock?: () => Date;
  readonly idGenerator?: () => string;
  readonly emitChangeEvents?: boolean;
};

type CreateCmsContextOptions =
  | {
      readonly context?: undefined;
      readonly accessPolicy?: CmsAccessPolicy;
    }
  | {
      readonly context: CmsRequestContext;
      readonly accessPolicy: CmsAccessPolicy;
    };

export type CreateCmsOptions<TCollections extends CmsCollectionRegistry> =
  CreateCmsBaseOptions<TCollections> & CreateCmsContextOptions;

export type CmsInstance<
  TCollections extends CmsCollectionRegistry,
  TScheduler extends boolean = false,
  TChangeEvents extends boolean = false,
> = {
  readonly [TKey in keyof TCollections]: TCollections[TKey] extends CollectionDefinition<
    infer TFields,
    infer TKind,
    infer TOptions
  >
    ? CmsCollectionService<TFields, TKind, TOptions, TScheduler>
    : never;
} & (TScheduler extends true
  ? { readonly $scheduler: CmsSchedulerApi<TCollections> }
  : Record<never, never>)
  & (TChangeEvents extends true
    ? { readonly events: CmsEventsApi }
    : Record<never, never>);

export type CmsScheduledResult<TCollections extends CmsCollectionRegistry> =
  | {
      readonly published: true;
      readonly entry: {
        [TKey in keyof TCollections]: TCollections[TKey] extends CollectionDefinition<
          infer TFields,
          CollectionKind,
          infer TOptions
        >
          ? CmsDocument<TFields, TOptions>
          : never;
      }[keyof TCollections];
    }
  | { readonly published: false; readonly reason: "stale" | "not-due" };

type SchedulerEnabled<TOptions> = [TOptions] extends [
  { readonly scheduler: CmsScheduler },
]
  ? true
  : false;

type ChangeEventsEnabled<TOptions> = [TOptions] extends [
  { readonly emitChangeEvents: true },
]
  ? true
  : false;

export type CmsSchedulerApi<TCollections extends CmsCollectionRegistry> = {
  publishScheduled(
    publication: CmsScheduledPublicationInput,
  ): Promise<CmsScheduledResult<TCollections>>;
};

export type CmsEventsApi = {
  list(input?: {
    readonly first?: number;
    readonly after?: string;
  }): Promise<CmsChangeEventPage>;
  acknowledge(
    eventId: string,
    options: { readonly expectedRevision: number },
  ): Promise<void>;
};

export type CmsInstanceWithScheduler<
  TCollections extends CmsCollectionRegistry,
  TScheduler extends boolean,
  TChangeEvents extends boolean = false,
> = TScheduler extends true
  ? CmsInstance<TCollections, true, TChangeEvents>
  : CmsInstance<TCollections, false, TChangeEvents>;

const resolveContext = (context?: CmsRequestContext): CmsContext => {
  if (!context) return { tenantId: "default", actor: null };
  if (!context.tenantId.trim()) {
    throw new TypeError("CMS context requires a non-empty tenantId.");
  }
  const hasActor = Object.hasOwn(context, "actor");
  const hasUser = Object.hasOwn(context, "user");
  if (hasActor && hasUser) {
    throw new TypeError("Provide either actor or user in CMS context, not both.");
  }
  return {
    tenantId: context.tenantId,
    actor: hasActor ? context.actor ?? null : context.user ?? null,
  };
};

/** Permits only the implicit single-tenant `default` context with a null actor. */
export const cmsLocalAccessPolicy: CmsAccessPolicy = (request) =>
  request.tenantId === "default" && request.actor === null;

const denyAccessPolicy: CmsAccessPolicy = () => false;

const titleFromKey = (key: string): string =>
  key
    .replace(/[_-]+/g, " ")
    .replace(/\b\p{L}/gu, (letter) => letter.toUpperCase());

const toContentTypeDefinition = <
  TKind extends CollectionKind,
  TOptions extends CollectionOptions<FieldMap>,
>(
  key: string,
  collection: CollectionDefinition<TOptions["fields"], TKind, TOptions>,
): RuntimeContentTypeDefinition => {
  const fields: RuntimeCmsFieldDefinition[] = [];
  for (const fieldKey of Object.keys(collection.fields)) {
    const descriptor = collection.fields[fieldKey];
    if (!descriptor) continue;
    fields.push(
      toCmsFieldDefinition(
        fieldKey,
        descriptor.label ?? fieldKey,
        descriptor,
      ),
    );
  }
  return {
    slug: key,
    name: collection.name ?? titleFromKey(key),
    description: collection.description,
    version: collection.version ?? 1,
    fields,
    locales: collection.localization?.locales ?? ["en"],
    defaultLocale:
      collection.localization?.defaultLocale ??
      collection.localization?.locales[0] ??
      "en",
  };
};

/**
 * Creates a code-first CMS instance. Omitting both context and accessPolicy
 * selects the local-only default policy; request-bound contexts require an
 * explicit host accessPolicy.
 */
export const createCms = <
  const TOptions extends CreateCmsOptions<CmsCollectionRegistry>,
>(
  options: TOptions,
): CmsInstanceWithScheduler<
  TOptions["config"]["collections"],
  SchedulerEnabled<TOptions>,
  ChangeEventsEnabled<TOptions>
> => {
  const context = resolveContext(options.context);
  const accessPolicy =
    options.accessPolicy ??
    (options.context === undefined ? cmsLocalAccessPolicy : denyAccessPolicy);
  const collectionOptions: Record<string, CmsCollectionRuntimeOptions> = {};
  for (const key in options.config.collections) {
    if (!Object.hasOwn(options.config.collections, key)) continue;
    const definition = getCollectionDefinition(
      options.config.collections[key],
      key,
    );
    const slug = normalizeCmsSlug(key);
    collectionOptions[slug] = {
      drafts: definition.drafts ?? false,
      timestamps: definition.timestamps ?? false,
      access: definition.access,
      hooks: definition.hooks,
    };
  }
  const service = new CmsService({
    storage: options.storage,
    accessPolicy,
    scheduler: options.scheduler,
    mediaReferenceValidator: options.mediaReferenceValidator,
    customValidators: options.customValidators,
    migrations: options.migrations,
    clock: options.clock,
    idGenerator: options.idGenerator,
    emitChangeEvents: options.emitChangeEvents,
    collectionOptions,
  });
  let registration: Promise<void> | undefined;

  const ensureRegistered = (): Promise<void> => {
    if (!registration) {
      const pending = Promise.resolve().then(async () => {
        for (const key in options.config.collections) {
          if (!Object.hasOwn(options.config.collections, key)) continue;
          const definition = getCollectionDefinition(
            options.config.collections[key],
            key,
          );
          const runtimeDefinition = toContentTypeDefinition(key, definition);
          await service.registerContentType({
            ...context,
            definition:
              runtimeDefinition as unknown as ContentTypeDefinition,
          });
        }
      });
      registration = pending.catch((error: unknown) => {
        registration = undefined;
        throw error;
      });
    }
    return registration;
  };

  const instance: Record<string, unknown> = Object.create(null) as Record<
    string,
    unknown
  >;
  for (const key in options.config.collections) {
    if (!Object.hasOwn(options.config.collections, key)) continue;
    const definition = getCollectionDefinition(
      options.config.collections[key],
      key,
    );
    instance[key] = createCollectionService(
      service,
      context,
      key,
      definition,
      options.scheduler !== undefined,
      ensureRegistered,
    );
  }
  if (options.scheduler) {
    const publishScheduled = async (
      input: CmsScheduledPublicationInput,
    ): Promise<CmsScheduledResult<TOptions["config"]["collections"]>> => {
      await ensureRegistered();
      const result: CmsScheduledPublicationResult = await service.publishScheduled({
        ...context,
        publication: {
          ...input,
          id: `${input.entryId}:${input.scheduledRevisionNumber}`,
          tenantId: context.tenantId,
        },
      });
      if (!result.published) return result;
      const match = Object.keys(options.config.collections).find(
        (key) =>
          normalizeCmsSlug(key) === result.entry.contentTypeSlug,
      );
      if (!match) throw new CmsNotFoundError("Configured collection");
      const definition = options.config.collections[match];
      if (!definition) throw new CmsNotFoundError("Configured collection");
      const configured = getCollectionDefinition(definition, match);
      return {
        published: true,
        entry: flattenCmsEntry(result.entry, configured.timestamps === true),
      } as CmsScheduledResult<TOptions["config"]["collections"]>;
    };
    Object.defineProperty(instance, "$scheduler", {
      enumerable: true,
      value: { publishScheduled },
    });
  }
  if (options.emitChangeEvents === true) {
    Object.defineProperty(instance, "events", {
      enumerable: true,
      value: {
        list: async (input?: {
          readonly first?: number;
          readonly after?: string;
        }) => {
          await ensureRegistered();
          return service.listChangeEvents({
            ...context,
            first: input?.first,
            after: input?.after,
          });
        },
        acknowledge: async (
          eventId: string,
          eventOptions: { readonly expectedRevision: number },
        ) => {
          await ensureRegistered();
          await service.acknowledgeChangeEvent({
            ...context,
            eventId,
            expectedRevision: eventOptions.expectedRevision,
          });
        },
      } satisfies CmsEventsApi,
    });
  }
  return instance as CmsInstanceWithScheduler<
    TOptions["config"]["collections"],
    SchedulerEnabled<TOptions>,
    ChangeEventsEnabled<TOptions>
  >;
};
