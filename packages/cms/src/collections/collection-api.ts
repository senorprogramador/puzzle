import type {
  CmsContentEntry,
  CmsContentRevision,
  CmsContext,
  CmsEntrySort,
  CmsEntryView,
  CmsFields,
  CmsScheduledPublication,
  CmsVisibility,
  CmsValue,
} from "../types";
import { CmsNotFoundError, CmsValidationError } from "../errors";
import type { CmsService } from "../service";
import type { FieldsCreateInput, FieldsValue } from "../fields";
import type {
  CollectionLocalization,
  CollectionDefinition,
  CollectionKind,
  CollectionOptions,
  FieldMap,
} from "./collection";
import {
  normalizeWhere,
  type CmsCollectionFindInput,
  type CmsCollectionPage,
  type CmsCollectionReadOptions,
  type CmsEntryWhereNode,
} from "./query";

type SlugFieldKeys<TFields extends FieldMap> = {
  [TKey in keyof TFields]: TFields[TKey] extends { readonly type: "slug" }
    ? TKey
    : never;
}[keyof TFields];

type HasSlugField<TFields extends FieldMap> =
  [SlugFieldKeys<TFields>] extends [never] ? false : true;

type GeneratedSlugFlags<TFields extends FieldMap> = {
  [TKey in keyof TFields]: TFields[TKey] extends {
    readonly type: "slug";
    readonly from: string;
  }
    ? true
    : false;
}[keyof TFields];

type HasGeneratedSlugField<TFields extends FieldMap> =
  Extract<GeneratedSlugFlags<TFields>, true> extends never ? false : true;

type RequiredSlugFlags<TFields extends FieldMap> = {
  [TKey in keyof TFields]: TFields[TKey] extends {
    readonly type: "slug";
    readonly required: true;
    readonly __defaultType?: false;
  }
    ? true
    : false;
}[keyof TFields];

type HasRequiredSlugField<TFields extends FieldMap> =
  Extract<RequiredSlugFlags<TFields>, true> extends never ? false : true;

type CanOmitExplicitSlug<TFields extends FieldMap> =
  HasGeneratedSlugField<TFields> extends true
    ? true
    : HasRequiredSlugField<TFields>;

type LocalizationOptions<TOptions> =
  TOptions extends { readonly localization: CollectionLocalization }
    ? { readonly locale?: string }
    : { readonly locale?: never };

type TranslationGroupOption<TOptions> =
  TOptions extends { readonly localization: CollectionLocalization }
    ? { readonly translationGroupId?: string }
    : { readonly translationGroupId?: never };

type DraftLifecycleOptions<
  TFields extends FieldMap,
  TOptions extends CollectionOptions<TFields>,
> =
  TOptions extends { readonly drafts: true }
    ? {
        publish(
          id: string,
          options?: CmsMutationOptions,
        ): Promise<CmsDocument<TFields, TOptions>>;
        unpublish(
          id: string,
          options?: CmsMutationOptions,
        ): Promise<CmsDocument<TFields, TOptions>>;
        listRevisions(
          id: string,
          options?: { readonly first?: number },
        ): Promise<readonly CmsCollectionRevision<TFields>[]>;
        restoreRevision(
          id: string,
          revisionId: string,
          options?: CmsMutationOptions,
        ): Promise<CmsDocument<TFields, TOptions>>;
      }
    : Record<never, never>;

type SchedulerLifecycleOptions<
  TFields extends FieldMap,
  TScheduler extends boolean,
  TOptions extends CollectionOptions<TFields>,
> = TScheduler extends true
  ? {
      schedulePublish(
        id: string,
        options: CmsScheduleOptions,
      ): Promise<CmsDocument<TFields, TOptions>>;
      unschedule(
        id: string,
        options?: CmsMutationOptions,
      ): Promise<CmsDocument<TFields, TOptions>>;
    }
  : Record<never, never>;

type LocalizationApi<
  TFields extends FieldMap,
  TOptions extends CollectionOptions<TFields>,
> = TOptions extends { readonly localization: CollectionLocalization }
  ? {
      createTranslation(
        id: string,
        data: FieldsCreateInput<TFields>,
        options: {
          readonly locale: string;
          readonly slug?: string;
          readonly changeSummary?: string;
        },
      ): Promise<CmsDocument<TFields, TOptions>>;
      listLocaleVariants(
        id: string,
        input?: Omit<CmsCollectionFindInput<TFields, TOptions>, "locale">,
      ): Promise<CmsCollectionPage<CmsDocument<TFields, TOptions>>>;
    }
  : Record<never, never>;

type SingletonDraftLifecycleOptions<
  TFields extends FieldMap,
  TOptions extends CollectionOptions<TFields>,
> = TOptions extends { readonly drafts: true }
  ? {
      publish(options?: CmsMutationOptions): Promise<CmsDocument<TFields, TOptions>>;
      unpublish(options?: CmsMutationOptions): Promise<CmsDocument<TFields, TOptions>>;
      listRevisions(
        options?: { readonly first?: number },
      ): Promise<readonly CmsCollectionRevision<TFields>[]>;
      restoreRevision(
        revisionId: string,
        options?: CmsMutationOptions,
      ): Promise<CmsDocument<TFields, TOptions>>;
    }
  : Record<never, never>;

