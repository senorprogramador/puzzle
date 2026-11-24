import {
  StorageAtomicityError,
  StorageConflictError,
  StorageDuplicateError,
  type StorageAdapter,
  type StorageBatchOperation,
  type StorageComparison,
  type StorageIndex,
  type StorageInsert,
  type StorageOrder,
  type StorageRecord,
  type StorageUpdate,
  type StorageWhere,
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
import type { CmsEntryWhereNode } from "./collections/query";
import type { RuntimeCmsFieldDefinition } from "./fields/types";
import type { FieldMap } from "./fields/types";
import type {
  CollectionAccessAction,
  CmsCollectionAccessPolicy,
  CmsCollectionHookEvent,
  CmsCollectionHookOperation,
  CmsCollectionRuntimeOptions,
} from "./collections/collection";

const COLLECTIONS = {
  contentTypes: "cms_content_types",
  entries: "cms_content_entries",
  revisions: "cms_content_revisions",
  audit: "cms_audit_events",
  changeEvents: "cms_change_events",
  mediaUsages: "cms_media_usages",
  relationshipLocks: "cms_relationship_locks",
} as const;

const unpublishedSlugKey = (entryId: string): string =>
  `~cms-unpublished:${entryId}`;

type CmsStoredRecord =
  | CmsContentTypeRecord
  | CmsContentEntry
  | CmsContentRevision
  | CmsAuditEvent
  | CmsChangeEvent
  | CmsMediaUsage
  | CmsRelationshipLock;

type CmsRelationshipLock = StorageRecord & {
  readonly tenantId: string;
  readonly targetEntryId: string;
  readonly generation: number;
};

type ResolvedCmsCollectionRuntimeOptions = CmsCollectionRuntimeOptions & {
  readonly drafts: boolean;
  readonly timestamps: boolean;
};

export type CmsServiceOptions = {
  readonly storage: StorageAdapter;
  readonly accessPolicy: CmsAccessPolicy;
  readonly collectionOptions?: Readonly<Record<string, CmsCollectionRuntimeOptions>>;
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

export type CmsPurgeEntryInput = CmsContext & {
  readonly entryId: string;
  readonly expectedRevision: number;
  readonly changeSummary?: string;
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
    : isRecord(value) &&
      (Object.getPrototypeOf(value) === Object.prototype ||
        Object.getPrototypeOf(value) === null) &&
      Object.values(value).every((item) => isCmsValue(item, seen));
  seen.delete(value);
  return valid;
};

const fieldAccessPathsAt = (
  definitions: readonly QueryFieldDefinition[],
  fieldPath: string,
): readonly { readonly definition: QueryFieldDefinition; readonly path: string }[] => {
  const segments = fieldPath.replace(/\[\d+\]/g, "").split(".");
  let candidates = definitions;
  let current: QueryFieldDefinition | undefined;
  let currentPath = "";
  const found: Array<{
    readonly definition: QueryFieldDefinition;
    readonly path: string;
  }> = [];
  for (const segment of segments) {
    if (segment === "fields" && current?.type === "blocks") {
      candidates = current.blocks?.flatMap((block) => block.fields) ?? [];
      currentPath = `${currentPath}.fields`;
      current = undefined;
      continue;
    }
    current = candidates.find((candidate) => candidate.key === segment);
    if (!current) return [];
    currentPath = currentPath ? `${currentPath}.${segment}` : segment;
    found.push({ definition: current, path: currentPath });
    const runtime = current;
    if (runtime.type === "array" && runtime.of?.type === "object") {
      candidates = runtime.of.fields ?? [];
    } else {
      candidates = runtime.fields ?? [];
    }
  }
  return found;
};

const MAX_PURGE_CONTENT_TYPES = 500;
const MAX_PURGE_RELATED_RECORDS = 500;
const MAX_PURGE_REFERENCE_SCAN = 10_000;
const PURGE_SCAN_PAGE_SIZE = 200;
const MAX_RELATIONSHIP_GUARDS = 500;

const hasRelationshipTarget = (
  definitions: readonly QueryFieldDefinition[],
  targetType: string,
): boolean =>
  definitions.some((field) => {
    if (
      field.type === "relationship" &&
      field.relation?.targetTypes.includes(targetType)
    ) {
      return true;
    }
    if (hasRelationshipTarget(field.fields ?? [], targetType)) return true;
    if (field.of && hasRelationshipTarget([field.of], targetType)) return true;
    return (field.blocks ?? []).some((block) =>
      hasRelationshipTarget(block.fields, targetType),
    );
  });

const sameValue = (left: unknown, right: unknown): boolean =>
  JSON.stringify(left) === JSON.stringify(right);

const immutableClone = <T>(value: T): T => {
  const clone = structuredClone(value);
  const seen = new Set<object>();
  const freeze = (current: unknown): void => {
    if (typeof current !== "object" || current === null || seen.has(current)) return;
    seen.add(current);
    Object.values(current).forEach(freeze);
    Object.freeze(current);
  };
  freeze(clone);
  return clone;
};

const addIndexes = <T extends StorageRecord>(
  name: string,
  indexes: readonly StorageIndex<T>[],
) => ({ name, indexes });

type QueryFieldDefinition = RuntimeCmsFieldDefinition;

const collectRelationshipIds = (
  definitions: readonly QueryFieldDefinition[],
  values: CmsFields,
): ReadonlySet<string> => {
  const ids = new Set<string>();
  const visitField = (field: QueryFieldDefinition, value: CmsValue): void => {
    if (field.type === "relationship") {
      for (const id of Array.isArray(value) ? value : [value]) {
        if (typeof id === "string") ids.add(id);
      }
      return;
    }
    if (field.type === "object" && isRecord(value)) {
      visit(field.fields ?? [], value as CmsFields);
      return;
    }
    if (field.type === "array" && Array.isArray(value) && field.of) {
      for (const item of value) visitField(field.of, item);
      return;
    }
    if (field.type === "repeater" && Array.isArray(value)) {
      for (const item of value) {
        if (isRecord(item)) visit(field.fields ?? [], item as CmsFields);
      }
      return;
    }
    if (field.type === "blocks" && Array.isArray(value)) {
      for (const item of value) {
        if (!isRecord(item) || !isRecord(item.fields)) continue;
        const block = field.blocks?.find((candidate) => candidate.type === item.type);
        if (block) visit(block.fields, item.fields as CmsFields);
      }
    }
  };
  const visit = (
    fields: readonly QueryFieldDefinition[],
    record: CmsFields,
  ): void => {
    for (const field of fields) {
      if (Object.prototype.hasOwnProperty.call(record, field.key)) {
        visitField(field, record[field.key]!);
      }
    }
  };
  visit(definitions, values);
  return ids;
};

type CmsEntryQueryWithWhere = CmsEntryQuery & {
  readonly where?: CmsEntryWhereNode | readonly CmsEntryWhereNode[];
  readonly translationGroupId?: string;
};

export type CmsEntryTranslationsQuery = CmsEntryQuery & {
  readonly translationGroupId: string;
  readonly where?: CmsEntryWhereNode | readonly CmsEntryWhereNode[];
};

type QueryPath = {
  readonly fieldType?: string;
  readonly arrayItemType?: string;
  readonly metadata?: string;
  readonly publicStatus?: boolean;
};

type NormalizedQuerySort = {
  readonly field: string;
  readonly sourceField: string;
  readonly direction: "asc" | "desc";
};

type StorageCondition = StorageWhere<CmsContentEntry>;

const queryableMetadata = new Set([
  "id",
  "slug",
  "locale",
  "status",
  "createdAt",
  "updatedAt",
  "publishedAt",
]);

const assertStoragePathDepth = (storagePath: string, path: string): string => {
  if (storagePath.split(".").length > 6) {
    throw new CmsValidationError([
      { path, code: "range", message: "Storage query paths cannot exceed six segments." },
    ]);
  }
  return storagePath;
};

const searchableFieldTypes = new Set([
  "text",
  "textarea",
  "email",
  "url",
  "slug",
  "select",
  "multiSelect",
  "array",
  "media",
  "relationship",
  "date",
  "datetime",
  "locale",
]);

const sortableFieldTypes = new Set([
  "text",
  "textarea",
  "email",
  "url",
  "slug",
  "select",
  "media",
  "relationship",
  "number",
  "boolean",
  "date",
  "datetime",
  "locale",
]);

const scalarArrayItemTypes = new Set([
  "text",
  "textarea",
  "number",
  "boolean",
  "date",
  "datetime",
  "email",
  "url",
  "slug",
  "select",
  "media",
  "relationship",
  "locale",
]);

const createQueryPathMap = (
  fields: readonly QueryFieldDefinition[],
): ReadonlyMap<string, QueryPath> => {
  const paths = new Map<string, QueryPath>();
  const visit = (
    definitions: readonly QueryFieldDefinition[],
    prefix = "",
  ): void => {
    for (const field of definitions) {
      const path = prefix ? `${prefix}.${field.key}` : field.key;
      paths.set(path, {
        fieldType: field.type,
        ...(field.type === "array" && field.of
          ? { arrayItemType: field.of.type }
          : field.type === "multiSelect"
            ? { arrayItemType: "select" }
            : {}),
      });
      if (field.type === "object" && field.fields) {
        visit(field.fields, path);
      }
    }
  };
  visit(fields);
  for (const name of queryableMetadata) paths.set(name, { metadata: name });
  return paths;
};

const serializeRuntimeField = (
  definition: QueryFieldDefinition,
): CmsFieldDefinition => {
  const record = { ...definition } as Record<string, unknown>;
  const runtimeAccess = definition.access;
  const runtimeCallbacks = [
    ...(typeof definition.validate === "function" ? ["validate"] : []),
    ...(typeof definition.compute === "function" ? ["compute"] : []),
    ...(typeof definition.is === "function" ? ["is"] : []),
    ...(typeof runtimeAccess?.read === "function" ? ["access.read"] : []),
    ...(typeof runtimeAccess?.write === "function" ? ["access.write"] : []),
  ];
  delete record.access;
  delete record.validate;
  delete record.compute;
  delete record.is;
  if (runtimeCallbacks.length) {
    record.__cmsRuntimeCallbacks = runtimeCallbacks;
  } else {
    delete record.__cmsRuntimeCallbacks;
  }
  if (definition.fields) {
    record.fields = definition.fields.map(serializeRuntimeField);
  }
  if (definition.of) {
    record.of = serializeRuntimeField(definition.of);
  }
  if (definition.blocks) {
    record.blocks = definition.blocks.map((block) => ({
      ...block,
      fields: block.fields.map(serializeRuntimeField),
    }));
  }
  if (runtimeAccess) {
    const serializableAccess: { read?: boolean; write?: boolean } = {};
    if (typeof runtimeAccess.read === "boolean") {
      serializableAccess.read = runtimeAccess.read;
    }
    if (typeof runtimeAccess.write === "boolean") {
      serializableAccess.write = runtimeAccess.write;
    }
    if (Object.keys(serializableAccess).length) record.access = serializableAccess;
  }
  return record as unknown as CmsFieldDefinition;
};

const serializeRuntimeFields = (
  definitions: readonly CmsFieldDefinition[],
): readonly CmsFieldDefinition[] =>
  definitions.map((definition) =>
    serializeRuntimeField(definition as QueryFieldDefinition),
  );

const missingRuntimeCallbacks = (
  definitions: readonly QueryFieldDefinition[],
  prefix = "",
): readonly string[] => {
  const missing: string[] = [];
  for (const field of definitions) {
    const path = prefix ? `${prefix}.${field.key}` : field.key;
    const markers = (field as QueryFieldDefinition & {
      readonly __cmsRuntimeCallbacks?: readonly string[];
    }).__cmsRuntimeCallbacks ?? [];
    for (const callback of markers) {
      if (
        (callback === "validate" && typeof field.validate !== "function") ||
        (callback === "compute" && typeof field.compute !== "function") ||
        (callback === "is" && typeof field.is !== "function") ||
        (callback === "access.read" && typeof field.access?.read !== "function") ||
        (callback === "access.write" && typeof field.access?.write !== "function")
      ) {
        missing.push(`${path}:${callback}`);
      }
    }
    missing.push(...missingRuntimeCallbacks(field.fields ?? [], path));
    if (field.of) {
      missing.push(...missingRuntimeCallbacks([field.of], `${path}[]`));
    }
    for (const block of field.blocks ?? []) {
      missing.push(...missingRuntimeCallbacks(block.fields, `${path}.${block.type}`));
    }
  }
  return missing;
};

const resolveQueryPath = (
  field: string,
  paths: ReadonlyMap<string, QueryPath>,
  visibility: CmsVisibility,
  path: string,
): {
  readonly storagePath: string;
  readonly schemaPath?: string;
  readonly fieldType?: string;
  readonly arrayItemType?: string;
  readonly publicStatus?: boolean;
} => {
  const normalized = field.startsWith("fields.")
    ? field.slice("fields.".length)
    : field;
  const definition = paths.get(normalized);
  if (!definition) {
    throw new CmsValidationError([
      {
        path,
        code: "unknown-field",
        message: `Query field "${field}" is not present in the content type schema.`,
      },
    ]);
  }

  if (definition.fieldType) {
    if (definition.fieldType === "computed") {
      throw new CmsValidationError([
        {
          path,
          code: "unsupported-field",
          message: "Computed fields cannot be filtered, searched, or sorted in Storage.",
        },
      ]);
    }
    return {
      storagePath: assertStoragePathDepth(
        `${visibility === "public" ? "publishedSnapshot.fields" : "fields"}.${normalized}`,
        path,
      ),
      schemaPath: normalized,
      fieldType: definition.fieldType,
      arrayItemType: definition.arrayItemType,
    };
  }

  const metadata = definition.metadata!;
  if (metadata === "slug") {
    return {
      storagePath: assertStoragePathDepth(
        visibility === "public" ? "publishedSnapshot.slug" : "slug",
        path,
      ),
      schemaPath: metadata,
    };
  }
  if (metadata === "locale") {
    return {
      storagePath: assertStoragePathDepth(
        visibility === "public" ? "publishedSnapshot.locale" : "locale",
        path,
      ),
      schemaPath: metadata,
    };
  }
  if (metadata === "updatedAt") {
    return {
      storagePath: assertStoragePathDepth(
        visibility === "public" ? "publishedSnapshot.publishedAt" : "updatedAt",
        path,
      ),
      schemaPath: metadata,
    };
  }
  if (metadata === "publishedAt") {
    return {
      storagePath: assertStoragePathDepth("publishedSnapshot.publishedAt", path),
      schemaPath: metadata,
    };
  }
  if (metadata === "status" && visibility === "public") {
    return {
      storagePath: assertStoragePathDepth("status", path),
      schemaPath: metadata,
      publicStatus: true,
    };
  }
  return {
    storagePath: assertStoragePathDepth(metadata, path),
    schemaPath: metadata,
  };
};

const mergeConditions = (
  conditions: readonly StorageCondition[],
): StorageCondition => {
  if (conditions.length === 0) return {};
  if (conditions.length === 1) return conditions[0]!;
  return { and: conditions };
};

const conditionAt = (
  field: string,
  comparison: StorageComparison,
): StorageCondition =>
  ({ [field]: comparison }) as unknown as StorageCondition;

const isStorageScalar = (
  value: unknown,
): value is string | number | boolean | null | Date =>
  value === null ||
  typeof value === "string" ||
  (typeof value === "number" && Number.isFinite(value)) ||
  typeof value === "boolean" ||
  value instanceof Date;

const collectionAccessAlias = (request: CmsAccessRequest): string | undefined => {
  const isTranslation =
    isRecord(request.record) &&
    typeof request.record.translationGroupId === "string";
  switch (request.action) {
    case "entry:create":
      return isTranslation ? "translations" : "create";
    case "entry:read":
      return isTranslation ? "translations" : "read";
    case "entry:update":
      return "update";
    case "entry:delete":
      return "delete";
    case "entry:publish":
      return "publish";
    case "entry:unpublish":
      return "unpublish";
    case "entry:schedule":
      return "schedule";
    case "entry:unschedule":
      return "unschedule";
    case "entry:archive":
      return "archive";
    case "entry:restore":
      return "restore";
    case "revision:read":
      return "revisions";
    case "field:read":
      return "read";
    case "field:write":
      if (
        isRecord(request.record) &&
        (
          request.record.collectionOperation === "create" ||
          request.record.collectionOperation === "update" ||
          request.record.collectionOperation === "restore"
        )
      ) {
        return request.record.collectionOperation;
      }
      return "update";
    default:
      return undefined;
  }
};

const toStorageFilterCondition = (
  field: string,
  operator: string,
  value: unknown,
  path: string,
): StorageCondition => {
  if (operator === "exists") {
    if (typeof value !== "boolean") {
      throw new CmsValidationError([
        { path, code: "type", message: "The exists filter requires a boolean value." },
      ]);
    }
    return value
      ? mergeConditions([
          conditionAt(field, { operator: "exists", value: true }),
          conditionAt(field, { operator: "ne", value: null }),
        ])
      : {
          or: [
            conditionAt(field, { operator: "exists", value: false }),
            conditionAt(field, { operator: "eq", value: null }),
          ],
        };
  }

  if (operator === "in" || operator === "notIn") {
    if (
      !Array.isArray(value) ||
      !value.every(isStorageScalar)
    ) {
      throw new CmsValidationError([
        { path, code: "type", message: "This filter requires an array of scalar values." },
      ]);
    }
    const comparison = {
      operator,
      value,
    } as StorageComparison;
    const condition = conditionAt(field, comparison);
    if (operator === "notIn") {
      return {
        or: [condition, conditionAt(field, { operator: "exists", value: false })],
      };
    }
    return mergeConditions([
      conditionAt(field, { operator: "exists", value: true }),
      condition,
    ]);
  }

  if (!isStorageScalar(value)) {
    throw new CmsValidationError([
      { path, code: "type", message: "Query filters require scalar values." },
    ]);
  }

  if (operator === "equals") operator = "eq";
  if (operator === "notEquals") operator = "ne";
  if (operator === "greaterThan") operator = "gt";
  if (operator === "greaterThanOrEqual") operator = "gte";
  if (operator === "lessThan") operator = "lt";
  if (operator === "lessThanOrEqual") operator = "lte";
  if (![
    "eq",
    "ne",
    "contains",
    "gt",
    "gte",
    "lt",
    "lte",
  ].includes(operator)) {
    throw new CmsValidationError([
      { path, code: "operator", message: `Unsupported filter operator "${operator}".` },
    ]);
  }
  const condition = conditionAt(field, { operator, value } as StorageComparison);
  if (operator === "eq" && value === null) {
    return mergeConditions([
      conditionAt(field, { operator: "exists", value: true }),
      condition,
    ]);
  }
  return operator === "ne"
    ? { or: [condition, conditionAt(field, { operator: "exists", value: false })] }
    : condition;
};

const validateContainsField = (
  resolved: ReturnType<typeof resolveQueryPath>,
  operator: string,
  value: unknown,
  path: string,
): void => {
  const isArrayField =
    resolved.fieldType === "array" ||
    resolved.fieldType === "multiSelect";
  if (
    isArrayField &&
    operator !== "contains" &&
    operator !== "exists"
  ) {
    throw new CmsValidationError([
      { path, code: "operator", message: "Array fields support only contains and exists filters." },
    ]);
  }
  const containsAllowed =
    (resolved.fieldType !== undefined &&
      searchableFieldTypes.has(resolved.fieldType) &&
      (!isArrayField ||
        (resolved.arrayItemType !== undefined &&
          scalarArrayItemTypes.has(resolved.arrayItemType)))) ||
    (resolved.fieldType === undefined &&
      ["id", "slug", "locale", "status"].includes(resolved.schemaPath ?? ""));
  if (operator === "contains" && !containsAllowed) {
    throw new CmsValidationError([
      { path, code: "operator", message: "The contains operator is not supported for this field." },
    ]);
  }
  if (
    operator === "contains" &&
    !isArrayField &&
    typeof value !== "string"
  ) {
    throw new CmsValidationError([
      { path, code: "type", message: "Contains on scalar fields requires a string value." },
    ]);
  }
};

const publicStatusCondition = (
  operator: string,
  value: unknown,
  path: string,
): StorageCondition => {
  const actual = "published";
  if (
    (operator === "exists" && typeof value !== "boolean") ||
    ((operator === "in" || operator === "notIn") &&
      (!Array.isArray(value) || !value.every(isStorageScalar))) ||
    (operator === "contains" && typeof value !== "string") ||
    ([
      "gt",
      "gte",
      "lt",
      "lte",
      "greaterThan",
      "greaterThanOrEqual",
      "lessThan",
      "lessThanOrEqual",
    ].includes(operator) && typeof value !== "string") ||
    (!["exists", "in", "notIn"].includes(operator) &&
      !isStorageScalar(value))
  ) {
    throw new CmsValidationError([
      { path, code: "type", message: "The status filter value has an invalid type." },
    ]);
  }
  let matches: boolean;
  if (operator === "exists") {
    matches = value === true;
  } else if (operator === "equals" || operator === "eq") {
    matches = actual === value;
  } else if (operator === "notEquals" || operator === "ne") {
    matches = actual !== value;
  } else if (operator === "contains") {
    matches = typeof value === "string" &&
      actual.toLocaleLowerCase().includes(value.toLocaleLowerCase());
  } else if (operator === "in") {
    matches = Array.isArray(value) && value.includes(actual);
  } else if (operator === "notIn") {
    matches = Array.isArray(value) && !value.includes(actual);
  } else if (
    operator === "gt" ||
    operator === "greaterThan"
  ) {
    matches = typeof value === "string" && actual > value;
  } else if (
    operator === "gte" ||
    operator === "greaterThanOrEqual"
  ) {
    matches = typeof value === "string" && actual >= value;
  } else if (
    operator === "lt" ||
    operator === "lessThan"
  ) {
    matches = typeof value === "string" && actual < value;
  } else if (
    operator === "lte" ||
    operator === "lessThanOrEqual"
  ) {
    matches = typeof value === "string" && actual <= value;
  } else {
    throw new CmsValidationError([
      { path, code: "operator", message: `Unsupported filter operator "${operator}".` },
    ]);
  }
  return matches
    ? {}
    : {
        and: [
          conditionAt("id", { operator: "exists", value: true }),
          conditionAt("id", { operator: "exists", value: false }),
        ],
      };
};

const normalizeWhereNode = (
  node: CmsEntryWhereNode,
  paths: ReadonlyMap<string, QueryPath>,
  visibility: CmsVisibility,
  path: string,
): StorageCondition => {
  if (typeof node !== "object" || node === null || Array.isArray(node)) {
    throw new CmsValidationError([
      { path, code: "type", message: "A where clause must be an object." },
    ]);
  }
  if ("field" in node) {
    if (
      typeof node.field !== "string" ||
      !node.field.trim() ||
      typeof node.operator !== "string"
    ) {
      throw new CmsValidationError([
        { path, code: "type", message: "A where condition requires a field and operator." },
      ]);
    }
    const resolved = resolveQueryPath(node.field, paths, visibility, `${path}.field`);
    if (resolved.publicStatus) {
      return publicStatusCondition(node.operator, node.value, `${path}.value`);
    }
    validateContainsField(resolved, node.operator, node.value, `${path}.field`);
    return toStorageFilterCondition(
      resolved.storagePath,
      node.operator,
      node.value,
      `${path}.value`,
    );
  }

  if ("and" in node) {
    const children = node.and;
    if (!Array.isArray(children) || children.length === 0) {
      throw new CmsValidationError([
        { path: `${path}.and`, code: "required", message: "The and clause requires at least one condition." },
      ]);
    }
    const conditions = children.map((child, index) =>
      normalizeWhereNode(child, paths, visibility, `${path}.and[${index}]`),
    );
    return mergeConditions(conditions);
  }
  if ("or" in node) {
    const children = node.or;
    if (!Array.isArray(children) || children.length === 0) {
      throw new CmsValidationError([
        { path: `${path}.or`, code: "required", message: "The or clause requires at least one condition." },
      ]);
    }
    return {
      or: children.map((child, index) =>
        normalizeWhereNode(child, paths, visibility, `${path}.or[${index}]`),
      ),
    };
  }

  throw new CmsValidationError([
    { path, code: "type", message: "A where clause must contain a field, and, or or condition." },
  ]);
};

const normalizeFlatFilter = (
  filter: CmsEntryFilter,
  index: number,
  paths: ReadonlyMap<string, QueryPath>,
  visibility: CmsVisibility,
): StorageCondition => {
  if (!filter.field.trim()) {
    throw new CmsValidationError([
      { path: `filters[${index}].field`, code: "required", message: "Filter field is required." },
    ]);
  }
  const resolved = resolveQueryPath(
    filter.field,
    paths,
    visibility,
    `filters[${index}].field`,
  );
  if (resolved.publicStatus) {
    return publicStatusCondition(filter.operator, filter.value, `filters[${index}].value`);
  }
  validateContainsField(
    resolved,
    filter.operator as string,
    filter.value,
    `filters[${index}].field`,
  );
  return toStorageFilterCondition(
    resolved.storagePath,
    filter.operator,
    filter.value,
    `filters[${index}].value`,
  );
};

const getSearchPaths = (
  paths: ReadonlyMap<string, QueryPath>,
  visibility: CmsVisibility,
): readonly string[] =>
  [...paths.entries()]
    .filter(([, definition]) =>
      definition.metadata === "slug" ||
      definition.metadata === "locale" ||
      (definition.fieldType !== undefined &&
        searchableFieldTypes.has(definition.fieldType) &&
        (definition.fieldType !== "array" ||
          (definition.arrayItemType !== undefined &&
            scalarArrayItemTypes.has(definition.arrayItemType)))),
    )
    .map(([field, definition]) => {
      if (definition.metadata === "slug") {
        return visibility === "public" ? "publishedSnapshot.slug" : "slug";
      }
      if (definition.metadata === "locale") {
        return visibility === "public" ? "publishedSnapshot.locale" : "locale";
      }
      return `${visibility === "public" ? "publishedSnapshot.fields" : "fields"}.${field}`;
    })
    .filter((field) => field.split(".").length <= 6);

const collectWhereFields = (
  node: CmsEntryWhereNode | readonly CmsEntryWhereNode[] | undefined,
): readonly string[] => {
  if (!node) return [];
  if (Array.isArray(node)) {
    return (node as readonly CmsEntryWhereNode[])
      .flatMap((child) => collectWhereFields(child));
  }
  const whereNode = node as CmsEntryWhereNode;
  if ("field" in whereNode) return [whereNode.field];
  if ("and" in whereNode) {
    return whereNode.and.flatMap((child) => collectWhereFields(child));
  }
  if ("or" in whereNode) {
    return whereNode.or.flatMap((child) => collectWhereFields(child));
  }
  return [];
};

const normalizeSorts = (
  input: readonly CmsEntrySort[] | undefined,
  paths: ReadonlyMap<string, QueryPath>,
  visibility: CmsVisibility,
): readonly NormalizedQuerySort[] => {
  if (input !== undefined && !Array.isArray(input)) {
    throw new CmsValidationError([
      { path: "orderBy", code: "type", message: "Sort fields must be an array." },
    ]);
  }
  if (!input?.length) {
    return [{
      field: visibility === "public" ? "publishedSnapshot.publishedAt" : "updatedAt",
      sourceField: "",
      direction: "desc",
    }];
  }
  const orderBy = input;
  const seen = new Set<string>();
  return orderBy.flatMap((sort, index) => {
    if (
      !sort ||
      typeof sort.field !== "string" ||
      (sort.direction !== "asc" && sort.direction !== "desc")
    ) {
      throw new CmsValidationError([
        { path: `orderBy[${index}]`, code: "type", message: "Each sort needs a valid field and direction." },
      ]);
    }
    const resolved = resolveQueryPath(
      sort.field,
      paths,
      visibility,
      `orderBy[${index}].field`,
    );
    if (resolved.publicStatus) return [];
    if (
      resolved.fieldType !== undefined &&
      !sortableFieldTypes.has(resolved.fieldType)
    ) {
      throw new CmsValidationError([
        { path: `orderBy[${index}].field`, code: "type", message: "This field cannot be sorted." },
      ]);
    }
    if (seen.has(resolved.storagePath)) {
      throw new CmsValidationError([
        { path: `orderBy[${index}].field`, code: "duplicate", message: "Sort fields must be unique." },
      ]);
    }
    seen.add(resolved.storagePath);
    return [{
      field: resolved.storagePath,
      sourceField: sort.field,
      direction: sort.direction,
    }];
  });
};

const toStorageOrder = (
  sorts: readonly NormalizedQuerySort[],
): readonly StorageOrder<CmsContentEntry>[] =>
  (sorts.length
    ? sorts
    : [{ field: "id", direction: "asc" as const, sourceField: "" }]
  ).map(({ field, direction }) => ({
    field: field as StorageOrder<CmsContentEntry>["field"],
    direction,
  }));

const createCursor = (
  storageAfter: string,
  scope: string,
): string =>
  encodeURIComponent(JSON.stringify({ scope, storageAfter }));

const decodeCursor = (
  value: string,
  scope: string,
): string => {
  try {
    const cursor: unknown = JSON.parse(decodeURIComponent(value));
    if (
      !isRecord(cursor) ||
      cursor.scope !== scope ||
      typeof cursor.storageAfter !== "string"
    ) {
      throw new Error("Invalid cursor");
    }
    return cursor.storageAfter;
  } catch {
    throw new CmsValidationError([
      { path: "after", code: "cursor", message: "Cursor is invalid or belongs to a different query." },
    ]);
  }
};

const getCursorScope = (
  query: CmsEntryQueryWithWhere,
  typeId: string,
  orderBy: readonly { readonly field: string; readonly direction: "asc" | "desc" }[],
): string =>
  JSON.stringify({
    tenantId: query.tenantId,
    typeId,
    locale: query.locale ? serializeLocale(query.locale) : null,
    visibility: query.visibility,
    search: query.search?.trim().toLocaleLowerCase() ?? "",
    filters: query.filters ?? [],
    where: query.where ?? null,
    translationGroupId: query.translationGroupId ?? null,
    orderBy,
  });

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

const fieldPaths = (
  definitions: readonly QueryFieldDefinition[],
  fields: CmsFields,
  prefix = "",
): readonly string[] => {
  const paths: string[] = [];
  for (const definition of definitions) {
    if (!Object.prototype.hasOwnProperty.call(fields, definition.key)) continue;
    const runtime = definition as QueryFieldDefinition;
    const path = prefix ? `${prefix}.${definition.key}` : definition.key;
    paths.push(path);
    const value = fields[definition.key];
    if (runtime.type === "object" && isRecord(value)) {
      paths.push(...fieldPaths(
        runtime.fields ?? [],
        value as CmsFields,
        path,
      ));
    } else if (
      runtime.type === "array" &&
      runtime.of?.type === "object" &&
      Array.isArray(value)
    ) {
      value.forEach((item, index) => {
        if (isRecord(item)) {
          paths.push(...fieldPaths(
            runtime.of!.fields ?? [],
            item as CmsFields,
            `${path}[${index}]`,
          ));
        }
      });
    } else if (runtime.type === "repeater" && Array.isArray(value)) {
      value.forEach((item, index) => {
        if (isRecord(item)) {
          paths.push(...fieldPaths(
            runtime.fields ?? [],
            item as CmsFields,
            `${path}[${index}]`,
          ));
        }
      });
    } else if (runtime.type === "blocks" && Array.isArray(value)) {
      value.forEach((item, index) => {
        if (!isRecord(item) || !isRecord(item.fields)) return;
        const block = runtime.blocks?.find((candidate) => candidate.type === item.type);
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
  readonly #collectionOptions: ReadonlyMap<string, ResolvedCmsCollectionRuntimeOptions>;
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
    const collectionOptions = new Map<string, ResolvedCmsCollectionRuntimeOptions>();
    for (const [slug, runtimeOptions] of Object.entries(options.collectionOptions ?? {})) {
      const normalizedSlug = normalizeCmsSlug(slug);
      if (!normalizedSlug || collectionOptions.has(normalizedSlug)) {
        throw new TypeError("Collection runtime options require unique normalized collection slugs.");
      }
      if (
        !runtimeOptions ||
        typeof runtimeOptions !== "object" ||
        (runtimeOptions.drafts !== undefined && typeof runtimeOptions.drafts !== "boolean") ||
        (runtimeOptions.timestamps !== undefined && typeof runtimeOptions.timestamps !== "boolean") ||
        (runtimeOptions.access !== undefined &&
          (!isRecord(runtimeOptions.access) ||
            Object.values(runtimeOptions.access).some(
              (policy) => typeof policy !== "function",
            ))) ||
        (runtimeOptions.hooks?.beforeChange !== undefined &&
          typeof runtimeOptions.hooks.beforeChange !== "function") ||
        (runtimeOptions.hooks?.afterChange !== undefined &&
          typeof runtimeOptions.hooks.afterChange !== "function")
      ) {
        throw new TypeError(`Invalid runtime options for collection "${slug}".`);
      }
      collectionOptions.set(normalizedSlug, {
        ...runtimeOptions,
        drafts: runtimeOptions.drafts ?? false,
        timestamps: runtimeOptions.timestamps ?? false,
      });
    }
    this.#collectionOptions = collectionOptions;
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
        if (this.#matchesDefinition(existing, definition)) {
          this.#registry.register(input.tenantId, definition);
          return existing;
        }
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
        fields: serializeRuntimeFields(definition.fields),
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
      try {
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
      } catch (error) {
        if (!(error instanceof CmsConflictError || error instanceof CmsDuplicateError)) {
          throw error;
        }
        const raced = await this.#findContentType(input.tenantId, definition.slug);
        if (
          raced &&
          raced.version === definition.version &&
          this.#matchesDefinition(raced, definition)
        ) {
          if (input.migration && !configuredMigration) this.#addMigration(input.migration);
          this.#registry.register(input.tenantId, definition);
          return raced;
        }
        throw error;
      }
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
      fields: serializeRuntimeFields(definition.fields),
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
    try {
      await this.#runBatch([
        {
          type: "insert",
          collection: COLLECTIONS.contentTypes,
          record: record as StorageInsert<CmsContentTypeRecord>,
        },
        { type: "insert", collection: COLLECTIONS.audit, record: audit },
        ...this.#changeEventOperations(audit),
      ]);
    } catch (error) {
      if (!(error instanceof CmsDuplicateError)) throw error;
      const raced = await this.#findContentType(input.tenantId, definition.slug);
      if (
        !raced ||
        raced.version !== definition.version ||
        !this.#matchesDefinition(raced, definition)
      ) {
        throw error;
      }
      this.#registry.register(input.tenantId, definition);
      return raced;
    }
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
      record: {
        contentType: type.slug,
        locale,
        ...(input.translationGroupId
          ? { translationGroupId: input.translationGroupId }
          : {}),
      },
    });

    const fieldsInput = this.#withSlugField(type, input.fields, input.slug);
    await this.#assertWritableFields(
      input.tenantId,
      input.actor,
      type,
      isRecord(fieldsInput) ? fieldsInput as CmsFields : {},
    );
    await this.#runBeforeChange(
      type,
      { tenantId: input.tenantId, actor: input.actor },
      "create",
      { fields: fieldsInput as CmsFields },
    );
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
    const draftsEnabled = this.#draftsEnabled(type);
    const publishedSnapshot = draftsEnabled
      ? null
      : {
          revisionNumber: 1,
          entryRevision: 1,
          schemaVersion: type.version,
          slug,
          locale,
          fields,
          publishedAt: this.#now(),
          publishedBy: input.actor?.id ?? null,
        };
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
        publicSlug: publishedSnapshot ? slug : null,
        publicSlugKey: publishedSnapshot ? slug : unpublishedSlugKey(entryId),
        fields,
        schemaVersion: type.version,
        revisionNumber: 1,
        status: draftsEnabled ? "draft" : "published",
        publishedSnapshot,
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
    const view = await this.#makeView(entry, type, "admin", input.actor);
    await this.#runAfterChange(
      type,
      { tenantId: input.tenantId, actor: input.actor },
      "create",
      view,
      { fields },
    );
    return view;
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
    if (!isRecord(input.fields)) {
      throw new CmsValidationError([
        { path: "fields", code: "type", message: "Fields must be an object." },
      ]);
    }
    const submittedFields = input.fields as CmsFields;
    const fieldsInput = this.#withSlugField(type, submittedFields, input.slug);
    await this.#assertWritableFields(
      input.tenantId,
      input.actor,
      type,
      fieldsInput,
      current,
    );
    const currentView = await this.#makeView(current, type, "admin", input.actor);
    await this.#runBeforeChange(
      type,
      { tenantId: input.tenantId, actor: input.actor },
      "update",
      {
        entryId: current.id,
        fields: fieldsInput,
        current: currentView,
      },
    );
    const fields = await this.#validateFields(
      type,
      { ...current.fields, ...fieldsInput },
      input.tenantId,
      current.locale,
      input.actor,
      current.id,
    );
    const slug = this.#resolveSlug(input.slug ?? current.slug, type, fields);
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
    const draftsEnabled = this.#draftsEnabled(type);
    const publishedSnapshot = draftsEnabled
      ? current.publishedSnapshot
      : {
          revisionNumber: current.revisionNumber + 1,
          entryRevision: current.revision + 1,
          schemaVersion: type.version,
          slug,
          locale: current.locale,
          fields,
          publishedAt: this.#now(),
          publishedBy: input.actor?.id ?? null,
        };
    const updated = await this.#persistEntry(
      current,
      {
        ...current,
        ...this.#revisionFields(current, type, fields, slug),
        status: draftsEnabled ? "draft" : "published",
        publicSlug: draftsEnabled ? current.publicSlug : slug,
        publicSlugKey: draftsEnabled ? current.publicSlugKey : slug,
        publishedSnapshot,
        scheduledAt: null,
        scheduledTimeZone: null,
        scheduledRevisionNumber: null,
        archivedAt: null,
        deletedAt: null,
        updatedBy: input.actor?.id ?? null,
      },
      input.actor,
      draftsEnabled ? "save-draft" : "publish",
      input.changeSummary,
    );
    if (scheduled) await this.#cancelScheduled(scheduled);
    const view = await this.#makeView(updated, type, "admin", input.actor);
    await this.#runAfterChange(
      type,
      { tenantId: input.tenantId, actor: input.actor },
      "update",
      view,
      { fields, current: currentView },
    );
    return view;
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
    const currentView = await this.#makeView(current, type, "admin", input.actor);
    await this.#runBeforeChange(
      type,
      { tenantId: input.tenantId, actor: input.actor },
      "publish",
      { entryId: current.id, current: currentView },
    );
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
    const view = await this.#makeView(updated, type, "admin", input.actor);
    await this.#runAfterChange(
      type,
      { tenantId: input.tenantId, actor: input.actor },
      "publish",
      view,
      { fields, current: currentView },
    );
    return view;
  }

  async unpublish(input: CmsContext & CmsEntryMutationInput): Promise<CmsEntryView> {
    await this.#ensureCollections();
    const current = await this.#getEntryRecord(input);
    this.#assertExpectedRevision(current, input.expectedRevision);
    await this.#authorizeEntry(input, current, "entry:unpublish");
    const type = await this.#getTypeById(input.tenantId, current.contentTypeId);
    if (!this.#draftsEnabled(type)) {
      throw new CmsCapabilityError("drafts");
    }
    if (!current.publishedSnapshot && current.status !== "scheduled") {
      throw new CmsConflictError("The entry has no published version to unpublish.");
    }
    const currentView = await this.#makeView(current, type, "admin", input.actor);
    await this.#runBeforeChange(
      type,
      { tenantId: input.tenantId, actor: input.actor },
      "unpublish",
      { entryId: current.id, current: currentView },
    );
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
    const view = await this.#makeView(updated, type, "admin", input.actor);
    await this.#runAfterChange(
      type,
      { tenantId: input.tenantId, actor: input.actor },
      "unpublish",
      view,
      { fields, current: currentView },
    );
    return view;
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
    const type = await this.#getTypeById(input.tenantId, current.contentTypeId);
    const currentView = await this.#makeView(current, type, "admin", input.actor);
    await this.#runBeforeChange(
      type,
      { tenantId: input.tenantId, actor: input.actor },
      "schedule",
      { entryId: current.id, fields: currentView.fields, current: currentView },
    );
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
    const view = await this.#makeView(updated, type, "admin", input.actor);
    await this.#runAfterChange(
      type,
      { tenantId: input.tenantId, actor: input.actor },
      "schedule",
      view,
      { fields, current: currentView },
    );
    return view;
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
    const draftsEnabled = this.#draftsEnabled(type);
    if (!draftsEnabled && !current.publishedSnapshot) {
      throw new CmsConflictError(
        "A non-draft collection cannot unschedule an entry without a published snapshot.",
      );
    }
    const currentView = await this.#makeView(current, type, "admin", input.actor);
    await this.#runBeforeChange(
      type,
      { tenantId: input.tenantId, actor: input.actor },
      "unschedule",
      { entryId: current.id, current: currentView },
    );
    const fields = await this.#currentFields(current, type, input);
    const scheduled = this.#scheduledTask(current);
    const updated = await this.#persistEntry(
      current,
      {
        ...current,
        ...this.#revisionFields(current, type, fields, current.slug),
        status: draftsEnabled ? "draft" : "published",
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
    const view = await this.#makeView(updated, type, "admin", input.actor);
    await this.#runAfterChange(
      type,
      { tenantId: input.tenantId, actor: input.actor },
      "unschedule",
      view,
      { fields, current: currentView },
    );
    return view;
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
    const current = await this.#storage.findOne<CmsContentEntry>(
      COLLECTIONS.entries,
      {
        where: {
          id: equality(input.publication.entryId),
          tenantId: equality(input.tenantId),
        },
      },
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
    const currentView = await this.#makeView(current, type, "admin", input.actor);
    await this.#runBeforeChange(
      type,
      { tenantId: input.tenantId, actor: input.actor },
      "scheduled-publish",
      { entryId: current.id, fields: currentView.fields, current: currentView },
    );
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
    const view = await this.#makeView(updated, type, "admin", input.actor);
    await this.#runAfterChange(
      type,
      { tenantId: input.tenantId, actor: input.actor },
      "scheduled-publish",
      view,
      { fields, current: currentView },
    );
    return {
      published: true,
      entry: view,
    };
  }

  async archive(input: CmsContext & CmsEntryMutationInput): Promise<CmsEntryView> {
    return this.#archiveEntry(input, false);
  }

  async deleteEntry(input: CmsContext & CmsEntryMutationInput): Promise<CmsEntryView> {
    return this.#archiveEntry(input, true);
  }

  async purgeEntry(input: CmsPurgeEntryInput): Promise<void> {
    await this.#ensureCollections();
    const current = await this.#getEntryRecord(input);
    this.#assertExpectedRevision(current, input.expectedRevision);
    await this.#authorizeEntry(input, current, "entry:delete");
    const type = await this.#getTypeById(input.tenantId, current.contentTypeId);
    const currentView = await this.#makeView(current, type, "admin", input.actor);
    await this.#runBeforeChange(
      type,
      { tenantId: input.tenantId, actor: input.actor },
      "delete",
      { entryId: current.id, current: currentView },
    );
    this.#requireCapabilities(
      "atomicBatch",
      "conditionalWrites",
      "uniqueConstraints",
      "cursorPagination",
    );
    const relationshipLock = await this.#ensureRelationshipLock(
      input.tenantId,
      current.id,
    );
    await this.#assertNoIncomingRelationshipReferences(input.tenantId, current);
    const [revisions, mediaUsages] = await Promise.all([
      this.#storage.findMany<CmsContentRevision>(COLLECTIONS.revisions, {
        where: {
          tenantId: equality(input.tenantId),
          entryId: equality(current.id),
        },
        orderBy: [{ field: "revisionNumber", direction: "desc" }],
        limit: MAX_PURGE_RELATED_RECORDS + 1,
      }),
      this.#storage.findMany<CmsMediaUsage>(COLLECTIONS.mediaUsages, {
        where: {
          tenantId: equality(input.tenantId),
          entryId: equality(current.id),
        },
        orderBy: [{ field: "id", direction: "asc" }],
        limit: MAX_PURGE_RELATED_RECORDS + 1,
      }),
    ]);
    if (
      revisions.length > MAX_PURGE_RELATED_RECORDS ||
      mediaUsages.length > MAX_PURGE_RELATED_RECORDS ||
      revisions.length + mediaUsages.length > MAX_PURGE_RELATED_RECORDS
    ) {
      throw new CmsCapabilityError("bounded atomic permanent-delete batch");
    }

    this.#requireChangeEventCapabilities();
    if (this.#emitChangeEvents) await this.#ensureChangeEvents();
    const now = this.#now();
    const tombstone: StorageInsert<CmsContentRevision> = {
      id: this.#idGenerator(),
      tenantId: current.tenantId,
      contentTypeId: current.contentTypeId,
      entryId: current.id,
      locale: current.locale,
      revisionNumber: current.revisionNumber + 1,
      schemaVersion: type.version,
      slug: current.slug,
      fields: {},
      status: "archived",
      publishedSnapshot: null,
      scheduledAt: null,
      scheduledTimeZone: null,
      action: "delete",
      actorId: input.actor?.id ?? null,
      changeSummary: input.changeSummary ?? "Permanently deleted",
      createdAt: now,
      updatedAt: now,
      revision: 1,
    };
    const audit = this.#auditInsert({
      tenantId: input.tenantId,
      actor: input.actor,
      resource: "entry",
      resourceId: current.id,
      action: "entry:delete",
      result: "success",
      revisionNumber: tombstone.revisionNumber,
      details: { permanent: true },
    });
    const scheduled = this.#scheduledTask(current);
    const scheduler = scheduled ? this.#requireScheduler() : undefined;
    if (scheduled) {
      try {
        await scheduler!.cancel(scheduled);
      } catch (error) {
        throw new CmsSchedulerError(
          "The scheduled publication could not be cancelled; the entry was not purged.",
          {
            entryId: current.id,
            scheduledRevisionNumber: scheduled.scheduledRevisionNumber,
          },
          { cause: error },
        );
      }
    }

    const operations: StorageBatchOperation<CmsStoredRecord>[] = [
      {
        type: "delete",
        collection: COLLECTIONS.entries,
        id: current.id,
        condition: { expectedRevision: current.revision },
      },
      {
        type: "delete",
        collection: COLLECTIONS.relationshipLocks,
        id: relationshipLock.id,
        condition: { expectedRevision: relationshipLock.revision },
      },
      ...revisions.map((revision) => ({
        type: "delete" as const,
        collection: COLLECTIONS.revisions,
        id: revision.id,
        condition: { expectedRevision: revision.revision },
      })),
      ...mediaUsages.map((usage) => ({
        type: "delete" as const,
        collection: COLLECTIONS.mediaUsages,
        id: usage.id,
        condition: { expectedRevision: usage.revision },
      })),
      {
        type: "insert",
        collection: COLLECTIONS.revisions,
        record: tombstone,
      },
      { type: "insert", collection: COLLECTIONS.audit, record: audit },
      ...this.#changeEventOperations(audit),
    ];
    try {
      await this.#runBatch(operations);
    } catch (error) {
      if (scheduled && scheduler) {
        try {
          await scheduler.schedule(scheduled);
        } catch (scheduleError) {
          throw new CmsSchedulerError(
            "The entry could not be purged and its scheduled publication could not be restored.",
            {
              entryId: current.id,
              scheduledRevisionNumber: scheduled.scheduledRevisionNumber,
            },
            { cause: scheduleError },
          );
        }
      }
      throw error;
    }
    await this.#runAfterChange(
      type,
      { tenantId: input.tenantId, actor: input.actor },
      "delete",
      currentView,
      { fields: currentView.fields, current: currentView },
    );
  }

  async restoreRevision(input: CmsRestoreRevisionInput): Promise<CmsEntryView> {
    await this.#ensureCollections();
    const current = await this.#getEntryRecord(input);
    this.#assertExpectedRevision(current, input.expectedRevision);
    const revision = await this.#storage.findOne<CmsContentRevision>(
      COLLECTIONS.revisions,
      {
        where: {
          id: equality(input.revisionId),
          tenantId: equality(input.tenantId),
          entryId: equality(current.id),
        },
      },
    );
    if (!revision) {
      throw new CmsNotFoundError("Content revision");
    }
    await this.#authorize({
      tenantId: input.tenantId,
      actor: input.actor,
      resource: "revision",
      action: "revision:read",
      resourceId: revision.id,
      record: { ...revision, contentTypeSlug: current.contentTypeSlug },
    });
    await this.#authorizeEntry(input, current, "entry:restore");
    const type = await this.#getTypeById(input.tenantId, current.contentTypeId);
    const migratedFields = await this.#migrateFields(
      type,
      revision.fields,
      revision.schemaVersion,
      input.tenantId,
    );
    const currentView = await this.#makeView(current, type, "admin", input.actor);
    await this.#runBeforeChange(
      type,
      { tenantId: input.tenantId, actor: input.actor },
      "restore",
      {
        entryId: current.id,
        fields: migratedFields,
        current: currentView,
      },
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
    await this.#assertWritableFields(
      input.tenantId,
      input.actor,
      type,
      fields,
      current,
      "restore",
    );
    await this.#validateReferences(input.tenantId, input.actor, type, current.locale, fields, current.id);
    await this.#assertUniqueSlug(input.tenantId, type, current.locale, slug, current.id);
    const scheduled = this.#scheduledTask(current);
    const draftsEnabled = this.#draftsEnabled(type);
    const publishedSnapshot = draftsEnabled
      ? current.publishedSnapshot
      : {
          revisionNumber: current.revisionNumber + 1,
          entryRevision: current.revision + 1,
          schemaVersion: type.version,
          slug,
          locale: current.locale,
          fields,
          publishedAt: this.#now(),
          publishedBy: input.actor?.id ?? null,
        };
    const updated = await this.#persistEntry(
      current,
      {
        ...current,
        ...this.#revisionFields(current, type, fields, slug),
        status: draftsEnabled ? "draft" : "published",
        publicSlug: draftsEnabled ? current.publicSlug : slug,
        publicSlugKey: draftsEnabled ? current.publicSlugKey : slug,
        publishedSnapshot,
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
    const view = await this.#makeView(updated, type, "admin", input.actor);
    await this.#runAfterChange(
      type,
      { tenantId: input.tenantId, actor: input.actor },
      "restore",
      view,
      { fields, current: currentView },
    );
    return view;
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
      const where: Record<string, StorageComparison> = {
        tenantId: equality(input.tenantId),
        contentTypeId: equality(type.id),
        deletedAt: equality(null),
      };
      if (visibility === "public") {
        Object.assign(where, {
          status: { operator: "ne", value: "archived" },
          publicSlug: equality(slug),
          "publishedSnapshot.slug": equality(slug),
          "publishedSnapshot.locale": equality(locale),
        });
      } else {
        Object.assign(where, {
          locale: equality(locale),
          slug: equality(slug),
        });
      }
      const match = await this.#storage.findOne<CmsContentEntry>(
        COLLECTIONS.entries,
        { where: where as StorageWhere<CmsContentEntry> },
      );
      if (!match) continue;
      if (visibility === "public" && !isPublicEntry(match)) continue;
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
    const type = await this.#getType(input.tenantId, input.contentType);
    const locale = input.locale ? this.#validateLocale(type, input.locale) : undefined;
    const visibility = validateVisibility(input.visibility);
    const queryInput = input as CmsEntryQueryWithWhere;
    await this.#authorize({
      tenantId: input.tenantId,
      actor: input.actor,
      resource: "entry",
      action: "entry:read",
      visibility,
      record: {
        contentType: type.slug,
        locale,
        ...(queryInput.translationGroupId
          ? { translationGroupId: queryInput.translationGroupId }
          : {}),
      },
    });
    const paths = createQueryPathMap(type.fields);
    const sorts = normalizeSorts(input.orderBy, paths, visibility);
    const storageOrder = toStorageOrder(sorts);
    const scope = getCursorScope(queryInput, type.id, storageOrder);
    const initialStorageAfter = input.after
      ? decodeCursor(input.after, scope)
      : undefined;
    const conditions: StorageCondition[] = [
      conditionAt("tenantId", equality(input.tenantId)),
      conditionAt("contentTypeId", equality(type.id)),
      conditionAt("deletedAt", equality(null)),
    ];
    if (queryInput.translationGroupId !== undefined) {
      if (
        typeof queryInput.translationGroupId !== "string" ||
        !queryInput.translationGroupId.trim()
      ) {
        throw new CmsValidationError([
          { path: "translationGroupId", code: "required", message: "A translation group ID is required." },
        ]);
      }
      conditions.push(
        conditionAt("translationGroupId", equality(queryInput.translationGroupId)),
      );
    }
    if (locale) {
      conditions.push(conditionAt(
        visibility === "public" ? "publishedSnapshot.locale" : "locale",
        equality(locale),
      ));
    }
    if (visibility === "public") {
      conditions.push(
        conditionAt("status", { operator: "ne", value: "archived" }),
        conditionAt("publicSlug", { operator: "ne", value: null }),
        conditionAt("publishedSnapshot.slug", { operator: "ne", value: null }),
      );
    }
    if (input.filters !== undefined && !Array.isArray(input.filters)) {
      throw new CmsValidationError([
        { path: "filters", code: "type", message: "Filters must be an array." },
      ]);
    }
    const filterFields: string[] = [];
    for (const [index, filter] of (input.filters ?? []).entries()) {
      if (!filter || typeof filter.field !== "string") {
        throw new CmsValidationError([
          { path: `filters[${index}].field`, code: "type", message: "Filter field is required." },
        ]);
      }
      conditions.push(normalizeFlatFilter(filter, index, paths, visibility));
      filterFields.push(filter.field);
    }
    if (queryInput.where) {
      for (const [index, node] of (
        Array.isArray(queryInput.where) ? queryInput.where : [queryInput.where]
      ).entries()) {
        conditions.push(
          normalizeWhereNode(node, paths, visibility, `where[${index}]`),
        );
      }
    }
    const queryFields = new Set([
      ...filterFields,
      ...collectWhereFields(queryInput.where),
      ...sorts
        .map((sort) => sort.sourceField)
        .filter((field) => field.length > 0),
    ]);
    for (const field of queryFields) {
      const resolved = resolveQueryPath(field, paths, visibility, "where.field");
      if (!resolved.schemaPath || queryableMetadata.has(resolved.schemaPath)) continue;
      const request: CmsAccessRequest = {
        tenantId: input.tenantId,
        actor: input.actor,
        resource: "entry",
        action: "field:read",
        visibility,
        fieldPath: resolved.schemaPath,
        record: { contentType: type.slug },
      };
      await this.#authorize(request);
      if (!(await this.#fieldAccessAllowed(
        input.tenantId,
        input.actor,
        type,
        resolved.schemaPath,
        "read",
        locale,
      ))) {
        await this.#recordDenied(request);
        throw new CmsPermissionDeniedError();
      }
    }
    const search = input.search?.trim();
    if (search) {
      const searchPaths = getSearchPaths(paths, visibility);
      const readableSearchPaths: string[] = [];
      for (const storagePath of searchPaths) {
        const schemaPath = storagePath
          .replace(/^publishedSnapshot\.fields\./, "")
          .replace(/^fields\./, "");
        if (
          (!storagePath.startsWith("fields.") &&
            !storagePath.startsWith("publishedSnapshot.fields.")) ||
          (await this.#isAllowed({
            tenantId: input.tenantId,
            actor: input.actor,
            resource: "entry",
            action: "field:read",
            visibility,
            fieldPath: schemaPath,
            record: { contentType: type.slug },
          })) &&
          (await this.#fieldAccessAllowed(
            input.tenantId,
            input.actor,
            type,
            schemaPath,
            "read",
            locale,
          ))
        ) {
          readableSearchPaths.push(storagePath);
        }
      }
      const searchConditions = readableSearchPaths.map((field) =>
        conditionAt(field, { operator: "contains", value: search }),
      );
      conditions.push(searchConditions.length
        ? { or: searchConditions }
        : conditionAt("id", equality("")));
    }

    const where = mergeConditions(conditions);
    const selected: Array<{
      readonly record: CmsContentEntry;
      readonly view: CmsEntryView;
      readonly pageStartAfter?: string;
      readonly pageIndex: number;
    }> = [];
    let scanAfter = initialStorageAfter;
    while (selected.length <= input.first) {
      const pageStartAfter = scanAfter;
      const page = await this.#storage.findPage<CmsContentEntry>(
        COLLECTIONS.entries,
        {
          where,
          orderBy: storageOrder,
          first: input.first + 1,
          ...(scanAfter ? { after: { value: scanAfter } } : {}),
        },
      );
      if (!page.items.length) break;
      for (const [index, entry] of page.items.entries()) {
        if (visibility === "public" && !isPublicEntry(entry)) continue;
        if (entry.deletedAt) continue;
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
        selected.push({
          record: entry,
          view: await this.#makeView(entry, type, visibility, input.actor),
          pageStartAfter,
          pageIndex: index + 1,
        });
        if (selected.length > input.first) break;
      }
      if (selected.length > input.first || !page.hasNextPage) break;
      if (!page.nextCursor) {
        throw new CmsCapabilityError("storage cursor pagination");
      }
      scanAfter = page.nextCursor.value;
    }

    const pageItems = selected.slice(0, input.first).map(({ view }) => view);
    const hasNextPage = selected.length > input.first;
    let nextCursor: string | null = null;
    if (hasNextPage) {
      const boundary = selected[input.first - 1]!;
      const boundaryPage = await this.#storage.findPage<CmsContentEntry>(
        COLLECTIONS.entries,
        {
          where,
          orderBy: storageOrder,
          first: boundary.pageIndex,
          ...(boundary.pageStartAfter
            ? { after: { value: boundary.pageStartAfter } }
            : {}),
        },
      );
      if (!boundaryPage.hasNextPage || !boundaryPage.nextCursor) {
        throw new CmsCapabilityError("storage cursor pagination");
      }
      nextCursor = createCursor(boundaryPage.nextCursor.value, scope);
    }
    return {
      items: pageItems,
      nextCursor,
      hasNextPage,
    };
  }

  async listEntryTranslations(
    input: CmsEntryTranslationsQuery,
  ): Promise<CmsEntryPage> {
    return this.listEntries(input);
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
          record: { ...revision, contentTypeSlug: type.slug },
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
    const event = await this.#storage.findOne<CmsChangeEvent>(
      COLLECTIONS.changeEvents,
      {
        where: {
          id: equality(input.eventId),
          tenantId: equality(input.tenantId),
        },
      },
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
    const operation = deleted ? "delete" : "archive";
    const currentView = await this.#makeView(current, type, "admin", input.actor);
    await this.#runBeforeChange(
      type,
      { tenantId: input.tenantId, actor: input.actor },
      operation,
      { entryId: current.id, current: currentView },
    );
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
    const view = await this.#makeView(updated, type, "admin", input.actor);
    await this.#runAfterChange(
      type,
      { tenantId: input.tenantId, actor: input.actor },
      operation,
      view,
      { fields, current: currentView },
    );
    return view;
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
    const typeFields = type.fields as readonly QueryFieldDefinition[];
    const desiredRelationshipIds = new Set([
      ...collectRelationshipIds(typeFields, entry.fields),
      ...(entry.publishedSnapshot
        ? collectRelationshipIds(typeFields, entry.publishedSnapshot.fields)
        : []),
    ]);
    const currentRelationshipIds = current
      ? new Set([
          ...collectRelationshipIds(typeFields, current.fields),
          ...(current.publishedSnapshot
            ? collectRelationshipIds(typeFields, current.publishedSnapshot.fields)
            : []),
        ])
      : new Set<string>();
    const newRelationshipIds = [...desiredRelationshipIds].filter(
      (id) => !currentRelationshipIds.has(id),
    );
    if (newRelationshipIds.length > MAX_RELATIONSHIP_GUARDS) {
      throw new CmsCapabilityError("bounded atomic relationship guard batch");
    }
    if (newRelationshipIds.length) {
      this.#requireCapabilities("conditionalWrites");
    }
    const relationshipLocks = await Promise.all(
      newRelationshipIds.map((id) =>
        this.#ensureRelationshipLock(entry.tenantId, id),
      ),
    );
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
      operations.push({
        type: "insert",
        collection: COLLECTIONS.relationshipLocks,
        record: {
          id: entry.id,
          tenantId: entry.tenantId,
          targetEntryId: entry.id,
          generation: 0,
          createdAt: entry.createdAt,
          updatedAt: entry.updatedAt,
          revision: 1,
        } as StorageInsert<CmsRelationshipLock>,
      } as StorageBatchOperation<CmsStoredRecord>);
    }
    operations.push(
      ...relationshipLocks.map((lock) => ({
        type: "update" as const,
        collection: COLLECTIONS.relationshipLocks,
        id: lock.id,
        condition: { expectedRevision: lock.revision },
        changes: {
          generation: lock.generation + 1,
        } as StorageUpdate<CmsRelationshipLock>,
      } as StorageBatchOperation<CmsStoredRecord>)),
    );
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
    const entry = await this.#storage.findOne<CmsContentEntry>(
      COLLECTIONS.entries,
      {
        where: {
          id: equality(input.entryId),
          tenantId: equality(input.tenantId),
        },
      },
    );
    if (!entry) {
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
    return this.#runtimeType(tenantId, record);
  }

  async #getTypeById(
    tenantId: string,
    id: string,
  ): Promise<CmsContentTypeRecord> {
    const type = await this.#storage.findOne<CmsContentTypeRecord>(
      COLLECTIONS.contentTypes,
      {
        where: {
          id: equality(id),
          tenantId: equality(tenantId),
        },
      },
    );
    if (!type) {
      throw new CmsNotFoundError("Content type");
    }
    this.#cacheDefinition(tenantId, type);
    return this.#runtimeType(tenantId, type);
  }

  #runtimeType(
    tenantId: string,
    record: CmsContentTypeRecord,
  ): CmsContentTypeRecord {
    const definition = this.#registry.get(tenantId, record.slug);
    return definition
      ? { ...record, fields: definition.fields }
      : record;
  }

  #collectMediaUsages(
    type: CmsContentTypeRecord,
    entry: CmsContentEntry,
    actor: CmsActor | null,
  ): readonly StorageInsert<CmsMediaUsage>[] {
    const found: StorageInsert<CmsMediaUsage>[] = [];
    const visitField = (
      field: QueryFieldDefinition,
      value: CmsValue,
      path: string,
      usageType: CmsMediaUsage["usageType"],
    ): void => {
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
      } else if (field.type === "object" && isRecord(value)) {
        visit(field.fields ?? [], value as CmsFields, usageType, path);
      } else if (field.type === "array" && Array.isArray(value) && field.of) {
        value.forEach((item, index) =>
          visitField(field.of!, item, `${path}[${index}]`, usageType),
        );
      } else if (field.type === "repeater" && Array.isArray(value)) {
        value.forEach((item, index) => {
          if (isRecord(item)) {
            visit(field.fields ?? [], item as CmsFields, usageType, `${path}[${index}]`);
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
    };
    const visit = (
      definitions: readonly QueryFieldDefinition[],
      fields: CmsFields,
      usageType: CmsMediaUsage["usageType"],
      prefix = "",
    ): void => {
      for (const field of definitions) {
        if (!Object.prototype.hasOwnProperty.call(fields, field.key)) continue;
        const path = prefix ? `${prefix}.${field.key}` : field.key;
        visitField(field, fields[field.key]!, path, usageType);
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

  #matchesDefinition(
    record: CmsContentTypeRecord,
    definition: ContentTypeDefinition,
  ): boolean {
    const serializableDefinition = {
      slug: definition.slug,
      name: definition.name,
      description: definition.description,
      version: definition.version,
      fields: serializeRuntimeFields(definition.fields),
      locales: definition.locales?.length ? definition.locales : undefined,
      defaultLocale: definition.defaultLocale,
    };
    return sameValue(this.#definition(record), serializableDefinition);
  }

  #cacheDefinition(tenantId: string, record: CmsContentTypeRecord): void {
    const current = this.#registry.get(tenantId, record.slug);
    if (current && current.version > record.version) {
      throw new CmsConflictError(
        "A newer content type schema is already cached; reload the content type.",
      );
    }
    if (current?.version === record.version) return;
    const missingCallbacks = missingRuntimeCallbacks(
      record.fields as readonly QueryFieldDefinition[],
    );
    if (missingCallbacks.length) {
      throw new CmsSchemaError(
        `Runtime field callbacks must be re-registered from code: ${missingCallbacks.join(", ")}.`,
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
    collectionOperation?: "create" | "update" | "restore",
  ): Promise<void> {
    const operation = collectionOperation ?? (record ? "update" : "create");
    for (const fieldPath of fieldPaths(type.fields, fields)) {
      const request: CmsAccessRequest = {
        tenantId,
        actor,
        resource: "entry",
        action: "field:write",
        resourceId: record?.id,
        fieldPath,
        record: record
          ? { ...record, collectionOperation: operation }
          : { contentType: type.slug, collectionOperation: operation },
      };
      await this.#authorize(request);
      if (!(await this.#fieldAccessAllowed(
        tenantId,
        actor,
        type,
        fieldPath,
        "write",
        record?.locale,
      ))) {
        await this.#recordDenied(request);
        throw new CmsPermissionDeniedError();
      }
    }
  }

  async #fieldAccessAllowed(
    tenantId: string,
    actor: CmsActor | null,
    type: CmsContentTypeRecord,
    fieldPath: string,
    operation: "read" | "write",
    locale?: string,
  ): Promise<boolean> {
    const definitions = fieldAccessPathsAt(type.fields, fieldPath);
    for (const [index, item] of definitions.entries()) {
      const access = item.definition.access?.[operation];
      if (access === false) return false;
      if (typeof access === "function") {
        try {
          if (!(await access({
            operation,
            path: index === definitions.length - 1 ? fieldPath : item.path,
            tenantId,
            contentTypeSlug: type.slug,
            locale,
            actor,
          }))) {
            return false;
          }
        } catch {
          return false;
        }
      }
    }
    return true;
  }

  async #runBeforeChange(
    type: CmsContentTypeRecord,
    context: CmsContext,
    operation: CmsCollectionHookOperation,
    input: {
      readonly entryId?: string;
      readonly fields?: CmsFields;
      readonly current?: CmsEntryView;
    } = {},
  ): Promise<void> {
    const hook = this.#collectionOptions.get(normalizeCmsSlug(type.slug))
      ?.hooks?.beforeChange;
    if (!hook) return;
    await hook(immutableClone({
      operation,
      context,
      contentType: type.slug,
      ...input,
    }));
  }

  async #runAfterChange(
    type: CmsContentTypeRecord,
    context: CmsContext,
    operation: CmsCollectionHookOperation,
    entry: CmsEntryView,
    input: {
      readonly fields?: CmsFields;
      readonly current?: CmsEntryView;
    } = {},
  ): Promise<void> {
    const hook = this.#collectionOptions.get(normalizeCmsSlug(type.slug))
      ?.hooks?.afterChange;
    if (!hook) return;
    await hook(immutableClone({
      operation,
      context,
      contentType: type.slug,
      entryId: entry.id,
      ...input,
      entry,
    }));
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
    const visitField = async (
      field: QueryFieldDefinition,
      value: CmsValue,
      path: string,
    ): Promise<void> => {
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
          const target = await this.#storage.findOne<CmsContentEntry>(
            COLLECTIONS.entries,
            {
              where: {
                id: equality(id),
                tenantId: equality(tenantId),
              },
            },
          );
          const relation = (field as CmsFieldDefinition).relation;
          const valid =
            target !== null &&
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
      } else if (field.type === "object" && isRecord(value)) {
        await visit(field.fields ?? [], value as CmsFields, path);
      } else if (field.type === "array" && Array.isArray(value) && field.of) {
        for (const [index, item] of value.entries()) {
          await visitField(field.of, item, `${path}[${index}]`);
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
            await visit(
              block.fields,
              item.fields as CmsFields,
              `${path}[${index}].fields`,
            );
          }
        }
      }
    };
    const visit = async (
      definitions: readonly QueryFieldDefinition[],
      values: CmsFields,
      prefix = "",
    ): Promise<void> => {
      for (const field of definitions) {
        if (!Object.prototype.hasOwnProperty.call(values, field.key)) continue;
        const path = prefix ? `${prefix}.${field.key}` : field.key;
        await visitField(
          field as QueryFieldDefinition,
          values[field.key]!,
          path,
        );
      }
    };
    await visit(type.fields, fields);
    if (issues.length) throw new CmsValidationError(issues);
  }

  async #assertNoIncomingRelationshipReferences(
    tenantId: string,
    target: CmsContentEntry,
  ): Promise<void> {
    const typeRecords = await this.#storage.findMany<CmsContentTypeRecord>(
      COLLECTIONS.contentTypes,
      {
        where: { tenantId: equality(tenantId) },
        orderBy: [{ field: "slug", direction: "asc" }],
        limit: MAX_PURGE_CONTENT_TYPES + 1,
      },
    );
    if (typeRecords.length > MAX_PURGE_CONTENT_TYPES) {
      throw new CmsCapabilityError("bounded schema scan for permanent deletion");
    }
    let scanned = 0;
    for (const type of typeRecords) {
      const definitions = type.fields as readonly QueryFieldDefinition[];
      if (!hasRelationshipTarget(definitions, target.contentTypeSlug)) continue;
      const inspect = async <T extends CmsContentEntry | CmsContentRevision>(
        collection: string,
        isTargetRecord: (record: T) => boolean,
      ): Promise<void> => {
        let after: string | undefined;
        while (true) {
          const page = await this.#storage.findPage<T>(collection, {
            where: {
              tenantId: equality(tenantId),
              contentTypeId: equality(type.id),
            } as unknown as StorageWhere<T>,
            orderBy: [{ field: "id", direction: "asc" } as StorageOrder<T>],
            first: PURGE_SCAN_PAGE_SIZE,
            ...(after ? { after: { value: after } } : {}),
          });
          scanned += page.items.length;
          if (scanned > MAX_PURGE_REFERENCE_SCAN) {
            throw new CmsCapabilityError("bounded relationship scan for permanent deletion");
          }
          for (const record of page.items) {
            if (isTargetRecord(record)) continue;
            const fields = await this.#migrateFields(
              type,
              record.fields,
              record.schemaVersion,
              tenantId,
            );
            if (collectRelationshipIds(definitions, fields).has(target.id)) {
              throw new CmsConflictError(
                "The entry is still referenced by other CMS content and cannot be permanently deleted.",
              );
            }
            if (record.publishedSnapshot) {
              const publishedFields = await this.#migrateFields(
                type,
                record.publishedSnapshot.fields,
                record.publishedSnapshot.schemaVersion,
                tenantId,
              );
              if (collectRelationshipIds(definitions, publishedFields).has(target.id)) {
                throw new CmsConflictError(
                  "The entry is still referenced by a published CMS snapshot and cannot be permanently deleted.",
                );
              }
            }
          }
          if (!page.hasNextPage) break;
          if (!page.nextCursor) {
            throw new CmsCapabilityError("storage cursor pagination");
          }
          after = page.nextCursor.value;
        }
      };
      await inspect<CmsContentEntry>(
        COLLECTIONS.entries,
        (entry) => entry.id === target.id,
      );
      await inspect<CmsContentRevision>(
        COLLECTIONS.revisions,
        (revision) => revision.entryId === target.id,
      );
    }
  }

  async #ensureRelationshipLock(
    tenantId: string,
    targetEntryId: string,
  ): Promise<CmsRelationshipLock> {
    const where = {
      id: equality(targetEntryId),
      tenantId: equality(tenantId),
    };
    const findLock = () =>
      this.#storage.findOne<CmsRelationshipLock>(
        COLLECTIONS.relationshipLocks,
        { where },
      );
    let lock = await findLock();
    if (!lock) {
      const target = await this.#storage.findOne<CmsContentEntry>(
        COLLECTIONS.entries,
        { where },
      );
      if (!target) throw new CmsNotFoundError("Relationship target");
      const now = this.#now();
      const candidate: StorageInsert<CmsRelationshipLock> = {
        id: targetEntryId,
        tenantId,
        targetEntryId,
        generation: 0,
        createdAt: now,
        updatedAt: now,
        revision: 1,
      };
      try {
        await this.#storage.insert(
          COLLECTIONS.relationshipLocks,
          candidate,
        );
      } catch (error) {
        if (!(error instanceof StorageDuplicateError)) throw error;
      }
      lock = await findLock();
    }

    const target = await this.#storage.findOne<CmsContentEntry>(
      COLLECTIONS.entries,
      { where },
    );
    if (!target) {
      if (lock) {
        await this.#storage.delete<CmsRelationshipLock>(
          COLLECTIONS.relationshipLocks,
          lock.id,
          { expectedRevision: lock.revision },
        );
      }
      throw new CmsNotFoundError("Relationship target");
    }
    if (!lock || lock.targetEntryId !== targetEntryId) {
      throw new CmsConflictError("The relationship integrity guard is unavailable.");
    }
    return lock;
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
    const projectedFields = await this.#projectFieldMap(
      type,
      type.fields,
      fields,
      entry.tenantId,
      actor,
      entry.locale,
    );
    const redacted = await this.#redactFields(
      entry.tenantId,
      actor,
      type,
      projectedFields,
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
    const projectedFields = await this.#projectFieldMap(
      type,
      type.fields,
      fields,
      tenantId,
      actor,
      snapshot.locale,
    );
    return {
      ...snapshot,
      fields: await this.#redactFields(
        tenantId,
        actor,
        type,
        projectedFields,
        record,
        visibility,
      ),
      schemaVersion: type.version,
    };
  }

  async #projectFieldMap(
    type: CmsContentTypeRecord,
    definitions: readonly QueryFieldDefinition[],
    source: CmsFields,
    tenantId: string,
    actor: CmsActor | null,
    locale: string,
    prefix = "",
  ): Promise<CmsFields> {
    const result: Record<string, CmsValue> = { ...source };
    for (const definition of definitions) {
      const field = definition as QueryFieldDefinition;
      const path = prefix ? `${prefix}.${field.key}` : field.key;
      if (field.type === "computed") {
        if (typeof field.compute !== "function") {
          throw new CmsSchemaError(
            `Computed field "${path}" requires its runtime callback after restart.`,
          );
        }
        let value: CmsValue;
        try {
          value = await field.compute({
            path,
            tenantId,
            contentTypeSlug: type.slug,
            locale,
            actor,
            fields: result,
          });
        } catch {
          throw new CmsValidationError([
            { path, code: "computed", message: "The computed field could not be evaluated." },
          ]);
        }
        if (!isCmsValue(value)) {
          throw new CmsValidationError([
            { path, code: "serialization", message: "Computed values must be finite JSON-compatible values." },
          ]);
        }
        await this.#validateProjectedValue(
          field,
          value,
          path,
          tenantId,
          actor,
          locale,
          type.slug,
        );
        result[field.key] = value;
        continue;
      }
      if (!Object.prototype.hasOwnProperty.call(source, field.key)) continue;
      result[field.key] = await this.#projectFieldValue(
        type,
        field,
        source[field.key]!,
        path,
        tenantId,
        actor,
        locale,
        source,
      );
    }
    return result;
  }

  async #validateProjectedValue(
    field: QueryFieldDefinition,
    value: CmsValue,
    path: string,
    tenantId: string,
    actor: CmsActor | null,
    locale: string,
    contentTypeSlug: string,
  ): Promise<void> {
    if (typeof field.validate !== "function") return;
    try {
      const message = await field.validate(value, {
        path,
        fieldPath: path,
        tenantId,
        actor,
        locale,
        contentTypeSlug,
      });
      if (typeof message === "string" && message) {
        throw new CmsValidationError([
          { path, code: "custom-validation", message },
        ]);
      }
    } catch (error) {
      if (error instanceof CmsValidationError) throw error;
      throw new CmsValidationError([
        { path, code: "custom-validation", message: "Computed field validation failed." },
      ]);
    }
  }

  async #projectFieldValue(
    type: CmsContentTypeRecord,
    field: QueryFieldDefinition,
    value: CmsValue,
    path: string,
    tenantId: string,
    actor: CmsActor | null,
    locale: string,
    parentFields: CmsFields,
  ): Promise<CmsValue> {
    if (field.type === "computed") {
      if (typeof field.compute !== "function") {
        throw new CmsSchemaError(
          `Computed field "${path}" requires its runtime callback after restart.`,
        );
      }
      let computed: CmsValue;
      try {
        computed = await field.compute({
          path,
          tenantId,
          contentTypeSlug: type.slug,
          locale,
          actor,
          fields: parentFields,
        });
      } catch {
        throw new CmsValidationError([
          { path, code: "computed", message: "The computed field could not be evaluated." },
        ]);
      }
      if (!isCmsValue(computed)) {
        throw new CmsValidationError([
          { path, code: "serialization", message: "Computed values must be finite JSON-compatible values." },
        ]);
      }
      await this.#validateProjectedValue(
        field,
        computed,
        path,
        tenantId,
        actor,
        locale,
        type.slug,
      );
      return computed;
    }
    if (field.type === "object" && isRecord(value)) {
      return this.#projectFieldMap(
        type,
        field.fields ?? [],
        value as CmsFields,
        tenantId,
        actor,
        locale,
        path,
      );
    }
    if (field.type === "array" && Array.isArray(value) && field.of) {
      return Promise.all(value.map((item, index) =>
        this.#projectFieldValue(
          type,
          field.of!,
          item,
          `${path}[${index}]`,
          tenantId,
          actor,
          locale,
          parentFields,
        ),
      ));
    }
    if (field.type === "repeater" && Array.isArray(value)) {
      return Promise.all(value.map((item, index) =>
        isRecord(item)
          ? this.#projectFieldMap(
              type,
              field.fields ?? [],
              item as CmsFields,
              tenantId,
              actor,
              locale,
              `${path}[${index}]`,
            )
          : item,
      ));
    }
    if (field.type === "blocks" && Array.isArray(value)) {
      return Promise.all(value.map(async (item, index) => {
        if (!isRecord(item) || !isRecord(item.fields)) return item;
        const block = field.blocks?.find((candidate) => candidate.type === item.type);
        if (!block) return item;
        return {
          type: block.type,
          fields: await this.#projectFieldMap(
            type,
            block.fields,
            item.fields as CmsFields,
            tenantId,
            actor,
            locale,
            `${path}[${index}].fields`,
          ),
        };
      }));
    }
    return value;
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
      definitions: readonly QueryFieldDefinition[],
      source: CmsFields,
      prefix = "",
    ): Promise<Record<string, CmsValue>> => {
      const result: Record<string, CmsValue> = {};
      for (const field of definitions) {
        if (!Object.prototype.hasOwnProperty.call(source, field.key)) continue;
        const runtime = field as QueryFieldDefinition;
        const path = prefix ? `${prefix}.${field.key}` : field.key;
        const recordLocale = isRecord(record) && typeof record.locale === "string"
          ? record.locale
          : undefined;
        const allowed = await this.#isAllowed({
          tenantId,
          actor,
          resource: "entry",
          action: "field:read",
          visibility,
          fieldPath: path,
          record,
        });
        if (
          !allowed ||
          !(await this.#fieldAccessAllowed(
            tenantId,
            actor,
            type,
            path,
            "read",
            recordLocale,
          ))
        ) continue;
        const value = source[field.key];
        if (value === undefined) continue;
        if (runtime.type === "object" && isRecord(value)) {
          result[field.key] = await redact(
            runtime.fields ?? [],
            value as CmsFields,
            path,
          );
        } else if (
          runtime.type === "array" &&
          runtime.of?.type === "object" &&
          Array.isArray(value)
        ) {
          const rows: CmsValue[] = [];
          for (const [index, item] of value.entries()) {
            rows.push(
              isRecord(item)
                ? await redact(
                    runtime.of.fields ?? [],
                    item as CmsFields,
                    `${path}[${index}]`,
                  )
                : item,
            );
          }
          result[field.key] = rows;
        } else if (runtime.type === "repeater" && Array.isArray(value)) {
          const rows: CmsValue[] = [];
          for (const [index, item] of value.entries()) {
            rows.push(
              isRecord(item)
                ? await redact(runtime.fields ?? [], item as CmsFields, `${path}[${index}]`)
                : item,
            );
          }
          result[field.key] = rows;
        } else if (runtime.type === "blocks" && Array.isArray(value)) {
          const blocks: CmsValue[] = [];
          for (const [index, item] of value.entries()) {
            if (!isRecord(item) || !isRecord(item.fields)) {
              blocks.push(item);
              continue;
            }
            const block = runtime.blocks?.find((candidate) => candidate.type === item.type);
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

  #draftsEnabled(type: CmsContentTypeRecord): boolean {
    return this.#collectionOptions.get(normalizeCmsSlug(type.slug))?.drafts ?? true;
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
      if ((await this.#accessPolicy(request)) !== true) return false;
      if (request.resource === "contentType" || !isRecord(request.record)) {
        return true;
      }
      const contentTypeSlug =
        typeof request.record.contentTypeSlug === "string"
          ? request.record.contentTypeSlug
          : typeof request.record.contentType === "string"
            ? request.record.contentType
            : undefined;
      let resolvedContentTypeSlug = contentTypeSlug;
      if (!resolvedContentTypeSlug && request.resource === "mediaUsage") {
        if (typeof request.record.contentTypeId !== "string") return false;
        const type = await this.#storage.findOne<CmsContentTypeRecord>(
          COLLECTIONS.contentTypes,
          {
            where: {
              id: equality(request.record.contentTypeId),
              tenantId: equality(request.tenantId),
            },
          },
        );
        if (!type) return false;
        resolvedContentTypeSlug = type.slug;
      }
      if (!resolvedContentTypeSlug) return true;
      const collectionAccess = this.#collectionOptions.get(
        normalizeCmsSlug(resolvedContentTypeSlug),
      )?.access;
      if (collectionAccess === undefined) return true;
      const accessMap = collectionAccess as Readonly<Record<string, unknown>>;
      const friendlyAction = collectionAccessAlias(request);
      const action = friendlyAction && Object.hasOwn(accessMap, friendlyAction)
        ? friendlyAction
        : request.action;
      const policy = accessMap[action] as CmsCollectionAccessPolicy | undefined;
      return typeof policy === "function" &&
        (await policy({
          ...request,
          action: action as CmsAccessAction | CollectionAccessAction,
          user: request.actor,
        })) === true;
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
      this.#storage.registerCollection<CmsRelationshipLock>(
        addIndexes<CmsRelationshipLock>(COLLECTIONS.relationshipLocks, []),
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
