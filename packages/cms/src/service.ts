import {
  StorageAtomicityError,
  StorageConflictError,
  StorageDuplicateError,
  type StorageAdapter,
  type StorageBatchOperation,
  type StorageComparison,
  type StorageIndex,
  type StorageInsert,
  type StorageRecord,
  type StorageUpdate,
} from "@puzzle-ui/storage";
import {
  CmsAuditError,
  CmsCapabilityError,
  CmsConflictError,
  CmsDuplicateError,
  CmsNotFoundError,
  CmsPermissionDeniedError,
  CmsSchedulerError,
  CmsSchemaError,
  CmsValidationError,
  type CmsValidationIssue,
} from "./errors";
import {
  assertMigrationMatches,
  ContentTypeRegistry,
  getBreakingSchemaChanges,
  normalizeCmsSlug,
  normalizeLocale,
  validateContentFields,
  validateContentTypeDefinition,
  type CmsSchemaRegistryOptions,
} from "./schema";
import type {
  CmsAccessAction,
  CmsAccessPolicy,
  CmsAccessRequest,
  CmsActor,
  CmsAuditEvent,
  CmsChangeEvent,
  CmsChangeEventPage,
  CmsContentEntry,
  CmsContentRevision,
  CmsContentTypeRecord,
  CmsContext,
  CmsCreateEntryInput,
  CmsCustomFieldValidator,
  CmsEntryFilter,
  CmsEntryFilterOperator,
  CmsEntryMutationInput,
  CmsFindEntryInput,
  CmsEntryPage,
  CmsEntryQuery,
  CmsEntrySort,
  CmsEntryView,
  CmsFields,
  CmsFieldDefinition,
  CmsGetEntryInput,
  CmsMediaReferenceValidator,
  CmsMediaUsage,
  CmsRegisterContentTypeInput,
  CmsRestoreRevisionInput,
  CmsRevisionAction,
  CmsScheduleEntryInput,
  CmsScheduledPublication,
  CmsScheduler,
  CmsSchemaMigration,
  CmsUpdateEntryInput,
  CmsValue,
  CmsVisibility,
  ContentTypeDefinition,
} from "./types";

const COLLECTIONS = {
  contentTypes: "cms_content_types",
  entries: "cms_content_entries",
  revisions: "cms_content_revisions",
  audit: "cms_audit_events",
  changeEvents: "cms_change_events",
  mediaUsages: "cms_media_usages",
} as const;

const unpublishedSlugKey = (entryId: string): string =>
  `~cms-unpublished:${entryId}`;

type CmsStoredRecord =
  | CmsContentTypeRecord
  | CmsContentEntry
  | CmsContentRevision
  | CmsAuditEvent
  | CmsChangeEvent
  | CmsMediaUsage;

export type CmsServiceOptions = {
  readonly storage: StorageAdapter;
  readonly accessPolicy: CmsAccessPolicy;
  readonly scheduler?: CmsScheduler;
  readonly mediaReferenceValidator?: CmsMediaReferenceValidator;
  readonly customValidators?: Readonly<Record<string, CmsCustomFieldValidator>>;
  readonly migrations?: readonly CmsSchemaMigration[];
  readonly clock?: () => Date;
  readonly idGenerator?: () => string;
  readonly emitChangeEvents?: boolean;
};

export type CmsListRevisionsInput = CmsContext & {
  readonly entryId: string;
  readonly first?: number;
};

export type CmsListContentTypesInput = CmsContext & {
  readonly first?: number;
};

export type CmsListAuditEventsInput = CmsContext & {
  readonly resourceId?: string;
  readonly first?: number;
};

export type CmsListChangeEventsInput = CmsContext & {
  readonly first?: number;
  readonly after?: string;
};

export type CmsListMediaUsagesInput = CmsContext & {
  readonly assetId: string;
  readonly first?: number;
};

export type CmsScheduledPublicationResult =
  | { readonly published: true; readonly entry: CmsEntryView }
  | { readonly published: false; readonly reason: "stale" | "not-due" };

type EntryCandidate = Omit<CmsContentEntry, "createdAt" | "updatedAt" | "revision"> & {
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
};