type SingletonSchedulerOptions<
  TFields extends FieldMap,
  TScheduler extends boolean,
  TOptions extends CollectionOptions<TFields>,
> = TScheduler extends true
  ? {
      schedulePublish(
        options: CmsScheduleOptions & LocalizationOptions<TOptions>,
      ): Promise<CmsDocument<TFields, TOptions>>;
      unschedule(
        options?: CmsMutationOptions & LocalizationOptions<TOptions>,
      ): Promise<CmsDocument<TFields, TOptions>>;
    }
  : Record<never, never>;

type SingletonLocalizationApi<
  TFields extends FieldMap,
  TOptions extends CollectionOptions<TFields>,
> = TOptions extends { readonly localization: CollectionLocalization }
  ? {
      createTranslation(
        data: FieldsCreateInput<TFields>,
        options: {
          readonly locale: string;
          readonly changeSummary?: string;
        },
      ): Promise<CmsDocument<TFields, TOptions>>;
      listLocaleVariants(
        input?: Omit<CmsCollectionFindInput<TFields, TOptions>, "locale">,
      ): Promise<CmsCollectionPage<CmsDocument<TFields, TOptions>>>;
    }
  : Record<never, never>;

export type CmsMutationOptions = {
  readonly expectedRevision?: number;
  readonly changeSummary?: string;
};

export type CmsPurgeOptions = {
  readonly expectedRevision: number;
  readonly changeSummary?: string;
};

export type CmsScheduleOptions = CmsMutationOptions & {
  readonly publishAt: Date;
  readonly timeZone: string;
};

export type CmsScheduledPublicationInput = Pick<
  CmsScheduledPublication,
  "entryId" | "scheduledRevisionNumber" | "publishAt" | "timeZone"
>;

export type CmsCollectionRevision<TFields extends FieldMap> = Omit<
  CmsContentRevision,
  "fields"
> & {
  readonly fields: FieldsValue<TFields>;
};

type CmsDocumentTimestamps<TOptions> =
  TOptions extends { readonly timestamps: true }
    ? { readonly createdAt: Date; readonly updatedAt: Date }
    : Record<never, never>;

export type CmsDocument<
  TFields extends FieldMap,
  TOptions extends CollectionOptions<TFields> = CollectionOptions<TFields>,
> = FieldsValue<TFields> & {
  readonly id: string;
  readonly slug: string;
  readonly locale: string;
  readonly status: CmsContentEntry["status"];
  readonly publishedAt: Date | null;
  readonly scheduledAt: Date | null;
  readonly scheduledTimeZone: string | null;
  readonly scheduledRevisionNumber: number | null;
  readonly archivedAt: Date | null;
  readonly deletedAt: Date | null;
  readonly revision: number;
  readonly revisionNumber: number;
} & CmsDocumentTimestamps<TOptions>;

export type CmsCreateOptions<
  TFields extends FieldMap,
  TOptions extends CollectionOptions<TFields> = CollectionOptions<TFields>,
> = LocalizationOptions<TOptions> &
  TranslationGroupOption<TOptions> & {
    readonly changeSummary?: string;
  } &
  (CanOmitExplicitSlug<TFields> extends true
    ? { readonly slug?: string }
    : { readonly slug: string });

export type CmsCreateArguments<
  TFields extends FieldMap,
  TOptions extends CollectionOptions<TFields> = CollectionOptions<TFields>,
> =
  CanOmitExplicitSlug<TFields> extends true
    ? readonly [options?: CmsCreateOptions<TFields, TOptions>]
    : readonly [options: CmsCreateOptions<TFields, TOptions>];

export type CmsUpdateOptions = CmsMutationOptions & {
  readonly slug?: string;
};

export type CmsSingletonUpdateOptions = CmsMutationOptions;

type SlugLookupApi<
  TFields extends FieldMap,
  TOptions extends CollectionOptions<TFields>,
> =
  HasSlugField<TFields> extends true
    ? {
        findBySlug(
          slug: string,
          options?: CmsCollectionReadOptions<TOptions> &
            (TOptions extends {
              readonly localization: CollectionLocalization;
            }
              ? { readonly fallbackLocales?: readonly string[] }
              : { readonly fallbackLocales?: never }),
        ): Promise<CmsDocument<TFields, TOptions>>;
      }
    : Record<never, never>;

export type CmsCollectionApi<
  TFields extends FieldMap,
  TOptions extends CollectionOptions<TFields> = CollectionOptions<TFields>,
  TScheduler extends boolean = false,
> = {
  find(
    input?: CmsCollectionFindInput<TFields, TOptions>,
  ): Promise<CmsCollectionPage<CmsDocument<TFields, TOptions>>>;
  findById(
    id: string,
    options?: Pick<CmsCollectionReadOptions<TOptions>, "visibility">,
  ): Promise<CmsDocument<TFields, TOptions>>;
  create(
    data: FieldsCreateInput<TFields>,
    ...options: CmsCreateArguments<TFields, TOptions>
  ): Promise<CmsDocument<TFields, TOptions>>;
  update(
    id: string,
    data: Partial<FieldsValue<TFields>>,
    options?: CmsUpdateOptions,
  ): Promise<CmsDocument<TFields, TOptions>>;
  delete(
    id: string,
    options?: CmsMutationOptions,
  ): Promise<CmsDocument<TFields, TOptions>>;
  purge(id: string, options: CmsPurgeOptions): Promise<void>;
  archive(
    id: string,
    options?: CmsMutationOptions,
  ): Promise<CmsDocument<TFields, TOptions>>;
} & SlugLookupApi<TFields, TOptions>
  & DraftLifecycleOptions<TFields, TOptions>
  & SchedulerLifecycleOptions<TFields, TScheduler, TOptions>
  & LocalizationApi<TFields, TOptions>;

export type CmsSingletonApi<
  TFields extends FieldMap,
  TOptions extends CollectionOptions<TFields> = CollectionOptions<TFields>,
  TScheduler extends boolean = false,
> = {
  find(
    options?: CmsCollectionReadOptions<TOptions>,
  ): Promise<CmsDocument<TFields, TOptions> | null>;
  create(
    data: FieldsCreateInput<TFields>,
    options?: LocalizationOptions<TOptions> &
      TranslationGroupOption<TOptions> & {
        readonly changeSummary?: string;
      },
  ): Promise<CmsDocument<TFields, TOptions>>;
  update(
    data: Partial<FieldsValue<TFields>>,
    options?: CmsSingletonUpdateOptions & LocalizationOptions<TOptions>,
  ): Promise<CmsDocument<TFields, TOptions>>;
  delete(
    options?: CmsMutationOptions & LocalizationOptions<TOptions>,
  ): Promise<CmsDocument<TFields, TOptions>>;
  purge(
    options: CmsPurgeOptions & LocalizationOptions<TOptions>,
  ): Promise<void>;
  archive(
    options?: CmsMutationOptions & LocalizationOptions<TOptions>,
  ): Promise<CmsDocument<TFields, TOptions>>;
} & SingletonDraftLifecycleOptions<TFields, TOptions>
  & SingletonSchedulerOptions<TFields, TScheduler, TOptions>
  & SingletonLocalizationApi<TFields, TOptions>;

export type CmsCollectionService<
  TFields extends FieldMap,
  TKind extends CollectionKind,
  TOptions extends CollectionOptions<TFields> = CollectionOptions<TFields>,
  TScheduler extends boolean = false,
> = TKind extends "singleton"
  ? CmsSingletonApi<TFields, TOptions, TScheduler>
  : CmsCollectionApi<TFields, TOptions, TScheduler>;

export type CmsCollectionReadVisibility = CmsVisibility;

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const MAX_PAGE_NUMBER = 100;
const SINGLETON_SLUG = "singleton";

const isCmsValue = (value: unknown, seen = new Set<object>()): value is CmsValue => {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return true;
  }
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value !== "object" || seen.has(value)) return false;
  seen.add(value);
  const valid = Array.isArray(value)
    ? value.every((item) => isCmsValue(item, seen))
    : Object.getPrototypeOf(value) === Object.prototype &&
      Object.values(value).every((item) => isCmsValue(item, seen));
  seen.delete(value);
  return valid;
};

const asCmsFields = (input: object): CmsFields => {
  const record = input as Readonly<Record<string, unknown>>;
  const fields: Record<string, CmsValue> = {};
  for (const key of Object.keys(record)) {
    const value = record[key];
    if (value === undefined) continue;
    if (!isCmsValue(value)) {
      throw new CmsValidationError([
        {
          path: key,
          code: "serialization",
          message: "Field values must be finite JSON-compatible values.",
        },
      ]);
    }
    fields[key] = value;
  }
  return fields;
};

const withGeneratedSlug = (
  fields: CmsFields,
  definitions: FieldMap,
): CmsFields => {
  const output: Record<string, CmsValue> = { ...fields };
  for (const key of Object.keys(definitions)) {
    const definition = definitions[key];
    if (
      !definition ||
      definition.type !== "slug" ||
      !definition.from ||
      Object.hasOwn(output, key)
    ) {
      continue;
    }
    const sourceDefinition = definitions[definition.from];
    const source = Object.hasOwn(output, definition.from)
      ? output[definition.from]
      : sourceDefinition?.defaultValue;
    if (typeof source === "string") output[key] = source;
  }
  return output;
};

export const flattenCmsEntry = <
  TFields extends FieldMap,
  TOptions extends CollectionOptions<TFields>,
>(
  entry: CmsEntryView,
  timestamps: boolean,
): CmsDocument<TFields, TOptions> => {
  const document = {
    ...entry.fields,
    id: entry.id,
    slug: entry.slug,
    locale: entry.resolvedLocale,
    status: entry.status,
    publishedAt: entry.publishedSnapshot?.publishedAt ?? null,
    scheduledAt: entry.scheduledAt,
    scheduledTimeZone: entry.scheduledTimeZone,
    scheduledRevisionNumber: entry.scheduledRevisionNumber,
    archivedAt: entry.archivedAt,
    deletedAt: entry.deletedAt,
    revision: entry.revision,
    revisionNumber: entry.revisionNumber,
    ...(timestamps
      ? { createdAt: entry.createdAt, updatedAt: entry.updatedAt }
      : {}),
  };
  return document as CmsDocument<TFields, TOptions>;
};