const equality = <T>(value: T): StorageComparison<T> => ({
  operator: "eq",
  value,
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const sameValue = (left: unknown, right: unknown): boolean =>
  JSON.stringify(left) === JSON.stringify(right);

const addIndexes = <T extends StorageRecord>(
  name: string,
  indexes: readonly StorageIndex<T>[],
) => ({ name, indexes });

const serializeLocale = (locale: string): string => {
  const normalized = normalizeLocale(locale);
  if (!normalized) {
    throw new CmsValidationError([
      { path: "locale", code: "invalid-locale", message: `Invalid locale "${locale}".` },
    ]);
  }
  return normalized;
};

const validateVisibility = (visibility: unknown): CmsVisibility => {
  if (visibility === "admin" || visibility === "public") return visibility;
  throw new CmsValidationError([
    { path: "visibility", code: "required", message: 'Choose "admin" or "public" visibility explicitly.' },
  ]);
};

const isPublicEntry = (entry: CmsContentEntry): boolean =>
  entry.status !== "archived" &&
  entry.deletedAt === null &&
  entry.publishedSnapshot !== null &&
  entry.publicSlug !== null;

const valueAtPath = (entry: CmsContentEntry | CmsEntryView, path: string): unknown => {
  const normalizedPath = path.startsWith("fields.")
    ? path.slice("fields.".length)
    : path;
  const firstSeparator = normalizedPath.indexOf(".");
  const root = firstSeparator < 0
    ? normalizedPath
    : normalizedPath.slice(0, firstSeparator);
  let value: unknown = Object.prototype.hasOwnProperty.call(entry.fields, root)
    ? entry.fields[root]
    : (entry as unknown as Record<string, unknown>)[root];
  const remaining = firstSeparator < 0 ? [] : normalizedPath.slice(firstSeparator + 1).split(".");
  for (const part of remaining) {
    if (!isRecord(value)) return undefined;
    value = value[part];
  }
  return value;
};

const compareValues = (left: unknown, right: unknown): number => {
  if (left instanceof Date) left = left.getTime();
  else if (
    typeof left === "string" &&
    /^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(left) &&
    Number.isFinite(Date.parse(left))
  ) {
    left = Date.parse(left);
  }
  if (right instanceof Date) right = right.getTime();
  else if (
    typeof right === "string" &&
    /^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(right) &&
    Number.isFinite(Date.parse(right))
  ) {
    right = Date.parse(right);
  }
  if (left === right) return 0;
  if (left === undefined || left === null) return -1;
  if (right === undefined || right === null) return 1;
  if (typeof left === "number" && typeof right === "number") {
    return left < right ? -1 : 1;
  }
  const leftString = typeof left === "string" ? left : JSON.stringify(left);
  const rightString = typeof right === "string" ? right : JSON.stringify(right);
  return leftString < rightString ? -1 : leftString > rightString ? 1 : 0;
};

const matchesFilter = (entry: CmsEntryView, filter: CmsEntryFilter): boolean => {
  const value = valueAtPath(entry, filter.field);
  const values = Array.isArray(filter.value) ? filter.value : [filter.value];
  switch (filter.operator) {
    case "exists":
      return (value !== undefined && value !== null) === Boolean(filter.value);
    case "eq":
      return sameValue(value, filter.value);
    case "ne":
      return !sameValue(value, filter.value);
    case "in":
      return values.some((candidate) => sameValue(value, candidate));
    case "notIn":
      return values.every((candidate) => !sameValue(value, candidate));
    case "gt":
      return compareValues(value, filter.value) > 0;
    case "gte":
      return compareValues(value, filter.value) >= 0;
    case "lt":
      return compareValues(value, filter.value) < 0;
    case "lte":
      return compareValues(value, filter.value) <= 0;
  }
};

const validateFilters = (filters: readonly CmsEntryFilter[] | undefined): void => {
  const issues: CmsValidationIssue[] = [];
  filters?.forEach((filter, index) => {
    if (!filter.field.trim()) {
      issues.push({ path: `filters[${index}].field`, code: "required", message: "Filter field is required." });
    }
    if (![
      "eq", "ne", "in", "notIn", "gt", "gte", "lt", "lte", "exists",
    ].includes(filter.operator)) {
      issues.push({ path: `filters[${index}].operator`, code: "operator", message: "Unsupported filter operator." });
    }
    if (
      (filter.operator === "in" || filter.operator === "notIn") &&
      !Array.isArray(filter.value)
    ) {
      issues.push({ path: `filters[${index}].value`, code: "type", message: "This filter requires an array." });
    }
  });
  if (issues.length) throw new CmsValidationError(issues);
};

const collectStrings = (value: unknown, output: string[]): void => {
  if (typeof value === "string") {
    output.push(value);
  } else if (Array.isArray(value)) {
    value.forEach((item) => collectStrings(item, output));
  } else if (isRecord(value)) {
    Object.values(value).forEach((item) => collectStrings(item, output));
  }
};

const compareEntries = (
  left: CmsEntryView,
  right: CmsEntryView,
  orderBy: readonly CmsEntrySort[],
): number => {
  for (const order of orderBy) {
    const compared = compareValues(
      valueAtPath(left, order.field),
      valueAtPath(right, order.field),
    );
    if (compared) return order.direction === "asc" ? compared : -compared;
  }
  return left.id.localeCompare(right.id);
};

const getCursorScope = (query: CmsEntryQuery, typeId: string): string =>
  JSON.stringify({
    tenantId: query.tenantId,
    typeId,
    locale: query.locale ? serializeLocale(query.locale) : null,
    visibility: query.visibility,
    search: query.search?.trim().toLocaleLowerCase() ?? "",
    filters: query.filters ?? [],
    orderBy: query.orderBy ?? [{ field: "updatedAt", direction: "desc" }],
  });

const createCursor = (
  entry: CmsEntryView,
  orderBy: readonly CmsEntrySort[],
  scope: string,
): string =>
  encodeURIComponent(JSON.stringify({
    scope,
    values: orderBy.map((sort) => valueAtPath(entry, sort.field)),
    id: entry.id,
  }));

const decodeCursor = (
  value: string,
  scope: string,
): { readonly values: readonly unknown[]; readonly id: string } => {
  try {
    const cursor: unknown = JSON.parse(decodeURIComponent(value));
    if (
      !isRecord(cursor) ||
      cursor.scope !== scope ||
      !Array.isArray(cursor.values) ||
      typeof cursor.id !== "string"
    ) {
      throw new Error("Invalid cursor");
    }
    return { values: cursor.values, id: cursor.id };
  } catch {
    throw new CmsValidationError([
      { path: "after", code: "cursor", message: "Cursor is invalid or belongs to a different query." },
    ]);
  }
};

const fieldPaths = (
  definitions: readonly CmsFieldDefinition[],
  fields: CmsFields,
  prefix = "",
): readonly string[] => {
  const paths: string[] = [];
  for (const definition of definitions) {
    if (!Object.prototype.hasOwnProperty.call(fields, definition.key)) continue;
    const path = prefix ? `${prefix}.${definition.key}` : definition.key;
    paths.push(path);
    const value = fields[definition.key];
    if (definition.type === "repeater" && Array.isArray(value)) {
      value.forEach((item, index) => {
        if (isRecord(item)) {
          paths.push(...fieldPaths(
            definition.fields ?? [],
            item as CmsFields,
            `${path}[${index}]`,
          ));
        }
      });
    } else if (definition.type === "blocks" && Array.isArray(value)) {
      value.forEach((item, index) => {
        if (!isRecord(item) || !isRecord(item.fields)) return;
        const block = definition.blocks?.find((candidate) => candidate.type === item.type);
        if (block) {
          paths.push(...fieldPaths(
            block.fields,
            item.fields as CmsFields,
            `${path}[${index}].fields`,
          ));
        }
      });
    }
  }
  return paths;
};

export class CmsService {
  readonly #storage: StorageAdapter;
  readonly #accessPolicy: CmsAccessPolicy;
  readonly #scheduler?: CmsScheduler;
  readonly #mediaValidator?: CmsMediaReferenceValidator;
  readonly #customValidators: Readonly<Record<string, CmsCustomFieldValidator>>;
  readonly #clock: () => Date;
  readonly #idGenerator: () => string;
  readonly #registry: ContentTypeRegistry;
  readonly #emitChangeEvents: boolean;
  readonly #migrations = new Map<string, CmsSchemaMigration>();
  #collectionsReady?: Promise<void>;
  #changeEventsReady?: Promise<void>;

  constructor(options: CmsServiceOptions) {
    if (!options?.storage || typeof options.accessPolicy !== "function") {
      throw new TypeError("CmsService requires storage and an explicit accessPolicy callback.");
    }
    this.#storage = options.storage;
    this.#accessPolicy = options.accessPolicy;
    this.#scheduler = options.scheduler;
    this.#emitChangeEvents = options.emitChangeEvents === true;
    this.#mediaValidator = options.mediaReferenceValidator;
    this.#customValidators = options.customValidators ?? {};
    this.#clock = options.clock ?? (() => new Date());
    this.#idGenerator =
      options.idGenerator ??
      (() => {
        if (!globalThis.crypto?.randomUUID) {
          throw new CmsCapabilityError("crypto.randomUUID or idGenerator");
        }
        return globalThis.crypto.randomUUID();
      });
    this.#registry = new ContentTypeRegistry({
      customValidators: this.#customValidators,
    });
    for (const migration of options.migrations ?? []) {
      this.#addMigration(migration);
    }
  }

  async registerContentType(
    input: CmsRegisterContentTypeInput,
  ): Promise<CmsContentTypeRecord> {
    await this.#ensureCollections();
    this.#assertTenant(input.tenantId);
    const definition = this.#normalizeDefinition(input.definition);
    validateContentTypeDefinition(definition, this.#schemaOptions());
    const existing = await this.#findContentType(input.tenantId, definition.slug);

    await this.#authorize({
      tenantId: input.tenantId,
      actor: input.actor,
      resource: "contentType",
      action: "content-type:register",
      resourceId: existing?.id,
      record: existing ?? definition,
    });
    this.#requireCapabilities("atomicBatch", "uniqueConstraints");

    if (existing) {
      this.#requireCapabilities("conditionalWrites");
      const previousDefinition = this.#definition(existing);
      if (definition.version === existing.version) {
        if (sameValue(previousDefinition, definition)) return existing;
        throw new CmsSchemaError("A content type cannot change without increasing its schema version.");
      }
      if (definition.version !== existing.version + 1) {
        throw new CmsSchemaError("Content type schema versions must increase by exactly one.");
      }
      if (input.expectedRevision !== existing.revision) {
        throw new CmsConflictError("An expected content type storage revision is required.");
      }

      const breakingChanges = getBreakingSchemaChanges(previousDefinition, definition);
      const requiredMigration = breakingChanges.length > 0;
      const configuredMigration = this.#getMigration(
        input.tenantId,
        definition.slug,
        existing.version,
      );
      const migration = input.migration ?? configuredMigration;
      if (requiredMigration) {
        if (!migration) {
          throw new CmsSchemaError(
            "This schema change is not backward compatible and requires an explicit migration.",
            { breakingChanges },
          );
        }
      }
      if (migration) {
        assertMigrationMatches(migration, definition, existing.version);
      }
      if (migration?.tenantId && migration.tenantId !== input.tenantId) {
        throw new CmsSchemaError("The schema migration is scoped to a different tenant.");
      }
      if (
        input.migration &&
        configuredMigration &&
        input.migration.migrate !== configuredMigration.migrate
      ) {
        throw new CmsSchemaError("A different migration is already registered for this schema version.");
      }

      const requiredVersions = requiredMigration
        ? [...existing.requiresMigrationFromVersions, existing.version]
        : existing.requiresMigrationFromVersions;
      const updated = {
        ...existing,
        name: definition.name,
        description: definition.description,
        version: definition.version,
        fields: definition.fields,
        locales: definition.locales ?? [],
        defaultLocale: definition.defaultLocale,
        requiresMigrationFromVersions: requiredVersions,
        updatedAt: this.#now(),
      };
      const audit = this.#auditInsert({
        tenantId: input.tenantId,
        actor: input.actor,
        resource: "contentType",
        resourceId: existing.id,
        action: "content-type:update",
        result: "success",
      });
      this.#requireChangeEventCapabilities();
      if (this.#emitChangeEvents) await this.#ensureChangeEvents();
      await this.#runBatch([
        {
          type: "update",
          collection: COLLECTIONS.contentTypes,
          id: existing.id,
          condition: { expectedRevision: existing.revision },
          changes: this.#updateChanges(updated),
        },
        { type: "insert", collection: COLLECTIONS.audit, record: audit },
        ...this.#changeEventOperations(audit),
      ]);
      if (input.migration && !configuredMigration) this.#addMigration(input.migration);
      this.#registry.register(input.tenantId, definition);
      const saved = await this.#findContentType(input.tenantId, definition.slug);
      if (!saved) throw new CmsNotFoundError("Content type");
      return saved;
    }

    if (input.expectedRevision !== undefined) {
      throw new CmsConflictError("The content type does not exist at the expected revision.");
    }
    if (input.migration) {
      throw new CmsSchemaError("A migration can only be provided when upgrading an existing content type.");
    }
    const now = this.#now();
    const record = {
      id: this.#idGenerator(),
      tenantId: input.tenantId,
      slug: definition.slug,
      name: definition.name,
      description: definition.description,
      version: definition.version,
      fields: definition.fields,
      locales: definition.locales ?? [],
      defaultLocale: definition.defaultLocale,
      requiresMigrationFromVersions: [],
      createdAt: now,
      updatedAt: now,
      revision: 1,
    } satisfies CmsContentTypeRecord;
    const audit = this.#auditInsert({
      tenantId: input.tenantId,
      actor: input.actor,
      resource: "contentType",
      resourceId: record.id,
      action: "content-type:create",
      result: "success",
    });
    this.#requireChangeEventCapabilities();
    if (this.#emitChangeEvents) await this.#ensureChangeEvents();
    await this.#runBatch([
      {
        type: "insert",
        collection: COLLECTIONS.contentTypes,
        record: record as StorageInsert<CmsContentTypeRecord>,
      },
      { type: "insert", collection: COLLECTIONS.audit, record: audit },
      ...this.#changeEventOperations(audit),
    ]);
    this.#registry.register(input.tenantId, definition);
    return record;
  }

  async getContentType(
    input: CmsContext & { readonly slug: string },
  ): Promise<CmsContentTypeRecord> {
    await this.#ensureCollections();
    this.#assertTenant(input.tenantId);
    const record = await this.#findContentType(input.tenantId, normalizeCmsSlug(input.slug));
    if (!record) throw new CmsNotFoundError("Content type");
    await this.#authorize({
      tenantId: input.tenantId,
      actor: input.actor,
      resource: "contentType",
      action: "content-type:read",
      resourceId: record.id,
      record,
    });
    this.#cacheDefinition(input.tenantId, record);
    return record;
  }

  async listContentTypes(
    input: CmsListContentTypesInput,
  ): Promise<readonly CmsContentTypeRecord[]> {
    await this.#ensureCollections();
    this.#assertTenant(input.tenantId);
    await this.#authorize({
      tenantId: input.tenantId,
      actor: input.actor,
      resource: "contentType",
      action: "content-type:read",
    });
    const first = input.first ?? 100;
    if (!Number.isInteger(first) || first < 1 || first > 500) {
      throw new CmsValidationError([
        { path: "first", code: "range", message: "Content type page size must be from 1 to 500." },
      ]);
    }
    const records = await this.#storage.findMany<CmsContentTypeRecord>(
      COLLECTIONS.contentTypes,
      {
        where: { tenantId: equality(input.tenantId) },
        orderBy: [{ field: "slug", direction: "asc" }],
        limit: first,
      },
    );
    const output: CmsContentTypeRecord[] = [];
    for (const record of records) {
      if (
        await this.#isAllowed({
          tenantId: input.tenantId,
          actor: input.actor,
          resource: "contentType",
          action: "content-type:read",
          resourceId: record.id,
          record,
        })
      ) {
        this.#cacheDefinition(input.tenantId, record);
        output.push(record);
      }
    }
    return output;
  }

  async createEntry(input: CmsCreateEntryInput): Promise<CmsEntryView> {
    await this.#ensureCollections();
    this.#assertTenant(input.tenantId);
    const type = await this.#getType(input.tenantId, input.contentType);
    const locale = this.#validateLocale(type, input.locale);
    await this.#authorize({
      tenantId: input.tenantId,
      actor: input.actor,
      resource: "entry",
      action: "entry:create",
      record: { contentType: type.slug, locale },
    });

    await this.#assertWritableFields(
      input.tenantId,
      input.actor,
      type,
      isRecord(input.fields) ? input.fields as CmsFields : {},
    );
    const fieldsInput = this.#withSlugField(type, input.fields, input.slug);
    const fields = await this.#validateFields(
      type,
      fieldsInput,
      input.tenantId,
      locale,
      input.actor,
    );
    const slug = this.#resolveSlug(input.slug, type, fields);
    await this.#assertWritableFields(input.tenantId, input.actor, type, fields);
    await this.#validateReferences(input.tenantId, input.actor, type, locale, fields);

    const translationGroupId = input.translationGroupId ?? this.#idGenerator();
    if (input.translationGroupId) {
      const siblings = await this.#storage.findMany<CmsContentEntry>(
        COLLECTIONS.entries,
        {
          where: {
            tenantId: equality(input.tenantId),
            contentTypeId: equality(type.id),
            translationGroupId: equality(translationGroupId),
          },
        },
      );
      if (!siblings.length) throw new CmsNotFoundError("Translation group");
      if (siblings.some((entry) => entry.locale === locale)) {
        throw new CmsDuplicateError("A translation in this locale");
      }
      await this.#assertSharedFields(input.tenantId, type, fields, siblings);
    }
    await this.#assertUniqueSlug(input.tenantId, type, locale, slug);

    const entryId = this.#idGenerator();
    const entry = await this.#persistEntry(
      null,
      {
        id: entryId,
        tenantId: input.tenantId,
        contentTypeId: type.id,
        contentTypeSlug: type.slug,
        translationGroupId,
        locale,
        slug,
        publicSlug: null,
        publicSlugKey: unpublishedSlugKey(entryId),
        fields,
        schemaVersion: type.version,
        revisionNumber: 1,
        status: "draft",
        publishedSnapshot: null,
        scheduledAt: null,
        scheduledTimeZone: null,
        scheduledRevisionNumber: null,
        archivedAt: null,
        deletedAt: null,
        createdBy: input.actor?.id ?? null,
        updatedBy: input.actor?.id ?? null,
      },
      input.actor,
      "create",
      input.changeSummary,
    );
    return this.#makeView(entry, type, "admin", input.actor);
  }

  async saveDraft(input: CmsUpdateEntryInput): Promise<CmsEntryView> {
    await this.#ensureCollections();
    const current = await this.#getEntryRecord(input);
    this.#assertExpectedRevision(current, input.expectedRevision);
    if (current.status === "archived" || current.deletedAt) {
      throw new CmsConflictError("Archived or deleted entries must be restored before editing.");
    }
    await this.#authorizeEntry(input, current, "entry:update");
    const type = await this.#getTypeById(input.tenantId, current.contentTypeId);
    await this.#assertWritableFields(
      input.tenantId,
      input.actor,
      type,
      isRecord(input.fields) ? input.fields as CmsFields : {},
      current,
    );
    const fieldsInput = this.#withSlugField(type, input.fields, input.slug);
    const fields = await this.#validateFields(
      type,
      fieldsInput,
      input.tenantId,
      current.locale,
      input.actor,
      current.id,
    );
    const slug = this.#resolveSlug(input.slug, type, fields);
    await this.#assertWritableFields(input.tenantId, input.actor, type, fields, current);
    await this.#assertSharedFieldUpdate(type, fields, current);
    await this.#validateReferences(
      input.tenantId,
      input.actor,
      type,
      current.locale,
      fields,
      current.id,
    );
    await this.#assertUniqueSlug(
      input.tenantId,
      type,
      current.locale,
      slug,
      current.id,
    );
    const scheduled = this.#scheduledTask(current);
    const updated = await this.#persistEntry(
      current,
      {
        ...current,
        ...this.#revisionFields(current, type, fields, slug),
        status: "draft",
        scheduledAt: null,
        scheduledTimeZone: null,
        scheduledRevisionNumber: null,
        archivedAt: null,
        deletedAt: null,
        updatedBy: input.actor?.id ?? null,
      },
      input.actor,
      "save-draft",
      input.changeSummary,
    );
    if (scheduled) await this.#cancelScheduled(scheduled);
    return this.#makeView(updated, type, "admin", input.actor);
  }

  async publish(input: CmsContext & CmsEntryMutationInput): Promise<CmsEntryView> {
    await this.#ensureCollections();
    const current = await this.#getEntryRecord(input);
    this.#assertExpectedRevision(current, input.expectedRevision);
    if (current.status === "archived" || current.deletedAt) {
      throw new CmsConflictError("Archived or deleted entries cannot be published.");
    }
    await this.#authorizeEntry(input, current, "entry:publish");
    const type = await this.#getTypeById(input.tenantId, current.contentTypeId);
    const fields = await this.#currentFields(current, type, input);
    await this.#validateReferences(input.tenantId, input.actor, type, current.locale, fields, current.id);
    await this.#assertUniqueSlug(input.tenantId, type, current.locale, current.slug, current.id);
    const scheduled = this.#scheduledTask(current);
    const now = this.#now();
    const publishedSnapshot = {
      revisionNumber: current.revisionNumber + 1,
      entryRevision: current.revision + 1,
      schemaVersion: type.version,
      slug: current.slug,
      locale: current.locale,
      fields,
      publishedAt: now,
      publishedBy: input.actor?.id ?? null,
    };
    const updated = await this.#persistEntry(
      current,
      {
        ...current,
        ...this.#revisionFields(current, type, fields, current.slug),
        publicSlug: current.slug,
        publicSlugKey: current.slug,
        status: "published",
        publishedSnapshot,
        scheduledAt: null,
        scheduledTimeZone: null,
        scheduledRevisionNumber: null,
        archivedAt: null,
        deletedAt: null,
        updatedBy: input.actor?.id ?? null,
      },
      input.actor,
      "publish",
      input.changeSummary,
    );
    if (scheduled) await this.#cancelScheduled(scheduled);
    return this.#makeView(updated, type, "admin", input.actor);
  }

  async unpublish(input: CmsContext & CmsEntryMutationInput): Promise<CmsEntryView> {
    await this.#ensureCollections();
    const current = await this.#getEntryRecord(input);
    this.#assertExpectedRevision(current, input.expectedRevision);
    await this.#authorizeEntry(input, current, "entry:unpublish");
    if (!current.publishedSnapshot && current.status !== "scheduled") {
      throw new CmsConflictError("The entry has no published version to unpublish.");
    }
    const type = await this.#getTypeById(input.tenantId, current.contentTypeId);
    const fields = await this.#currentFields(current, type, input);
    const scheduled = this.#scheduledTask(current);
    const updated = await this.#persistEntry(
      current,
      {
        ...current,
        ...this.#revisionFields(current, type, fields, current.slug),
        status: "draft",
        publicSlug: null,
        publicSlugKey: unpublishedSlugKey(current.id),
        publishedSnapshot: null,
        scheduledAt: null,
        scheduledTimeZone: null,
        scheduledRevisionNumber: null,
        updatedBy: input.actor?.id ?? null,
      },
      input.actor,
      "unpublish",
      input.changeSummary,
    );
    if (scheduled) await this.#cancelScheduled(scheduled);
    return this.#makeView(updated, type, "admin", input.actor);
  }

  async schedulePublish(input: CmsScheduleEntryInput): Promise<CmsEntryView> {
    await this.#ensureCollections();
    const scheduler = this.#requireScheduler();
    this.#requireCapabilities(
      "atomicBatch",
      "conditionalWrites",
      "uniqueConstraints",
    );
    const current = await this.#getEntryRecord(input);
    this.#assertExpectedRevision(current, input.expectedRevision);
    if (current.status === "archived" || current.deletedAt) {
      throw new CmsConflictError("Archived or deleted entries cannot be scheduled.");
    }
    await this.#authorizeEntry(input, current, "entry:schedule");
    const publishAt = new Date(input.publishAt);
    if (!Number.isFinite(publishAt.getTime()) || publishAt <= this.#now()) {
      throw new CmsValidationError([
        { path: "publishAt", code: "future", message: "Scheduled publication time must be in the future." },
      ]);
    }
    if (typeof input.timeZone !== "string" || !input.timeZone.trim()) {
      throw new CmsValidationError([
        { path: "timeZone", code: "required", message: "An explicit IANA time zone is required." },
      ]);
    }
    let timeZone: string;
    try {
      timeZone = new Intl.DateTimeFormat("en-US", {
        timeZone: input.timeZone.trim(),
      }).resolvedOptions().timeZone;
    } catch {
      throw new CmsValidationError([
        { path: "timeZone", code: "invalid-time-zone", message: "The time zone must be a supported IANA identifier." },
      ]);
    }
    const type = await this.#getTypeById(input.tenantId, current.contentTypeId);
    const fields = await this.#currentFields(current, type, input);
    await this.#validateReferences(input.tenantId, input.actor, type, current.locale, fields, current.id);
    await this.#assertUniqueSlug(input.tenantId, type, current.locale, current.slug, current.id);

    const scheduledRevisionNumber = current.revisionNumber + 1;
    const publication: CmsScheduledPublication = {
      id: `${current.id}:${scheduledRevisionNumber}`,
      tenantId: input.tenantId,
      entryId: current.id,
      scheduledRevisionNumber,
      publishAt,
      timeZone,
    };
    try {
      await scheduler.schedule(publication);
    } catch (error) {
      throw new CmsSchedulerError(
        "The scheduler could not register this publication; the entry was not changed.",
        { entryId: current.id, scheduledRevisionNumber },
        { cause: error },
      );
    }

    let updated: CmsContentEntry;
    try {
      updated = await this.#persistEntry(
        current,
        {
          ...current,
          ...this.#revisionFields(current, type, fields, current.slug),
          status: "scheduled",
          scheduledAt: publishAt,
          scheduledTimeZone: timeZone,
          scheduledRevisionNumber,
          updatedBy: input.actor?.id ?? null,
        },
        input.actor,
        "schedule",
        input.changeSummary,
      );
    } catch (error) {
      try {
        await scheduler.cancel(publication);
      } catch (cancelError) {
        throw new CmsSchedulerError(
          "The entry could not be scheduled and the scheduler could not cancel the orphaned job.",
          { entryId: current.id, scheduledRevisionNumber },
          { cause: cancelError },
        );
      }
      throw error;
    }
    const previousTask = this.#scheduledTask(current);
    if (previousTask) await this.#cancelScheduled(previousTask);
    return this.#makeView(updated, type, "admin", input.actor);
  }

  async unschedule(input: CmsContext & CmsEntryMutationInput): Promise<CmsEntryView> {
    await this.#ensureCollections();
    this.#requireScheduler();
    const current = await this.#getEntryRecord(input);
    this.#assertExpectedRevision(current, input.expectedRevision);
    if (current.status !== "scheduled" || !current.scheduledAt) {
      throw new CmsConflictError("The entry does not have a scheduled publication.");
    }
    await this.#authorizeEntry(input, current, "entry:unschedule");
    const type = await this.#getTypeById(input.tenantId, current.contentTypeId);
    const fields = await this.#currentFields(current, type, input);
    const scheduled = this.#scheduledTask(current);
    const updated = await this.#persistEntry(
      current,
      {
        ...current,
        ...this.#revisionFields(current, type, fields, current.slug),
        status: "draft",
        scheduledAt: null,
        scheduledTimeZone: null,
        scheduledRevisionNumber: null,
        updatedBy: input.actor?.id ?? null,
      },
      input.actor,
      "unschedule",
      input.changeSummary,
    );
    if (scheduled) await this.#cancelScheduled(scheduled);
    return this.#makeView(updated, type, "admin", input.actor);
  }

  async publishScheduled(
    input: CmsContext & { readonly publication: CmsScheduledPublication },
  ): Promise<CmsScheduledPublicationResult> {
    await this.#ensureCollections();
    this.#assertTenant(input.tenantId);
    this.#assertActor(input.actor);
    if (input.tenantId !== input.publication.tenantId) {
      throw new CmsNotFoundError("Scheduled publication");
    }
    const current = await this.#storage.findById<CmsContentEntry>(
      COLLECTIONS.entries,
      input.publication.entryId,
    );
    if (
      !current ||
      current.tenantId !== input.tenantId ||
      current.status !== "scheduled" ||
      current.scheduledRevisionNumber !== input.publication.scheduledRevisionNumber ||
      current.scheduledTimeZone !== input.publication.timeZone ||
      current.scheduledAt?.getTime() !== input.publication.publishAt.getTime()
    ) {
      return { published: false, reason: "stale" };
    }
    if (current.scheduledAt > this.#now()) {
      return { published: false, reason: "not-due" };
    }
    this.#assertExpectedRevision(current, current.revision);
    await this.#authorizeEntry(input, current, "entry:publish");
    const type = await this.#getTypeById(input.tenantId, current.contentTypeId);
    const fields = await this.#currentFields(current, type, input);
    await this.#validateReferences(input.tenantId, input.actor, type, current.locale, fields, current.id);
    const now = this.#now();
    const publishedSnapshot = {
      revisionNumber: current.revisionNumber + 1,
      entryRevision: current.revision + 1,
      schemaVersion: type.version,
      slug: current.slug,
      locale: current.locale,
      fields,
      publishedAt: now,
      publishedBy: input.actor?.id ?? null,
    };
    const updated = await this.#persistEntry(
      current,
      {
        ...current,
        ...this.#revisionFields(current, type, fields, current.slug),
        publicSlug: current.slug,
        publicSlugKey: current.slug,
        status: "published",
        publishedSnapshot,
        updatedBy: input.actor?.id ?? null,
        scheduledAt: null,
        scheduledTimeZone: null,
        scheduledRevisionNumber: null,
      },
      input.actor,
      "scheduled-publish",
      "Scheduled publication",
    );
    return {
      published: true,
      entry: await this.#makeView(updated, type, "admin", input.actor),
    };
  }

  async archive(input: CmsContext & CmsEntryMutationInput): Promise<CmsEntryView> {
    return this.#archiveEntry(input, false);
  }

  async deleteEntry(input: CmsContext & CmsEntryMutationInput): Promise<CmsEntryView> {
    return this.#archiveEntry(input, true);
  }

  async restoreRevision(input: CmsRestoreRevisionInput): Promise<CmsEntryView> {
    await this.#ensureCollections();
    const current = await this.#getEntryRecord(input);
    this.#assertExpectedRevision(current, input.expectedRevision);
    const revision = await this.#storage.findById<CmsContentRevision>(
      COLLECTIONS.revisions,
      input.revisionId,
    );
    if (!revision || revision.tenantId !== input.tenantId || revision.entryId !== current.id) {
      throw new CmsNotFoundError("Content revision");
    }
    await this.#authorize({
      tenantId: input.tenantId,
      actor: input.actor,
      resource: "revision",
      action: "revision:read",
      resourceId: revision.id,
      record: revision,
    });
    await this.#authorizeEntry(input, current, "entry:restore");
    const type = await this.#getTypeById(input.tenantId, current.contentTypeId);
    const migratedFields = await this.#migrateFields(
      type,
      revision.fields,
      revision.schemaVersion,
      input.tenantId,
    );
    const fields = await this.#validateFields(
      type,
      migratedFields,
      input.tenantId,
      current.locale,
      input.actor,
      current.id,
    );
    const slug = this.#resolveSlug(revision.slug, type, fields);
    await this.#assertWritableFields(input.tenantId, input.actor, type, fields, current);
    await this.#validateReferences(input.tenantId, input.actor, type, current.locale, fields, current.id);
    await this.#assertUniqueSlug(input.tenantId, type, current.locale, slug, current.id);
    const scheduled = this.#scheduledTask(current);
    const updated = await this.#persistEntry(
      current,
      {
        ...current,
        ...this.#revisionFields(current, type, fields, slug),
        status: "draft",
        scheduledAt: null,
        scheduledTimeZone: null,
        scheduledRevisionNumber: null,
        archivedAt: null,
        deletedAt: null,
        updatedBy: input.actor?.id ?? null,
      },
      input.actor,
      "restore",
      input.changeSummary ?? `Restored from revision ${revision.revisionNumber}`,
    );
    if (scheduled) await this.#cancelScheduled(scheduled);
    return this.#makeView(updated, type, "admin", input.actor);
  }

  async getEntry(input: CmsGetEntryInput): Promise<CmsEntryView> {
    await this.#ensureCollections();
    const visibility = validateVisibility(input.visibility);
    const entry = await this.#getEntryRecord(input);
    await this.#authorizeEntry(input, entry, "entry:read", visibility);
    const type = await this.#getTypeById(input.tenantId, entry.contentTypeId);
    if (entry.deletedAt) throw new CmsNotFoundError("Content entry");
    return this.#makeView(entry, type, visibility, input.actor);
  }

  async findEntry(input: CmsFindEntryInput): Promise<CmsEntryView> {
    await this.#ensureCollections();
    this.#assertTenant(input.tenantId);
    const type = await this.#getType(input.tenantId, input.contentType);
    const primaryLocale = this.#validateLocale(type, input.locale);
    const fallbacks = (input.fallbackLocales ?? []).map((locale) =>
      this.#validateLocale(type, locale),
    );
    const locales = [...new Set([primaryLocale, ...fallbacks])];
    const slug = normalizeCmsSlug(input.slug);
    const visibility = validateVisibility(input.visibility);
    await this.#authorize({
      tenantId: input.tenantId,
      actor: input.actor,
      resource: "entry",
      action: "entry:read",
      visibility,
      record: { contentType: type.slug, locale: primaryLocale, slug },
    });

    for (const locale of locales) {
      const entries = await this.#storage.findMany<CmsContentEntry>(
        COLLECTIONS.entries,
        {
          where: {
            tenantId: equality(input.tenantId),
            contentTypeId: equality(type.id),
            locale: equality(locale),
          },
        },
      );
      const match = entries.find((entry) =>
        visibility === "public"
          ? isPublicEntry(entry) && entry.publicSlug === slug
          : !entry.deletedAt && entry.slug === slug,
      );
      if (!match) continue;
      if (!(await this.#isAllowed({
        tenantId: input.tenantId,
        actor: input.actor,
        resource: "entry",
        action: "entry:read",
        visibility,
        resourceId: match.id,
        record: match,
      }))) {
        continue;
      }
      return this.#makeView(match, type, visibility, input.actor);
    }
    throw new CmsNotFoundError("Content entry");
  }

  async listEntries(input: CmsEntryQuery): Promise<CmsEntryPage> {
    await this.#ensureCollections();
    this.#assertTenant(input.tenantId);
    if (!Number.isInteger(input.first) || input.first < 1 || input.first > 100) {
      throw new CmsValidationError([
        { path: "first", code: "range", message: "Page size must be an integer from 1 to 100." },
      ]);
    }
    validateFilters(input.filters);
    const type = await this.#getType(input.tenantId, input.contentType);
    const locale = input.locale ? this.#validateLocale(type, input.locale) : undefined;
    const visibility = validateVisibility(input.visibility);
    await this.#authorize({
      tenantId: input.tenantId,
      actor: input.actor,
      resource: "entry",
      action: "entry:read",
      visibility,
      record: { contentType: type.slug, locale },
    });

    const where: Record<string, StorageComparison> = {
      tenantId: equality(input.tenantId),
      contentTypeId: equality(type.id),
    };
    if (locale) where.locale = equality(locale);
    const entries = await this.#storage.findMany<CmsContentEntry>(
      COLLECTIONS.entries,
      { where },
    );
    const views: CmsEntryView[] = [];
    for (const entry of entries) {
      if (visibility === "public" && !isPublicEntry(entry)) continue;
      if (visibility === "admin" && entry.deletedAt) continue;
      if (
        !(await this.#isAllowed({
          tenantId: input.tenantId,
          actor: input.actor,
          resource: "entry",
          action: "entry:read",
          visibility,
          resourceId: entry.id,
          record: entry,
        }))
      ) {
        continue;
      }
      views.push(await this.#makeView(entry, type, visibility, input.actor));
    }

    const search = input.search?.trim().toLocaleLowerCase();
    let filtered = views.filter((entry) => {
      if (input.filters?.some((filter) => !matchesFilter(entry, filter))) return false;
      if (!search) return true;
      const strings: string[] = [];
      collectStrings(entry.fields, strings);
      strings.push(entry.slug, entry.locale);
      return strings.some((value) => value.toLocaleLowerCase().includes(search));
    });

    const orderBy = input.orderBy?.length
      ? input.orderBy
      : [{ field: "updatedAt", direction: "desc" as const }];
    filtered.sort((left, right) => compareEntries(left, right, orderBy));
    const scope = getCursorScope(input, type.id);
    if (input.after) {
      const cursor = decodeCursor(input.after, scope);
      filtered = filtered.filter((entry) => {
        for (const [index, order] of orderBy.entries()) {
          const compared = compareValues(
            valueAtPath(entry, order.field),
            cursor.values[index],
          );
          if (compared) return order.direction === "asc" ? compared > 0 : compared < 0;
        }
        return entry.id.localeCompare(cursor.id) > 0;
      });
    }

    const pageRows = filtered.slice(0, input.first + 1);
    const hasNextPage = pageRows.length > input.first;
    const pageItems = pageRows.slice(0, input.first);
    return {
      items: pageItems,
      nextCursor: hasNextPage
        ? createCursor(pageItems[pageItems.length - 1]!, orderBy, scope)
        : null,
      hasNextPage,
    };
  }

  async listRevisions(
    input: CmsListRevisionsInput,
  ): Promise<readonly CmsContentRevision[]> {
    await this.#ensureCollections();
    const entry = await this.#getEntryRecord(input);
    await this.#authorize({
      tenantId: input.tenantId,
      actor: input.actor,
      resource: "revision",
      action: "revision:read",
      resourceId: entry.id,
      record: entry,
    });
    const first = input.first ?? 100;
    if (!Number.isInteger(first) || first < 1 || first > 500) {
      throw new CmsValidationError([
        { path: "first", code: "range", message: "Revision page size must be from 1 to 500." },
      ]);
    }
    const revisions = await this.#storage.findMany<CmsContentRevision>(
      COLLECTIONS.revisions,
      {
        where: {
          tenantId: equality(input.tenantId),
          entryId: equality(entry.id),
        },
        orderBy: [{ field: "revisionNumber", direction: "desc" }],
        limit: first,
      },
    );
    const type = await this.#getTypeById(input.tenantId, entry.contentTypeId);
    const output: CmsContentRevision[] = [];
    for (const revision of revisions) {
      if (
        !(await this.#isAllowed({
          tenantId: input.tenantId,
          actor: input.actor,
          resource: "revision",
          action: "revision:read",
          resourceId: revision.id,
          record: revision,
        }))
      ) {
        continue;
      }
      const fields = await this.#redactFields(
        input.tenantId,
        input.actor,
        type,
        revision.fields,
        revision,
        "admin",
      );
      const publishedSnapshot = revision.publishedSnapshot
        ? await this.#visibleSnapshot(
            input.tenantId,
            input.actor,
            type,
            revision.publishedSnapshot,
            revision,
            "admin",
          )
        : null;
      output.push({ ...revision, fields, publishedSnapshot });
    }
    return output;
  }

  async listAuditEvents(
    input: CmsListAuditEventsInput,
  ): Promise<readonly CmsAuditEvent[]> {
    await this.#ensureCollections();
    this.#assertTenant(input.tenantId);
    await this.#authorize({
      tenantId: input.tenantId,
      actor: input.actor,
      resource: "audit",
      action: "audit:read",
      resourceId: input.resourceId,
    });
    const first = input.first ?? 100;
    if (!Number.isInteger(first) || first < 1 || first > 500) {
      throw new CmsValidationError([
        { path: "first", code: "range", message: "Audit page size must be from 1 to 500." },
      ]);
    }
    const where: Record<string, StorageComparison> = {
      tenantId: equality(input.tenantId),
    };
    if (input.resourceId) where.resourceId = equality(input.resourceId);
    const events = await this.#storage.findMany<CmsAuditEvent>(
      COLLECTIONS.audit,
      {
        where,
        orderBy: [{ field: "timestamp", direction: "desc" }],
        limit: first,
      },
    );
    const output: CmsAuditEvent[] = [];
    for (const event of events) {
      if (
        await this.#isAllowed({
          tenantId: input.tenantId,
          actor: input.actor,
          resource: "audit",
          action: "audit:read",
          resourceId: event.id,
          record: event,
        })
      ) {
        output.push(event);
      }
    }
    return output;
  }

  async listChangeEvents(
    input: CmsListChangeEventsInput,
  ): Promise<CmsChangeEventPage> {
    await this.#ensureCollections();
    await this.#ensureChangeEvents();
    this.#assertTenant(input.tenantId);
    await this.#authorize({
      tenantId: input.tenantId,
      actor: input.actor,
      resource: "changeEvent",
      action: "change-event:read",
    });
    const first = input.first ?? 100;
    if (!Number.isInteger(first) || first < 1 || first > 500) {
      throw new CmsValidationError([
        { path: "first", code: "range", message: "Change event page size must be from 1 to 500." },
      ]);
    }
    if (input.after !== undefined && (
      typeof input.after !== "string" || !input.after || input.after.length > 4096
    )) {
      throw new CmsValidationError([
        { path: "after", code: "invalid", message: "The change event cursor is invalid." },
      ]);
    }
    this.#requireCapabilities("cursorPagination");
    const page = await this.#storage.findPage<CmsChangeEvent>(
      COLLECTIONS.changeEvents,
      {
        where: { tenantId: equality(input.tenantId) },
        orderBy: [{ field: "id", direction: "asc" }],
        first,
        ...(input.after === undefined ? {} : { after: { value: input.after } }),
      },
    );
    const output: CmsChangeEvent[] = [];
    for (const event of page.items) {
      if (await this.#isAllowed({
        tenantId: input.tenantId,
        actor: input.actor,
        resource: "changeEvent",
        action: "change-event:read",
        resourceId: event.id,
        record: event,
      })) {
        output.push(event);
      }
    }
    return {
      items: output,
      nextCursor: page.nextCursor?.value ?? null,
      hasNextPage: page.hasNextPage,
    };
  }

  async acknowledgeChangeEvent(
    input: CmsContext & { readonly eventId: string; readonly expectedRevision: number },
  ): Promise<void> {
    await this.#ensureCollections();
    await this.#ensureChangeEvents();
    this.#assertTenant(input.tenantId);
    if (typeof input.eventId !== "string" || !input.eventId.trim()) {
      throw new CmsValidationError([
        { path: "eventId", code: "required", message: "A change event ID is required." },
      ]);
    }
    if (!Number.isInteger(input.expectedRevision) || input.expectedRevision < 1) {
      throw new CmsValidationError([
        { path: "expectedRevision", code: "required", message: "A positive expected revision is required." },
      ]);
    }
    const event = await this.#storage.findById<CmsChangeEvent>(
      COLLECTIONS.changeEvents,
      input.eventId,
    );
    if (!event || event.tenantId !== input.tenantId) {
      throw new CmsNotFoundError("Change event");
    }
    await this.#authorize({
      tenantId: input.tenantId,
      actor: input.actor,
      resource: "changeEvent",
      action: "change-event:ack",
      resourceId: event.id,
      record: event,
    });
    this.#requireCapabilities("conditionalWrites");
    if (event.fanoutLeaseUntil && event.fanoutLeaseUntil > this.#now()) {
      throw new CmsConflictError("The change event is being fanned out.");
    }
    try {
      const deleted = await this.#storage.delete<CmsChangeEvent>(
        COLLECTIONS.changeEvents,
        event.id,
        { expectedRevision: input.expectedRevision },
      );
      if (!deleted) throw new CmsNotFoundError("Change event");
    } catch (error) {
      if (error instanceof StorageConflictError) throw new CmsConflictError();
      throw error;
    }
  }

  async listMediaUsages(
    input: CmsListMediaUsagesInput,
  ): Promise<readonly CmsMediaUsage[]> {
    await this.#ensureCollections();
    this.#assertTenant(input.tenantId);
    if (!input.assetId.trim()) {
      throw new CmsValidationError([
        { path: "assetId", code: "required", message: "An asset ID is required." },
      ]);
    }
    await this.#authorize({
      tenantId: input.tenantId,
      actor: input.actor,
      resource: "mediaUsage",
      action: "media:usage-read",
    });
    const first = input.first ?? 100;
    if (!Number.isInteger(first) || first < 1 || first > 500) {
      throw new CmsValidationError([
        { path: "first", code: "range", message: "Media usage page size must be from 1 to 500." },
      ]);
    }
    const usages = await this.#storage.findMany<CmsMediaUsage>(
      COLLECTIONS.mediaUsages,
      {
        where: {
          tenantId: equality(input.tenantId),
          assetId: equality(input.assetId),
        },
        orderBy: [{ field: "createdAt", direction: "desc" }],
        limit: first,
      },
    );
    const output: CmsMediaUsage[] = [];
    for (const usage of usages) {
      if (
        await this.#isAllowed({
          tenantId: input.tenantId,
          actor: input.actor,
          resource: "mediaUsage",
          action: "media:usage-read",
          resourceId: usage.entryId,
          fieldPath: usage.fieldPath,
          record: usage,
        })
      ) {
        output.push(usage);
      }
    }
    return output;
  }

  async #archiveEntry(
    input: CmsContext & { readonly entryId: string; readonly expectedRevision: number; readonly changeSummary?: string },
    deleted: boolean,
  ): Promise<CmsEntryView> {
    await this.#ensureCollections();
    const current = await this.#getEntryRecord(input);
    this.#assertExpectedRevision(current, input.expectedRevision);
    await this.#authorizeEntry(input, current, deleted ? "entry:delete" : "entry:archive");
    const type = await this.#getTypeById(input.tenantId, current.contentTypeId);
    const fields = await this.#currentFields(current, type, input);
    const scheduled = this.#scheduledTask(current);
    const now = this.#now();
    const updated = await this.#persistEntry(
      current,
      {
        ...current,
        ...this.#revisionFields(current, type, fields, current.slug),
        status: "archived",
        publishedSnapshot: null,
        publicSlug: null,
        publicSlugKey: unpublishedSlugKey(current.id),
        scheduledAt: null,
        scheduledTimeZone: null,
        scheduledRevisionNumber: null,
        archivedAt: deleted ? current.archivedAt ?? now : now,
        deletedAt: deleted ? now : current.deletedAt,
        updatedBy: input.actor?.id ?? null,
      },
      input.actor,
      deleted ? "delete" : "archive",
      input.changeSummary,
    );
    if (scheduled) await this.#cancelScheduled(scheduled);
    return this.#makeView(updated, type, "admin", input.actor);
  }

  async #persistEntry(
    current: CmsContentEntry | null,
    candidate: EntryCandidate,
    actor: CmsActor | null,
    action: CmsRevisionAction,
    changeSummary?: string,
  ): Promise<CmsContentEntry> {
    this.#requireCapabilities("atomicBatch", "uniqueConstraints");
    if (current) this.#requireCapabilities("conditionalWrites");
    const now = this.#now();
    const revisionNumber = current ? current.revisionNumber + 1 : 1;
    const entry = {
      ...candidate,
      createdAt: current?.createdAt ?? candidate.createdAt ?? now,
      updatedAt: now,
      revision: current?.revision ?? 1,
      revisionNumber,
    } satisfies CmsContentEntry;
    const revision: StorageInsert<CmsContentRevision> = {
      id: this.#idGenerator(),
      tenantId: entry.tenantId,
      contentTypeId: entry.contentTypeId,
      entryId: entry.id,
      locale: entry.locale,
      revisionNumber,
      schemaVersion: entry.schemaVersion,
      slug: entry.slug,
      fields: entry.fields,
      status: entry.status,
      publishedSnapshot: entry.publishedSnapshot,
      scheduledAt: entry.scheduledAt,
      scheduledTimeZone: entry.scheduledTimeZone,
      action,
      actorId: actor?.id ?? null,
      changeSummary,
      createdAt: now,
      updatedAt: now,
      revision: 1,
    };
    const audit = this.#auditInsert({
      tenantId: entry.tenantId,
      actor,
      resource: "entry",
      resourceId: entry.id,
      action: `entry:${action}`,
      result: "success",
      revisionNumber,
    });
    this.#requireChangeEventCapabilities();
    if (this.#emitChangeEvents) await this.#ensureChangeEvents();
    const type = await this.#getTypeById(entry.tenantId, entry.contentTypeId);
    if (entry.schemaVersion !== type.version) {
      throw new CmsConflictError(
        "The content type schema changed during this operation; reload and retry.",
      );
    }
    const desiredMediaUsages = this.#collectMediaUsages(type, entry, actor);
    const currentMediaUsages = current
      ? await this.#storage.findMany<CmsMediaUsage>(COLLECTIONS.mediaUsages, {
          where: {
            tenantId: equality(entry.tenantId),
            entryId: equality(entry.id),
          },
        })
      : [];
    const desiredUsageKeys = new Set(
      desiredMediaUsages.map((usage) => this.#mediaUsageKey(usage)),
    );
    const currentUsageKeys = new Set(
      currentMediaUsages.map((usage) => this.#mediaUsageKey(usage)),
    );
    const operations: StorageBatchOperation<CmsStoredRecord>[] = [];
    if (current) {
      operations.push({
        type: "update",
        collection: COLLECTIONS.entries,
        id: current.id,
        condition: { expectedRevision: current.revision },
        changes: this.#updateChanges(entry) as StorageUpdate<CmsStoredRecord>,
      } as StorageBatchOperation<CmsStoredRecord>);
    } else {
      operations.push({
        type: "insert",
        collection: COLLECTIONS.entries,
        record: entry as StorageInsert<CmsContentEntry>,
      } as StorageBatchOperation<CmsStoredRecord>);
    }
    for (const usage of currentMediaUsages) {
      if (!desiredUsageKeys.has(this.#mediaUsageKey(usage))) {
        operations.push({
          type: "delete",
          collection: COLLECTIONS.mediaUsages,
          id: usage.id,
        } as StorageBatchOperation<CmsStoredRecord>);
      }
    }
    for (const usage of desiredMediaUsages) {
      if (!currentUsageKeys.has(this.#mediaUsageKey(usage))) {
        operations.push({
          type: "insert",
          collection: COLLECTIONS.mediaUsages,
          record: usage as StorageInsert<CmsMediaUsage>,
        } as StorageBatchOperation<CmsStoredRecord>);
      }
    }
    operations.push(
      {
        type: "insert",
        collection: COLLECTIONS.revisions,
        record: revision,
      } as StorageBatchOperation<CmsStoredRecord>,
      {
        type: "insert",
        collection: COLLECTIONS.audit,
        record: audit,
      } as StorageBatchOperation<CmsStoredRecord>,
      ...this.#changeEventOperations(audit),
    );

    const result = await this.#runBatch(operations);
    const first = result.results[0];
    if (!first || (first.type !== "insert" && first.type !== "update")) {
      throw new CmsConflictError();
    }
    if (first.type === "update" && !first.record) throw new CmsConflictError();
    return first.record as CmsContentEntry;
  }

  async #runBatch(
    operations: readonly StorageBatchOperation<CmsStoredRecord>[],
  ) {
    try {
      return await this.#storage.atomicBatch<CmsStoredRecord>(operations);
    } catch (error) {
      if (error instanceof StorageConflictError) throw new CmsConflictError();
      if (error instanceof StorageDuplicateError) {
        throw new CmsDuplicateError("A CMS unique constraint", { cause: error });
      }
      if (error instanceof StorageAtomicityError) {
        throw new CmsCapabilityError("atomicBatch");
      }
      throw error;
    }
  }

  async #getEntryRecord(input: CmsContext & { readonly entryId: string }): Promise<CmsContentEntry> {
    this.#assertTenant(input.tenantId);
    const entry = await this.#storage.findById<CmsContentEntry>(
      COLLECTIONS.entries,
      input.entryId,
    );
    if (!entry || entry.tenantId !== input.tenantId) {
      throw new CmsNotFoundError("Content entry");
    }
    return entry;
  }

  async #findContentType(
    tenantId: string,
    slug: string,
  ): Promise<CmsContentTypeRecord | null> {
    return this.#storage.findOne<CmsContentTypeRecord>(
      COLLECTIONS.contentTypes,
      {
        where: {
          tenantId: equality(tenantId),
          slug: equality(slug),
        },
      },
    );
  }

  async #getType(tenantId: string, slug: string): Promise<CmsContentTypeRecord> {
    const record = await this.#findContentType(tenantId, normalizeCmsSlug(slug));
    if (!record) throw new CmsNotFoundError("Content type");
    this.#cacheDefinition(tenantId, record);
    return record;
  }

  async #getTypeById(
    tenantId: string,
    id: string,
  ): Promise<CmsContentTypeRecord> {
    const type = await this.#storage.findById<CmsContentTypeRecord>(
      COLLECTIONS.contentTypes,
      id,
    );
    if (!type || type.tenantId !== tenantId) {
      throw new CmsNotFoundError("Content type");
    }
    this.#cacheDefinition(tenantId, type);
    return type;
  }

  #collectMediaUsages(
    type: CmsContentTypeRecord,
    entry: CmsContentEntry,
    actor: CmsActor | null,
  ): readonly StorageInsert<CmsMediaUsage>[] {
    const found: StorageInsert<CmsMediaUsage>[] = [];
    const visit = (
      definitions: readonly CmsFieldDefinition[],
      fields: CmsFields,
      usageType: CmsMediaUsage["usageType"],
      prefix = "",
    ): void => {
      for (const field of definitions) {
        if (!Object.prototype.hasOwnProperty.call(fields, field.key)) continue;
        const path = prefix ? `${prefix}.${field.key}` : field.key;
        const value = fields[field.key];
        if (field.type === "media" && typeof value === "string") {
          const now = this.#now();
          found.push({
            id: this.#idGenerator(),
            tenantId: entry.tenantId,
            assetId: value,
            contentTypeId: entry.contentTypeId,
            entryId: entry.id,
            locale: entry.locale,
            fieldPath: path,
            usageType,
            createdBy: actor?.id ?? null,
            createdAt: now,
            updatedAt: now,
            revision: 1,
          });
        } else if (field.type === "repeater" && Array.isArray(value)) {
          value.forEach((item, index) => {
            if (isRecord(item)) {
              visit(
                field.fields ?? [],
                item as CmsFields,
                usageType,
                `${path}[${index}]`,
              );
            }
          });
        } else if (field.type === "blocks" && Array.isArray(value)) {
          value.forEach((item, index) => {
            if (!isRecord(item) || !isRecord(item.fields)) return;
            const block = field.blocks?.find((candidate) => candidate.type === item.type);
            if (block) {
              visit(
                block.fields,
                item.fields as CmsFields,
                usageType,
                `${path}[${index}].fields`,
              );
            }
          });
        }
      }
    };

    visit(type.fields, entry.fields, "draft");
    if (entry.publishedSnapshot) {
      visit(type.fields, entry.publishedSnapshot.fields, "published");
    }
    return found;
  }

  #mediaUsageKey(
    usage: Pick<CmsMediaUsage, "assetId" | "usageType" | "fieldPath">,
  ): string {
    return `${usage.usageType}\0${usage.fieldPath}\0${usage.assetId}`;
  }

  #definition(record: CmsContentTypeRecord): ContentTypeDefinition {
    return {
      slug: record.slug,
      name: record.name,
      description: record.description,
      version: record.version,
      fields: record.fields,
      locales: record.locales.length ? record.locales : undefined,
      defaultLocale: record.defaultLocale,
    };
  }

  #cacheDefinition(tenantId: string, record: CmsContentTypeRecord): void {
    const current = this.#registry.get(tenantId, record.slug);
    if (current && current.version > record.version) {
      throw new CmsConflictError(
        "A newer content type schema is already cached; reload the content type.",
      );
    }
    if (!current || current.version < record.version) {
      this.#registry.register(tenantId, this.#definition(record));
    }
  }

  #normalizeDefinition(definition: ContentTypeDefinition): ContentTypeDefinition {
    validateContentTypeDefinition(definition, this.#schemaOptions());
    return {
      ...definition,
      slug: normalizeCmsSlug(definition.slug),
      locales: definition.locales?.map(serializeLocale),
      defaultLocale: definition.defaultLocale
        ? serializeLocale(definition.defaultLocale)
        : undefined,
    };
  }

  #validateLocale(type: CmsContentTypeRecord, locale: string): string {
    const normalized = serializeLocale(locale);
    if (type.locales.length && !type.locales.includes(normalized)) {
      throw new CmsValidationError([
        { path: "locale", code: "unsupported-locale", message: `Locale "${normalized}" is not enabled for this content type.` },
      ]);
    }
    return normalized;
  }

  async #validateFields(
    type: CmsContentTypeRecord,
    fields: CmsFields,
    tenantId: string,
    locale: string,
    actor: CmsActor | null,
    entryId?: string,
  ): Promise<CmsFields> {
    void entryId;
    return validateContentFields(
      this.#definition(type),
      fields,
      { tenantId, contentTypeSlug: type.slug, locale, actor },
      this.#schemaOptions(),
    );
  }

  async #currentFields(
    entry: CmsContentEntry,
    type: CmsContentTypeRecord,
    context: CmsContext,
  ): Promise<CmsFields> {
    const fields = await this.#migrateFields(
      type,
      entry.fields,
      entry.schemaVersion,
      entry.tenantId,
    );
    return validateContentFields(
      this.#definition(type),
      fields,
      {
        tenantId: context.tenantId,
        contentTypeSlug: type.slug,
        locale: entry.locale,
        actor: context.actor,
      },
      this.#schemaOptions(),
    );
  }

  async #migrateFields(
    type: CmsContentTypeRecord,
    fields: CmsFields,
    fromVersion: number,
    tenantId?: string,
  ): Promise<CmsFields> {
    if (fromVersion > type.version) {
      throw new CmsSchemaError("Entry schema version is newer than its content type.");
    }
    let migrated = fields;
    for (let version = fromVersion; version < type.version; version += 1) {
      const migration = this.#getMigration(tenantId, type.slug, version);
      if (migration) {
        migrated = await migration.migrate(migrated);
      } else if (type.requiresMigrationFromVersions.includes(version)) {
        throw new CmsSchemaError(
          `Migration ${type.slug} ${version} → ${version + 1} must be registered before reading or editing this entry.`,
        );
      }
    }
    return migrated;
  }

  #addMigration(migration: CmsSchemaMigration): void {
    if (
      !migration.contentTypeSlug ||
      migration.toVersion !== migration.fromVersion + 1 ||
      !Number.isInteger(migration.fromVersion) ||
      migration.fromVersion < 1
    ) {
      throw new CmsSchemaError("Schema migrations must advance exactly one version.");
    }
    const key = `${migration.tenantId ?? "*"}:${normalizeCmsSlug(migration.contentTypeSlug)}:${migration.fromVersion}`;
    if (this.#migrations.has(key)) {
      throw new CmsSchemaError(`A migration for ${key} is already registered.`);
    }
    this.#migrations.set(key, migration);
  }

  #getMigration(
    tenantId: string | undefined,
    contentTypeSlug: string,
    fromVersion: number,
  ): CmsSchemaMigration | undefined {
    const slug = normalizeCmsSlug(contentTypeSlug);
    return (
      this.#migrations.get(`${tenantId ?? "*"}:${slug}:${fromVersion}`) ??
      this.#migrations.get(`*:${slug}:${fromVersion}`)
    );
  }

  #withSlugField(
    type: CmsContentTypeRecord,
    fields: CmsFields,
    slug?: string,
  ): CmsFields {
    const slugField = type.fields.find((field) => field.type === "slug");
    if (!slugField || slug === undefined) return fields;
    return { ...fields, [slugField.key]: normalizeCmsSlug(slug) };
  }

  #resolveSlug(
    inputSlug: string | undefined,
    type: CmsContentTypeRecord,
    fields: CmsFields,
  ): string {
    const slugField = type.fields.find((field) => field.type === "slug");
    const selected = inputSlug ?? (slugField ? fields[slugField.key] : undefined);
    if (typeof selected !== "string") {
      throw new CmsValidationError([
        { path: "slug", code: "required", message: "An explicit slug or slug field is required." },
      ]);
    }
    const normalized = normalizeCmsSlug(selected);
    if (!normalized) {
      throw new CmsValidationError([
        { path: "slug", code: "format", message: "Slug must contain at least one letter or number." },
      ]);
    }
    return normalized;
  }

  #revisionFields(
    current: CmsContentEntry,
    type: CmsContentTypeRecord,
    fields: CmsFields,
    slug: string,
  ): Pick<CmsContentEntry, "fields" | "slug" | "schemaVersion"> {
    void current;
    return { fields, slug, schemaVersion: type.version };
  }

  async #assertUniqueSlug(
    tenantId: string,
    type: CmsContentTypeRecord,
    locale: string,
    slug: string,
    excludingEntryId?: string,
  ): Promise<void> {
    this.#requireCapabilities("uniqueConstraints");
    const rows = await this.#storage.findMany<CmsContentEntry>(
      COLLECTIONS.entries,
      {
        where: {
          tenantId: equality(tenantId),
          contentTypeId: equality(type.id),
          locale: equality(locale),
        },
      },
    );
    if (
      rows.some(
        (entry) =>
          entry.id !== excludingEntryId &&
          (entry.slug === slug || entry.publicSlug === slug),
      )
    ) {
      throw new CmsDuplicateError("A slug for this content type and locale");
    }
  }

  async #assertSharedFieldUpdate(
    type: CmsContentTypeRecord,
    fields: CmsFields,
    current: CmsContentEntry,
  ): Promise<void> {
    const siblings = await this.#storage.findMany<CmsContentEntry>(
      COLLECTIONS.entries,
      {
        where: {
          tenantId: equality(current.tenantId),
          contentTypeId: equality(type.id),
          translationGroupId: equality(current.translationGroupId),
        },
      },
    );
    await this.#assertSharedFields(
      current.tenantId,
      type,
      fields,
      siblings.filter((entry) => entry.id !== current.id),
    );
  }

  async #assertSharedFields(
    tenantId: string,
    type: CmsContentTypeRecord,
    fields: CmsFields,
    siblings: readonly CmsContentEntry[],
  ): Promise<void> {
    const issues: CmsValidationIssue[] = [];
    for (const field of type.fields) {
      if (field.localized) continue;
      for (const sibling of siblings) {
        const siblingFields = await this.#migrateFields(
          type,
          sibling.fields,
          sibling.schemaVersion,
          tenantId,
        );
        if (!sameValue(fields[field.key], siblingFields[field.key])) {
          issues.push({
            path: field.key,
            code: "locale-shared",
            message: "Non-localized field values must match across locale variants.",
          });
          break;
        }
      }
    }
    if (issues.length) throw new CmsValidationError(issues);
  }

  async #assertWritableFields(
    tenantId: string,
    actor: CmsActor | null,
    type: CmsContentTypeRecord,
    fields: CmsFields,
    record?: CmsContentEntry,
  ): Promise<void> {
    for (const fieldPath of fieldPaths(type.fields, fields)) {
      await this.#authorize({
        tenantId,
        actor,
        resource: "entry",
        action: "field:write",
        resourceId: record?.id,
        fieldPath,
        record,
      });
    }
  }

  async #validateReferences(
    tenantId: string,
    actor: CmsActor | null,
    type: CmsContentTypeRecord,
    locale: string,
    fields: CmsFields,
    entryId?: string,
  ): Promise<void> {
    const issues: CmsValidationIssue[] = [];
    const visit = async (
      definitions: readonly CmsFieldDefinition[],
      values: CmsFields,
      prefix = "",
    ): Promise<void> => {
      for (const field of definitions) {
        if (!Object.prototype.hasOwnProperty.call(values, field.key)) continue;
        const path = prefix ? `${prefix}.${field.key}` : field.key;
        const value = values[field.key];
        if (field.type === "media" && typeof value === "string") {
          if (!this.#mediaValidator) {
            issues.push({
              path,
              code: "media-validator-required",
              message: "A media reference validator is required to accept asset IDs.",
            });
          } else {
            try {
              await this.#mediaValidator.assertCanReference({
                tenantId,
                assetId: value,
                actor,
                contentTypeSlug: type.slug,
                entryId,
                fieldPath: path,
              });
            } catch {
              issues.push({
                path,
                code: "media-reference",
                message: "The asset is missing or cannot be referenced in this tenant.",
              });
            }
          }
        } else if (field.type === "relationship") {
          const ids = Array.isArray(value) ? value : [value];
          for (const id of ids) {
            if (typeof id !== "string") continue;
            const target = await this.#storage.findById<CmsContentEntry>(
              COLLECTIONS.entries,
              id,
            );
            const relation = field.relation;
            const valid =
              target !== null &&
              target.tenantId === tenantId &&
              relation?.targetTypes.includes(target.contentTypeSlug) === true &&
              (!relation.sameLocale || target.locale === locale) &&
              !target.deletedAt &&
              (relation.allowedStatuses
                ? relation.allowedStatuses.includes(target.status)
                : target.status !== "archived");
            if (!valid) {
              issues.push({
                path,
                code: "invalid-relation",
                message: "A related entry is missing, outside this tenant, or disallowed by the relation.",
              });
            }
          }
        } else if (field.type === "repeater" && Array.isArray(value)) {
          for (const [index, item] of value.entries()) {
            if (isRecord(item)) {
              await visit(field.fields ?? [], item as CmsFields, `${path}[${index}]`);
            }
          }
        } else if (field.type === "blocks" && Array.isArray(value)) {
          for (const [index, item] of value.entries()) {
            if (!isRecord(item) || !isRecord(item.fields)) continue;
            const block = field.blocks?.find((candidate) => candidate.type === item.type);
            if (block) {
              await visit(block.fields, item.fields as CmsFields, `${path}[${index}].fields`);
            }
          }
        }
      }
    };
    await visit(type.fields, fields);
    if (issues.length) throw new CmsValidationError(issues);
  }

  async #makeView(
    entry: CmsContentEntry,
    type: CmsContentTypeRecord,
    visibility: CmsVisibility,
    actor: CmsActor | null,
  ): Promise<CmsEntryView> {
    if (visibility === "public") {
      if (!isPublicEntry(entry) || !entry.publishedSnapshot) {
        throw new CmsNotFoundError("Published content entry");
      }
      const publishedSnapshot = await this.#visibleSnapshot(
        entry.tenantId,
        actor,
        type,
        entry.publishedSnapshot,
        entry,
        "public",
      );
      return {
        ...entry,
        slug: entry.publishedSnapshot.slug,
        publicSlug: entry.publishedSnapshot.slug,
        publicSlugKey: entry.publishedSnapshot.slug,
        locale: entry.publishedSnapshot.locale,
        updatedAt: entry.publishedSnapshot.publishedAt,
        updatedBy: entry.publishedSnapshot.publishedBy,
        revision: entry.publishedSnapshot.entryRevision,
        fields: publishedSnapshot.fields,
        publishedSnapshot,
        schemaVersion: type.version,
        revisionNumber: entry.publishedSnapshot.revisionNumber,
        status: "published",
        scheduledAt: null,
        scheduledTimeZone: null,
        scheduledRevisionNumber: null,
        resolvedLocale: entry.publishedSnapshot.locale,
      };
    }
    const fields = await this.#migrateFields(
      type,
      entry.fields,
      entry.schemaVersion,
      entry.tenantId,
    );
    const redacted = await this.#redactFields(
      entry.tenantId,
      actor,
      type,
      fields,
      entry,
      "admin",
    );
    const publishedSnapshot = entry.publishedSnapshot
      ? await this.#visibleSnapshot(
          entry.tenantId,
          actor,
          type,
          entry.publishedSnapshot,
          entry,
          "admin",
        )
      : null;
    return {
      ...entry,
      fields: redacted,
      publishedSnapshot,
      schemaVersion: type.version,
      resolvedLocale: entry.locale,
    };
  }

  async #visibleSnapshot(
    tenantId: string,
    actor: CmsActor | null,
    type: CmsContentTypeRecord,
    snapshot: CmsContentEntry["publishedSnapshot"] & {},
    record: unknown,
    visibility: CmsVisibility,
  ): Promise<NonNullable<CmsContentEntry["publishedSnapshot"]>> {
    const fields = await this.#migrateFields(
      type,
      snapshot.fields,
      snapshot.schemaVersion,
      tenantId,
    );
    return {
      ...snapshot,
      fields: await this.#redactFields(
        tenantId,
        actor,
        type,
        fields,
        record,
        visibility,
      ),
      schemaVersion: type.version,
    };
  }

  async #redactFields(
    tenantId: string,
    actor: CmsActor | null,
    type: CmsContentTypeRecord,
    values: CmsFields,
    record: unknown,
    visibility: CmsVisibility,
  ): Promise<CmsFields> {
    const redact = async (
      definitions: readonly CmsFieldDefinition[],
      source: CmsFields,
      prefix = "",
    ): Promise<Record<string, CmsValue>> => {
      const result: Record<string, CmsValue> = {};
      for (const field of definitions) {
        if (!Object.prototype.hasOwnProperty.call(source, field.key)) continue;
        const path = prefix ? `${prefix}.${field.key}` : field.key;
        const allowed = await this.#isAllowed({
          tenantId,
          actor,
          resource: "entry",
          action: "field:read",
          visibility,
          fieldPath: path,
          record,
        });
        if (!allowed) continue;
        const value = source[field.key];
        if (value === undefined) continue;
        if (field.type === "repeater" && Array.isArray(value)) {
          const rows: CmsValue[] = [];
          for (const [index, item] of value.entries()) {
            rows.push(
              isRecord(item)
                ? await redact(field.fields ?? [], item as CmsFields, `${path}[${index}]`)
                : item,
            );
          }
          result[field.key] = rows;
        } else if (field.type === "blocks" && Array.isArray(value)) {
          const blocks: CmsValue[] = [];
          for (const [index, item] of value.entries()) {
            if (!isRecord(item) || !isRecord(item.fields)) {
              blocks.push(item);
              continue;
            }
            const block = field.blocks?.find((candidate) => candidate.type === item.type);
            blocks.push(block
              ? {
                  type: block.type,
                  fields: await redact(
                    block.fields,
                    item.fields as CmsFields,
                    `${path}[${index}].fields`,
                  ),
                }
              : item as CmsValue);
          }
          result[field.key] = blocks;
        } else {
          result[field.key] = value;
        }
      }
      return result;
    };
    return redact(type.fields, values);
  }

  #scheduledTask(entry: CmsContentEntry): CmsScheduledPublication | null {
    if (!entry.scheduledAt || !entry.scheduledRevisionNumber) return null;
    if (!entry.scheduledTimeZone) {
      throw new CmsSchemaError("A scheduled entry is missing its time zone.");
    }
    return {
      id: `${entry.id}:${entry.scheduledRevisionNumber}`,
      tenantId: entry.tenantId,
      entryId: entry.id,
      scheduledRevisionNumber: entry.scheduledRevisionNumber,
      publishAt: entry.scheduledAt,
      timeZone: entry.scheduledTimeZone,
    };
  }

  async #cancelScheduled(publication: CmsScheduledPublication): Promise<void> {
    if (!this.#scheduler) {
      throw new CmsSchedulerError(
        "The CMS mutation succeeded, but no scheduler is configured to cancel the stale job.",
        {
          entryId: publication.entryId,
          scheduledRevisionNumber: publication.scheduledRevisionNumber,
        },
      );
    }
    try {
      await this.#scheduler.cancel(publication);
    } catch (error) {
      throw new CmsSchedulerError(
        "The CMS mutation succeeded, but the stale scheduled job could not be cancelled.",
        {
          entryId: publication.entryId,
          scheduledRevisionNumber: publication.scheduledRevisionNumber,
        },
        { cause: error },
      );
    }
  }

  #requireScheduler(): CmsScheduler {
    if (!this.#scheduler) throw new CmsCapabilityError("scheduler");
    return this.#scheduler;
  }

  async #authorizeEntry(
    input: CmsContext & { readonly entryId?: string },
    entry: CmsContentEntry,
    action: CmsAccessAction,
    visibility?: CmsVisibility,
  ): Promise<void> {
    await this.#authorize({
      tenantId: input.tenantId,
      actor: input.actor,
      resource: "entry",
      action,
      visibility,
      resourceId: entry.id,
      record: entry,
    });
  }

  async #authorize(request: CmsAccessRequest): Promise<void> {
    this.#assertTenant(request.tenantId);
    this.#assertActor(request.actor);
    if (!(await this.#isAllowed(request))) {
      await this.#recordDenied(request);
      throw new CmsPermissionDeniedError();
    }
  }

  async #isAllowed(request: CmsAccessRequest): Promise<boolean> {
    try {
      return (await this.#accessPolicy(request)) === true;
    } catch {
      return false;
    }
  }

  async #recordDenied(request: CmsAccessRequest): Promise<void> {
    try {
      await this.#storage.insert<CmsAuditEvent>(
        COLLECTIONS.audit,
        this.#auditInsert({
          tenantId: request.tenantId,
          actor: request.actor,
          resource: request.resource,
          resourceId: request.resourceId ?? "unresolved",
          action: request.action,
          result: "denied",
          details: request.fieldPath
            ? { fieldPath: request.fieldPath }
            : undefined,
        }),
      );
    } catch (error) {
      throw new CmsAuditError({ cause: error });
    }
  }

  #auditInsert(input: {
    readonly tenantId: string;
    readonly actor: CmsActor | null;
    readonly resource: CmsAuditEvent["resource"];
    readonly resourceId: string;
    readonly action: string;
    readonly result: CmsAuditEvent["result"];
    readonly revisionNumber?: number;
    readonly details?: Readonly<Record<string, CmsValue>>;
  }): StorageInsert<CmsAuditEvent> {
    const now = this.#now();
    return {
      id: this.#idGenerator(),
      tenantId: input.tenantId,
      actorId: input.actor?.id ?? null,
      resource: input.resource,
      resourceId: input.resourceId,
      action: input.action,
      result: input.result,
      timestamp: now,
      revisionNumber: input.revisionNumber,
      details: input.details,
      createdAt: now,
      updatedAt: now,
      revision: 1,
    };
  }

  #requireChangeEventCapabilities(): void {
    if (this.#emitChangeEvents) {
      this.#requireCapabilities("conditionalWrites", "cursorPagination");
    }
  }

  #changeEventOperations(
    audit: StorageInsert<CmsAuditEvent>,
  ): StorageBatchOperation<CmsStoredRecord>[] {
    if (!this.#emitChangeEvents) return [];
    if (audit.resource !== "entry" && audit.resource !== "contentType") {
      throw new TypeError("Only successful entry and content type mutations emit change events.");
    }
    const event: StorageInsert<CmsChangeEvent> = {
      id: audit.id,
      tenantId: audit.tenantId,
      resource: audit.resource,
      resourceId: audit.resourceId,
      action: audit.action,
      occurredAt: audit.timestamp,
      ...(audit.revisionNumber === undefined ? {} : { revisionNumber: audit.revisionNumber }),
      createdAt: audit.timestamp,
      updatedAt: audit.timestamp,
      revision: 1,
    };
    return [{ type: "insert", collection: COLLECTIONS.changeEvents, record: event }];
  }

  #updateChanges<T extends StorageRecord>(record: T): StorageUpdate<T> {
    const { id: _id, createdAt: _createdAt, revision: _revision, ...changes } = record;
    return changes as StorageUpdate<T>;
  }

  #assertExpectedRevision(entry: CmsContentEntry, expectedRevision: number): void {
    if (!Number.isInteger(expectedRevision) || expectedRevision < 1) {
      throw new CmsValidationError([
        { path: "expectedRevision", code: "required", message: "A positive expected revision is required." },
      ]);
    }
    if (entry.revision !== expectedRevision) throw new CmsConflictError();
  }

  #assertTenant(tenantId: string): void {
    if (typeof tenantId !== "string" || !tenantId.trim()) {
      throw new CmsValidationError([
        { path: "tenantId", code: "required", message: "Tenant scope is required." },
      ]);
    }
  }

  #assertActor(actor: CmsActor | null): void {
    if (
      actor !== null &&
      (!actor || typeof actor !== "object" || typeof actor.id !== "string" || !actor.id.trim())
    ) {
      throw new CmsValidationError([
        { path: "actor", code: "invalid-actor", message: "Provide an actor with a non-empty ID or null for an unauthenticated request." },
      ]);
    }
  }

  #requireCapabilities(...required: readonly string[]): void {
    const capabilities = this.#storage.getCapabilities().capabilities;
    for (const capability of required) {
      if (!capabilities[capability as keyof typeof capabilities]) {
        throw new CmsCapabilityError(capability);
      }
    }
  }

  #schemaOptions(): CmsSchemaRegistryOptions {
    return { customValidators: this.#customValidators };
  }

  #now(): Date {
    const value = this.#clock();
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      throw new TypeError("CMS clock must return a valid Date.");
    }
    return value;
  }

  async #ensureCollections(): Promise<void> {
    this.#collectionsReady ??= Promise.all([
      this.#storage.registerCollection<CmsContentTypeRecord>(
        addIndexes<CmsContentTypeRecord>(COLLECTIONS.contentTypes, [
          { name: "by-tenant-slug", fields: ["tenantId", "slug"], unique: true },
          { name: "by-tenant", fields: ["tenantId"] },
        ]),
      ),
      this.#storage.registerCollection<CmsContentEntry>(
        addIndexes<CmsContentEntry>(COLLECTIONS.entries, [
          { name: "by-tenant-type-locale-slug", fields: ["tenantId", "contentTypeId", "locale", "slug"], unique: true },
          { name: "by-tenant-type-locale-public-slug", fields: ["tenantId", "contentTypeId", "locale", "publicSlugKey"], unique: true },
          { name: "by-tenant-type-locale", fields: ["tenantId", "contentTypeId", "locale"] },
          { name: "by-translation-group", fields: ["tenantId", "translationGroupId"] },
        ]),
      ),
      this.#storage.registerCollection<CmsContentRevision>(
        addIndexes<CmsContentRevision>(COLLECTIONS.revisions, [
          { name: "by-tenant-entry-revision", fields: ["tenantId", "entryId", "revisionNumber"], unique: true },
        ]),
      ),
      this.#storage.registerCollection<CmsAuditEvent>(
        addIndexes<CmsAuditEvent>(COLLECTIONS.audit, [
          { name: "by-tenant-resource", fields: ["tenantId", "resource", "resourceId", "timestamp"] },
        ]),
      ),
      this.#storage.registerCollection<CmsMediaUsage>(
        addIndexes<CmsMediaUsage>(COLLECTIONS.mediaUsages, [
          { name: "by-tenant-entry-field-asset", fields: ["tenantId", "entryId", "usageType", "fieldPath", "assetId"], unique: true },
          { name: "by-tenant-asset", fields: ["tenantId", "assetId"] },
        ]),
      ),
    ]).then(() => undefined);
    await this.#collectionsReady;
  }

  async #ensureChangeEvents(): Promise<void> {
    this.#changeEventsReady ??= this.#storage.registerCollection<CmsChangeEvent>(
      addIndexes<CmsChangeEvent>(COLLECTIONS.changeEvents, [
        { name: "by-tenant-id", fields: ["tenantId", "id"] },
      ]),
    );
    await this.#changeEventsReady;
  }
}