const flattenEntry = flattenCmsEntry;

const entrySort = (sort: unknown): readonly CmsEntrySort[] | undefined => {
  if (typeof sort !== "string") return undefined;
  const descending = sort.startsWith("-");
  return [
    {
      field: descending ? sort.slice(1) : sort,
      direction: descending ? "desc" : "asc",
    },
  ];
};

const entryPage = <
  TFields extends FieldMap,
  TOptions extends CollectionOptions<TFields>,
>(
  input: CmsCollectionFindInput<TFields, TOptions> | undefined,
): { readonly page: number; readonly limit: number } => {
  const page = input?.page ?? 1;
  const limit = input?.limit ?? DEFAULT_PAGE_SIZE;
  if (!Number.isInteger(page) || page < 1 || page > MAX_PAGE_NUMBER) {
    throw new CmsValidationError([
      {
        path: "page",
        code: "range",
        message: `Page must be an integer from 1 to ${MAX_PAGE_NUMBER}.`,
      },
    ]);
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_PAGE_SIZE) {
    throw new CmsValidationError([
      {
        path: "limit",
        code: "range",
        message: `Limit must be an integer from 1 to ${MAX_PAGE_SIZE}.`,
      },
    ]);
  }
  if (page > 1 && input?.after) {
    throw new CmsValidationError([
      {
        path: "after",
        code: "pagination",
        message: "Choose either a page number or a cursor.",
      },
    ]);
  }
  return { page, limit };
};

const getLocale = (
  definition: { readonly localization?: CollectionLocalization },
  requested?: string,
): string =>
  requested ??
  definition.localization?.defaultLocale ??
  definition.localization?.locales[0] ??
  "en";

const findSingletonEntry = async (
  service: CmsService,
  context: CmsContext,
  contentType: string,
  locale: string,
  visibility: CmsVisibility,
): Promise<CmsEntryView | null> => {
  try {
    return await service.findEntry({
      ...context,
      contentType,
      locale,
      slug: SINGLETON_SLUG,
      visibility,
    });
  } catch (error) {
    if (error instanceof CmsNotFoundError) return null;
    throw error;
  }
};

const createCollectionApi = <
  TFields extends FieldMap,
  TOptions extends CollectionOptions<TFields>,
  TScheduler extends boolean,
>(
  service: CmsService,
  context: CmsContext,
  contentType: string,
  definition: CollectionDefinition<TFields, "collection", TOptions>,
  timestamps: boolean,
  schedulerEnabled: TScheduler,
  ensureRegistered: () => Promise<void>,
): CmsCollectionApi<TFields, TOptions, TScheduler> => {
  const hasSlugField = Object.values(definition.fields).some(
    (field) => field.type === "slug",
  );
  const find = async (
    input?: CmsCollectionFindInput<TFields, TOptions>,
  ): Promise<CmsCollectionPage<CmsDocument<TFields, TOptions>>> => {
    await ensureRegistered();
    const { page, limit } = entryPage(input);
    const where = normalizeWhere(input?.where);
    const orderBy = entrySort(input?.sort);
    const baseQuery = {
      ...context,
      contentType,
      ...("locale" in (input ?? {}) && input?.locale !== undefined
        ? { locale: input.locale }
        : {}),
      visibility: input?.visibility ?? "admin",
      first: limit,
      filters: [],
      orderBy,
      where,
    };
    let after: string | undefined =
      typeof input?.after === "string" ? input.after : undefined;
    let result: Awaited<ReturnType<CmsService["listEntries"]>> | undefined;
    for (let currentPage = 1; currentPage <= page; currentPage += 1) {
      result = await service.listEntries({
        ...baseQuery,
        after,
      });
      if (currentPage < page) {
        if (!result.hasNextPage || !result.nextCursor) {
          return {
            items: [],
            page,
            limit,
            nextCursor: null,
            hasNextPage: false,
          };
        }
        after = result.nextCursor;
      }
    }
    return {
      items: result?.items.map((entry) =>
        flattenEntry<TFields, TOptions>(entry, timestamps),
      ) ?? [],
      page,
      limit,
      nextCursor: result?.nextCursor ?? null,
      hasNextPage: result?.hasNextPage ?? false,
    };
  };

  const findById = async (
    id: string,
    options?: Pick<CmsCollectionReadOptions<TOptions>, "visibility">,
  ): Promise<CmsDocument<TFields, TOptions>> => {
    await ensureRegistered();
    return flattenEntry<TFields, TOptions>(
      await service.getEntry({
        ...context,
        entryId: id,
        visibility: options?.visibility ?? "admin",
      }),
      timestamps,
    );
  };

  const findBySlug = async (
    slug: string,
    options?: CmsCollectionReadOptions<TOptions> & {
      readonly fallbackLocales?: readonly string[];
    },
  ): Promise<CmsDocument<TFields, TOptions>> => {
    await ensureRegistered();
    return flattenEntry<TFields, TOptions>(
      await service.findEntry({
        ...context,
        contentType,
        locale: getLocale(definition, options?.locale),
        slug,
        fallbackLocales: options?.fallbackLocales,
        visibility: options?.visibility ?? "admin",
      }),
      timestamps,
    );
  };

  const create = async (
    data: FieldsCreateInput<TFields>,
    ...optionArgs: CmsCreateArguments<TFields, TOptions>
  ): Promise<CmsDocument<TFields, TOptions>> => {
    await ensureRegistered();
    const options =
      optionArgs[0] ?? ({} as CmsCreateOptions<TFields, TOptions>);
    const fields = withGeneratedSlug(asCmsFields(data), definition.fields);
    return flattenEntry<TFields, TOptions>(
      await service.createEntry({
        ...context,
        contentType,
        locale: getLocale(definition, options.locale),
        slug: options.slug,
        fields,
        translationGroupId: options.translationGroupId,
        changeSummary: options.changeSummary,
      }),
      timestamps,
    );
  };

  const update = async (
    id: string,
    data: Partial<FieldsValue<TFields>>,
    options?: CmsUpdateOptions,
  ): Promise<CmsDocument<TFields, TOptions>> => {
    await ensureRegistered();
    const current = await service.getEntry({
      ...context,
      entryId: id,
      visibility: "admin",
    });
    const updated = await service.saveDraft({
      ...context,
      entryId: id,
      expectedRevision: options?.expectedRevision ?? current.revision,
      fields: asCmsFields(data),
      slug: options?.slug ?? (hasSlugField ? undefined : current.slug),
      changeSummary: options?.changeSummary,
    });
    return flattenEntry<TFields, TOptions>(updated, timestamps);
  };

  const remove = async (
    id: string,
    options?: CmsMutationOptions,
  ): Promise<CmsDocument<TFields, TOptions>> => {
    await ensureRegistered();
    const current = await service.getEntry({
      ...context,
      entryId: id,
      visibility: "admin",
    });
    return flattenEntry<TFields, TOptions>(
      await service.deleteEntry({
        ...context,
        entryId: id,
        expectedRevision: options?.expectedRevision ?? current.revision,
        changeSummary: options?.changeSummary,
      }),
      timestamps,
    );
  };

  const purge = async (
    id: string,
    options: CmsPurgeOptions,
  ): Promise<void> => {
    await ensureRegistered();
    await service.purgeEntry({
      ...context,
      entryId: id,
      expectedRevision: options.expectedRevision,
      changeSummary: options.changeSummary,
    });
  };

  const archive = async (
    id: string,
    options?: CmsMutationOptions,
  ): Promise<CmsDocument<TFields, TOptions>> => {
    await ensureRegistered();
    const current = await service.getEntry({
      ...context,
      entryId: id,
      visibility: "admin",
    });
    return flattenEntry<TFields, TOptions>(
      await service.archive({
        ...context,
        entryId: id,
        expectedRevision: options?.expectedRevision ?? current.revision,
        changeSummary: options?.changeSummary,
      }),
      timestamps,
    );
  };

  const lifecycle = definition.drafts
    ? {
        publish: async (
          id: string,
          options?: CmsMutationOptions,
        ): Promise<CmsDocument<TFields, TOptions>> => {
          await ensureRegistered();
          const current = await service.getEntry({
            ...context,
            entryId: id,
            visibility: "admin",
          });
          return flattenEntry<TFields, TOptions>(
            await service.publish({
              ...context,
              entryId: id,
              expectedRevision: options?.expectedRevision ?? current.revision,
              changeSummary: options?.changeSummary,
            }),
            timestamps,
          );
        },
        unpublish: async (
          id: string,
          options?: CmsMutationOptions,
        ): Promise<CmsDocument<TFields, TOptions>> => {
          await ensureRegistered();
          const current = await service.getEntry({
            ...context,
            entryId: id,
            visibility: "admin",
          });
          return flattenEntry<TFields, TOptions>(
            await service.unpublish({
              ...context,
              entryId: id,
              expectedRevision: options?.expectedRevision ?? current.revision,
              changeSummary: options?.changeSummary,
            }),
            timestamps,
          );
        },
        listRevisions: async (
          id: string,
          options?: { readonly first?: number },
        ): Promise<readonly CmsCollectionRevision<TFields>[]> => {
          await ensureRegistered();
          const revisions = await service.listRevisions({
            ...context,
            entryId: id,
            first: options?.first,
          });
          return revisions as readonly CmsCollectionRevision<TFields>[];
        },
        restoreRevision: async (
          id: string,
          revisionId: string,
          options?: CmsMutationOptions,
        ): Promise<CmsDocument<TFields, TOptions>> => {
          await ensureRegistered();
          const current = await service.getEntry({
            ...context,
            entryId: id,
            visibility: "admin",
          });
          return flattenEntry<TFields, TOptions>(
            await service.restoreRevision({
              ...context,
              entryId: id,
              revisionId,
              expectedRevision: options?.expectedRevision ?? current.revision,
              changeSummary: options?.changeSummary,
            }),
            timestamps,
          );
        },
      }
    : {};

  const scheduler = schedulerEnabled
    ? {
        schedulePublish: async (
          id: string,
          options: CmsScheduleOptions,
        ): Promise<CmsDocument<TFields, TOptions>> => {
          await ensureRegistered();
          const current = await service.getEntry({
            ...context,
            entryId: id,
            visibility: "admin",
          });
          return flattenEntry<TFields, TOptions>(
            await service.schedulePublish({
              ...context,
              entryId: id,
              expectedRevision: options.expectedRevision ?? current.revision,
              publishAt: options.publishAt,
              timeZone: options.timeZone,
              changeSummary: options.changeSummary,
            }),
            timestamps,
          );
        },
        unschedule: async (
          id: string,
          options?: CmsMutationOptions,
        ): Promise<CmsDocument<TFields, TOptions>> => {
          await ensureRegistered();
          const current = await service.getEntry({
            ...context,
            entryId: id,
            visibility: "admin",
          });
          return flattenEntry<TFields, TOptions>(
            await service.unschedule({
              ...context,
              entryId: id,
              expectedRevision: options?.expectedRevision ?? current.revision,
              changeSummary: options?.changeSummary,
            }),
            timestamps,
          );
        },
      }
    : {};

  const localization = definition.localization
    ? {
        createTranslation: async (
          id: string,
          data: FieldsCreateInput<TFields>,
          options: {
            readonly locale: string;
            readonly slug?: string;
            readonly changeSummary?: string;
          },
        ): Promise<CmsDocument<TFields, TOptions>> => {
          await ensureRegistered();
          const current = await service.getEntry({
            ...context,
            entryId: id,
            visibility: "admin",
          });
          return flattenEntry<TFields, TOptions>(
            await service.createEntry({
              ...context,
              contentType,
              locale: options.locale,
              translationGroupId: current.translationGroupId,
              slug: options.slug,
              fields: withGeneratedSlug(asCmsFields(data), definition.fields),
              changeSummary: options.changeSummary,
            }),
            timestamps,
          );
        },
        listLocaleVariants: async (
          id: string,
          input?: Omit<CmsCollectionFindInput<TFields, TOptions>, "locale">,
        ): Promise<CmsCollectionPage<CmsDocument<TFields, TOptions>>> => {
          await ensureRegistered();
          const current = await service.getEntry({
            ...context,
            entryId: id,
            visibility: "admin",
          });
          const { page, limit } = entryPage(input);
          const where = normalizeWhere(input?.where);
          const orderBy = entrySort(input?.sort);
          let after: string | undefined =
            typeof input?.after === "string" ? input.after : undefined;
          let result: Awaited<ReturnType<CmsService["listEntryTranslations"]>> | undefined;
          for (let currentPage = 1; currentPage <= page; currentPage += 1) {
            result = await service.listEntryTranslations({
              ...context,
              contentType,
              translationGroupId: current.translationGroupId,
              visibility: input?.visibility ?? "admin",
              first: limit,
              filters: [],
              orderBy,
              where,
              after: typeof after === "string" ? after : undefined,
            });
            if (currentPage < page) {
              if (!result.hasNextPage || !result.nextCursor) {
                return {
                  items: [],
                  page,
                  limit,
                  nextCursor: null,
                  hasNextPage: false,
                };
              }
              after = result.nextCursor;
            }
          }
          return {
            items: result?.items.map((entry) =>
              flattenEntry<TFields, TOptions>(entry, timestamps),
            ) ?? [],
            page,
            limit,
            nextCursor: result?.nextCursor ?? null,
            hasNextPage: result?.hasNextPage ?? false,
          };
        },
      }
    : {};

  return {
    find,
    findById,
    findBySlug,
    create,
    update,
    delete: remove,
    purge,
    archive,
    ...lifecycle,
    ...scheduler,
    ...localization,
  } as unknown as CmsCollectionApi<TFields, TOptions, TScheduler>;
};

const createSingletonApi = <
  TFields extends FieldMap,
  TOptions extends CollectionOptions<TFields>,
  TScheduler extends boolean,
>(
  service: CmsService,
  context: CmsContext,
  contentType: string,
  definition: CollectionDefinition<TFields, "singleton", TOptions>,
  timestamps: boolean,
  schedulerEnabled: TScheduler,
  ensureRegistered: () => Promise<void>,
): CmsSingletonApi<TFields, TOptions, TScheduler> => {
  const find = async (
    options?: CmsCollectionReadOptions<TOptions>,
  ): Promise<CmsDocument<TFields, TOptions> | null> => {
    await ensureRegistered();
    const entry = await findSingletonEntry(
      service,
      context,
      contentType,
      getLocale(definition, options?.locale),
      options?.visibility ?? "admin",
    );
    return entry ? flattenEntry<TFields, TOptions>(entry, timestamps) : null;
  };

  const create = async (
    data: FieldsCreateInput<TFields>,
    options?: LocalizationOptions<TOptions> &
      TranslationGroupOption<TOptions> & {
        readonly changeSummary?: string;
      },
  ): Promise<CmsDocument<TFields, TOptions>> => {
    await ensureRegistered();
    return flattenEntry<TFields, TOptions>(
      await service.createEntry({
        ...context,
        contentType,
        locale: getLocale(definition, options?.locale),
        slug: SINGLETON_SLUG,
        translationGroupId: options?.translationGroupId,
        fields: asCmsFields(data),
        changeSummary: options?.changeSummary,
      }),
      timestamps,
    );
  };

  const update = async (
    data: Partial<FieldsValue<TFields>>,
    options?: CmsSingletonUpdateOptions & LocalizationOptions<TOptions>,
  ): Promise<CmsDocument<TFields, TOptions>> => {
    await ensureRegistered();
    const locale = getLocale(definition, options?.locale);
    const current = await findSingletonEntry(
      service,
      context,
      contentType,
      locale,
      "admin",
    );
    if (!current) throw new CmsNotFoundError("Singleton content entry");
    const updated = await service.saveDraft({
      ...context,
      entryId: current.id,
      expectedRevision: options?.expectedRevision ?? current.revision,
      fields: asCmsFields(data),
      slug: SINGLETON_SLUG,
      changeSummary: options?.changeSummary,
    });
    return flattenEntry<TFields, TOptions>(updated, timestamps);
  };

  const remove = async (
    options?: CmsMutationOptions & LocalizationOptions<TOptions>,
  ): Promise<CmsDocument<TFields, TOptions>> => {
    await ensureRegistered();
    const current = await findSingletonEntry(
      service,
      context,
      contentType,
      getLocale(definition, options?.locale),
      "admin",
    );
    if (!current) throw new CmsNotFoundError("Singleton content entry");
    return flattenEntry<TFields, TOptions>(
      await service.deleteEntry({
        ...context,
        entryId: current.id,
        expectedRevision: options?.expectedRevision ?? current.revision,
        changeSummary: options?.changeSummary,
      }),
      timestamps,
    );
  };

  const archive = async (
    options?: CmsMutationOptions & LocalizationOptions<TOptions>,
  ): Promise<CmsDocument<TFields, TOptions>> => {
    await ensureRegistered();
    const current = await findSingletonEntry(
      service,
      context,
      contentType,
      getLocale(definition, options?.locale),
      "admin",
    );
    if (!current) throw new CmsNotFoundError("Singleton content entry");
    return flattenEntry<TFields, TOptions>(
      await service.archive({
        ...context,
        entryId: current.id,
        expectedRevision: options?.expectedRevision ?? current.revision,
        changeSummary: options?.changeSummary,
      }),
      timestamps,
    );
  };

  const purge = async (
    options: CmsPurgeOptions & LocalizationOptions<TOptions>,
  ): Promise<void> => {
    await ensureRegistered();
    const current = await findSingletonEntry(
      service,
      context,
      contentType,
      getLocale(definition, options.locale),
      "admin",
    );
    if (!current) throw new CmsNotFoundError("Singleton content entry");
    await service.purgeEntry({
      ...context,
      entryId: current.id,
      expectedRevision: options.expectedRevision,
      changeSummary: options.changeSummary,
    });
  };

  const lifecycle = definition.drafts
    ? {
        publish: async (
          options?: CmsMutationOptions & LocalizationOptions<TOptions>,
        ): Promise<CmsDocument<TFields, TOptions>> => {
          await ensureRegistered();
          const current = await findSingletonEntry(
            service,
            context,
            contentType,
            getLocale(definition, options?.locale),
            "admin",
          );
          if (!current) throw new CmsNotFoundError("Singleton content entry");
          return flattenEntry<TFields, TOptions>(
            await service.publish({
              ...context,
              entryId: current.id,
              expectedRevision: options?.expectedRevision ?? current.revision,
              changeSummary: options?.changeSummary,
            }),
            timestamps,
          );
        },
        unpublish: async (
          options?: CmsMutationOptions & LocalizationOptions<TOptions>,
        ): Promise<CmsDocument<TFields, TOptions>> => {
          await ensureRegistered();
          const current = await findSingletonEntry(
            service,
            context,
            contentType,
            getLocale(definition, options?.locale),
            "admin",
          );
          if (!current) throw new CmsNotFoundError("Singleton content entry");
          return flattenEntry<TFields, TOptions>(
            await service.unpublish({
              ...context,
              entryId: current.id,
              expectedRevision: options?.expectedRevision ?? current.revision,
              changeSummary: options?.changeSummary,
            }),
            timestamps,
          );
        },
        listRevisions: async (
          options?: { readonly first?: number } & LocalizationOptions<TOptions>,
        ): Promise<readonly CmsCollectionRevision<TFields>[]> => {
          await ensureRegistered();
          const current = await findSingletonEntry(
            service,
            context,
            contentType,
            getLocale(definition, options?.locale),
            "admin",
          );
          if (!current) throw new CmsNotFoundError("Singleton content entry");
          const revisions = await service.listRevisions({
            ...context,
            entryId: current.id,
            first: options?.first,
          });
          return revisions as readonly CmsCollectionRevision<TFields>[];
        },
        restoreRevision: async (
          revisionId: string,
          options?: CmsMutationOptions & LocalizationOptions<TOptions>,
        ): Promise<CmsDocument<TFields, TOptions>> => {
          await ensureRegistered();
          const current = await findSingletonEntry(
            service,
            context,
            contentType,
            getLocale(definition, options?.locale),
            "admin",
          );
          if (!current) throw new CmsNotFoundError("Singleton content entry");
          return flattenEntry<TFields, TOptions>(
            await service.restoreRevision({
              ...context,
              entryId: current.id,
              revisionId,
              expectedRevision: options?.expectedRevision ?? current.revision,
              changeSummary: options?.changeSummary,
            }),
            timestamps,
          );
        },
      }
    : {};

  const scheduler = schedulerEnabled
    ? {
        schedulePublish: async (
          options: CmsScheduleOptions & LocalizationOptions<TOptions>,
        ): Promise<CmsDocument<TFields, TOptions>> => {
          await ensureRegistered();
          const current = await findSingletonEntry(
            service,
            context,
            contentType,
            getLocale(definition, options.locale),
            "admin",
          );
          if (!current) throw new CmsNotFoundError("Singleton content entry");
          return flattenEntry<TFields, TOptions>(
            await service.schedulePublish({
              ...context,
              entryId: current.id,
              expectedRevision: options.expectedRevision ?? current.revision,
              publishAt: options.publishAt,
              timeZone: options.timeZone,
              changeSummary: options.changeSummary,
            }),
            timestamps,
          );
        },
        unschedule: async (
          options?: CmsMutationOptions & LocalizationOptions<TOptions>,
        ): Promise<CmsDocument<TFields, TOptions>> => {
          await ensureRegistered();
          const current = await findSingletonEntry(
            service,
            context,
            contentType,
            getLocale(definition, options?.locale),
            "admin",
          );
          if (!current) throw new CmsNotFoundError("Singleton content entry");
          return flattenEntry<TFields, TOptions>(
            await service.unschedule({
              ...context,
              entryId: current.id,
              expectedRevision: options?.expectedRevision ?? current.revision,
              changeSummary: options?.changeSummary,
            }),
            timestamps,
          );
        },
      }
    : {};

  const localization = definition.localization
    ? {
        createTranslation: async (
          data: FieldsCreateInput<TFields>,
          options: {
            readonly locale: string;
            readonly changeSummary?: string;
          },
        ): Promise<CmsDocument<TFields, TOptions>> => {
          await ensureRegistered();
          const base = await findSingletonEntry(
            service,
            context,
            contentType,
            getLocale(definition),
            "admin",
          );
          if (!base) throw new CmsNotFoundError("Base singleton content entry");
          return flattenEntry<TFields, TOptions>(
            await service.createEntry({
              ...context,
              contentType,
              locale: options.locale,
              translationGroupId: base.translationGroupId,
              slug: SINGLETON_SLUG,
              fields: asCmsFields(data),
              changeSummary: options.changeSummary,
            }),
            timestamps,
          );
        },
        listLocaleVariants: async (
          input?: Omit<CmsCollectionFindInput<TFields, TOptions>, "locale">,
        ): Promise<CmsCollectionPage<CmsDocument<TFields, TOptions>>> => {
          await ensureRegistered();
          const base = await findSingletonEntry(
            service,
            context,
            contentType,
            getLocale(definition),
            input?.visibility ?? "admin",
          );
          const { page, limit } = entryPage(input);
          if (!base) {
            return {
              items: [],
              page,
              limit,
              nextCursor: null,
              hasNextPage: false,
            };
          }
          const result = await service.listEntryTranslations({
            ...context,
            contentType,
            translationGroupId: base.translationGroupId,
            visibility: input?.visibility ?? "admin",
            first: limit,
            where: normalizeWhere(input?.where),
            orderBy: entrySort(input?.sort),
            after: input?.after,
          });
          return {
            items: result.items.map((entry) =>
              flattenEntry<TFields, TOptions>(entry, timestamps),
            ),
            page,
            limit,
            nextCursor: result.nextCursor,
            hasNextPage: result.hasNextPage,
          };
        },
      }
    : {};

  return {
    find,
    create,
    update,
    delete: remove,
    purge,
    archive,
    ...lifecycle,
    ...scheduler,
    ...localization,
  } as CmsSingletonApi<TFields, TOptions, TScheduler>;
};

export const createCollectionService = (
  service: CmsService,
  context: CmsContext,
  contentType: string,
  definition: CollectionDefinition<FieldMap, CollectionKind>,
  schedulerEnabled: boolean,
  ensureRegistered: () => Promise<void>,
): unknown => {
  if (definition.kind === "singleton") {
    return createSingletonApi(
        service,
        context,
        contentType,
        definition as CollectionDefinition<FieldMap, "singleton">,
        definition.timestamps === true,
        schedulerEnabled,
        ensureRegistered,
      );
  }
  return createCollectionApi(
    service,
    context,
    contentType,
    definition as CollectionDefinition<FieldMap, "collection">,
    definition.timestamps === true,
    schedulerEnabled,
    ensureRegistered,
  );
};

export type { CmsEntryWhereNode };
