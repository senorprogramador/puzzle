import type { StorageRecord } from "@puzzle-ui/storage";

export const CMS_FIELD_TYPES = [
  "text",
  "textarea",
  "richText",
  "number",
  "boolean",
  "date",
  "datetime",
  "slug",
  "select",
  "multiSelect",
  "media",
  "relationship",
  "repeater",
  "blocks",
  "json",
  "locale",
] as const;

export type CmsFieldType = (typeof CMS_FIELD_TYPES)[number];
export type CmsScalar = string | number | boolean | null;
export type CmsValue =
  | CmsScalar
  | readonly CmsValue[]
  | { readonly [key: string]: CmsValue };
export type CmsFields = Readonly<Record<string, CmsValue>>;
export type CmsEntryStatus = "draft" | "published" | "scheduled" | "archived";
export type CmsVisibility = "admin" | "public";

export type CmsSelectOption = {
  readonly label: string;
  readonly value: string | number | boolean;
};

export type CmsFieldValidation = {
  readonly min?: number;
  readonly max?: number;
  readonly pattern?: string;
  readonly allowedValues?: readonly CmsScalar[];
};

export type CmsRelationshipConfig = {
  readonly targetTypes: readonly string[];
  readonly multiple?: boolean;
  readonly sameLocale?: boolean;
  readonly allowedStatuses?: readonly CmsEntryStatus[];
};

export type CmsBlockDefinition = {
  readonly type: string;
  readonly fields: readonly CmsFieldDefinition[];
};

export type CmsFieldDefinition = {
  readonly key: string;
  readonly type: CmsFieldType;
  readonly label: string;
  readonly required?: boolean;
  readonly localized?: boolean;
  readonly defaultValue?: CmsValue;
  readonly validation?: CmsFieldValidation;
  readonly options?: readonly CmsSelectOption[];
  readonly relation?: CmsRelationshipConfig;
  readonly fields?: readonly CmsFieldDefinition[];
  readonly blocks?: readonly CmsBlockDefinition[];
  readonly customValidators?: readonly string[];
};

export type ContentTypeDefinition = {
  readonly slug: string;
  readonly name: string;
  readonly description?: string;
  readonly version: number;
  readonly fields: readonly CmsFieldDefinition[];
  readonly locales?: readonly string[];
  readonly defaultLocale?: string;
};

export type CmsActor = {
  readonly id: string;
  readonly attributes?: Readonly<Record<string, CmsValue>>;
};

export type CmsAccessAction =
  | "content-type:register"
  | "content-type:read"
  | "entry:create"
  | "entry:read"
  | "entry:update"
  | "entry:delete"
  | "entry:publish"
  | "entry:unpublish"
  | "entry:schedule"
  | "entry:unschedule"
  | "entry:archive"
  | "entry:restore"
  | "revision:read"
  | "audit:read"
  | "change-event:read"
  | "change-event:ack"
  | "webhook:read"
  | "webhook:manage"
  | "webhook:dispatch"
  | "media:usage-read"
  | "field:read"
  | "field:write";

export type CmsResourceType =
  | "contentType"
  | "entry"
  | "revision"
  | "audit"
  | "changeEvent"
  | "webhook"
  | "mediaUsage";

export type CmsAccessRequest = {
  readonly tenantId: string;
  readonly actor: CmsActor | null;
  readonly resource: CmsResourceType;
  readonly action: CmsAccessAction;
  readonly visibility?: CmsVisibility;
  readonly resourceId?: string;
  readonly fieldPath?: string;
  readonly record?: unknown;
};

export type CmsAccessPolicy = (
  request: CmsAccessRequest,
) => boolean | Promise<boolean>;

export type CmsEntryFilterOperator =
  | "eq"
  | "ne"
  | "in"
  | "notIn"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "exists";

export type CmsEntryFilter = {
  readonly field: string;
  readonly operator: CmsEntryFilterOperator;
  readonly value: CmsValue | readonly CmsValue[];
};

export type CmsEntrySort = {
  readonly field: string;
  readonly direction: "asc" | "desc";
};

export type CmsPublishedSnapshot = {
  readonly revisionNumber: number;
  readonly entryRevision: number;
  readonly schemaVersion: number;
  readonly slug: string;
  readonly locale: string;
  readonly fields: CmsFields;
  readonly publishedAt: Date;
  readonly publishedBy: string | null;
};

export type CmsContentTypeRecord = StorageRecord & {
  readonly tenantId: string;
  readonly slug: string;
  readonly name: string;
  readonly description?: string;
  readonly version: number;
  readonly fields: readonly CmsFieldDefinition[];
  readonly locales: readonly string[];
  readonly defaultLocale?: string;
  readonly requiresMigrationFromVersions: readonly number[];
};

export type CmsContentEntry = StorageRecord & {
  readonly tenantId: string;
  readonly contentTypeId: string;
  readonly contentTypeSlug: string;
  readonly translationGroupId: string;
  readonly locale: string;
  readonly slug: string;
  readonly publicSlug: string | null;
  readonly publicSlugKey: string;
  readonly fields: CmsFields;
  readonly schemaVersion: number;
  readonly revisionNumber: number;
  readonly status: CmsEntryStatus;
  readonly publishedSnapshot: CmsPublishedSnapshot | null;
  readonly scheduledAt: Date | null;
  readonly scheduledTimeZone: string | null;
  readonly scheduledRevisionNumber: number | null;
  readonly archivedAt: Date | null;
  readonly deletedAt: Date | null;
  readonly createdBy: string | null;
  readonly updatedBy: string | null;
};

export type CmsEntryView = CmsContentEntry & {
  readonly resolvedLocale: string;
};

export type CmsRevisionAction =
  | "create"
  | "save-draft"
  | "publish"
  | "unpublish"
  | "schedule"
  | "unschedule"
  | "archive"
  | "delete"
  | "restore"
  | "scheduled-publish";

export type CmsContentRevision = StorageRecord & {
  readonly tenantId: string;
  readonly contentTypeId: string;
  readonly entryId: string;
  readonly locale: string;
  readonly revisionNumber: number;
  readonly schemaVersion: number;
  readonly slug: string;
  readonly fields: CmsFields;
  readonly status: CmsEntryStatus;
  readonly publishedSnapshot: CmsPublishedSnapshot | null;
  readonly scheduledAt: Date | null;
  readonly scheduledTimeZone: string | null;
  readonly action: CmsRevisionAction;
  readonly actorId: string | null;
  readonly changeSummary?: string;
};

export type CmsAuditResult = "success" | "denied";

export type CmsAuditEvent = StorageRecord & {
  readonly tenantId: string;
  readonly actorId: string | null;
  readonly resource: CmsResourceType;
  readonly resourceId: string;
  readonly action: string;
  readonly result: CmsAuditResult;
  readonly timestamp: Date;
  readonly revisionNumber?: number;
  readonly details?: Readonly<Record<string, CmsValue>>;
};

export type CmsChangeEvent = StorageRecord & {
  readonly tenantId: string;
  readonly resource: "contentType" | "entry";
  readonly resourceId: string;
  readonly action: string;
  readonly occurredAt: Date;
  readonly revisionNumber?: number;
  readonly fanoutLeaseUntil?: Date | null;
};

export type CmsChangeEventPage = {
  readonly items: readonly CmsChangeEvent[];
  readonly nextCursor: string | null;
  readonly hasNextPage: boolean;
};

export type CmsMediaUsage = StorageRecord & {
  readonly tenantId: string;
  readonly assetId: string;
  readonly contentTypeId: string;
  readonly entryId: string;
  readonly locale: string;
  readonly fieldPath: string;
  readonly usageType: "draft" | "published";
  readonly createdBy: string | null;
};

export type CmsScheduledPublication = {
  readonly id: string;
  readonly tenantId: string;
  readonly entryId: string;
  readonly scheduledRevisionNumber: number;
  readonly publishAt: Date;
  readonly timeZone: string;
};

export interface CmsScheduler {
  schedule(publication: CmsScheduledPublication): Promise<void>;
  cancel(publication: CmsScheduledPublication): Promise<void>;
}

export type CmsMediaReferenceRequest = {
  readonly tenantId: string;
  readonly assetId: string;
  readonly actor: CmsActor | null;
  readonly contentTypeSlug: string;
  readonly entryId?: string;
  readonly fieldPath: string;
};

export interface CmsMediaReferenceValidator {
  assertCanReference(request: CmsMediaReferenceRequest): Promise<void>;
}

export type CmsFieldValidationContext = {
  readonly tenantId: string;
  readonly contentTypeSlug: string;
  readonly locale: string;
  readonly fieldPath: string;
  readonly actor: CmsActor | null;
};

export type CmsCustomFieldValidator = (
  value: CmsValue,
  context: CmsFieldValidationContext,
) => string | null | void | Promise<string | null | void>;

export type CmsSchemaMigration = {
  readonly contentTypeSlug: string;
  readonly tenantId?: string;
  readonly fromVersion: number;
  readonly toVersion: number;
  readonly migrate: (fields: CmsFields) => CmsFields | Promise<CmsFields>;
};

export type CmsEntryQuery = {
  readonly tenantId: string;
  readonly actor: CmsActor | null;
  readonly contentType: string;
  readonly locale?: string;
  readonly visibility: CmsVisibility;
  readonly search?: string;
  readonly filters?: readonly CmsEntryFilter[];
  readonly orderBy?: readonly CmsEntrySort[];
  readonly first: number;
  readonly after?: string;
};

export type CmsEntryPage = {
  readonly items: readonly CmsEntryView[];
  readonly nextCursor: string | null;
  readonly hasNextPage: boolean;
};

export type CmsContext = {
  readonly tenantId: string;
  readonly actor: CmsActor | null;
};

export type CmsRegisterContentTypeInput = CmsContext & {
  readonly definition: ContentTypeDefinition;
  readonly expectedRevision?: number;
  readonly migration?: CmsSchemaMigration;
};

export type CmsCreateEntryInput = CmsContext & {
  readonly contentType: string;
  readonly locale: string;
  readonly slug?: string;
  readonly fields: CmsFields;
  readonly translationGroupId?: string;
  readonly changeSummary?: string;
};

export type CmsUpdateEntryInput = CmsContext & {
  readonly entryId: string;
  readonly expectedRevision: number;
  readonly fields: CmsFields;
  readonly slug?: string;
  readonly changeSummary?: string;
};

export type CmsEntryMutationInput = CmsContext & {
  readonly entryId: string;
  readonly expectedRevision: number;
  readonly changeSummary?: string;
};

export type CmsScheduleEntryInput = CmsEntryMutationInput & {
  readonly publishAt: Date;
  readonly timeZone: string;
};

export type CmsRestoreRevisionInput = CmsEntryMutationInput & {
  readonly revisionId: string;
};

export type CmsGetEntryInput = CmsContext & {
  readonly entryId: string;
  readonly visibility: CmsVisibility;
};

export type CmsFindEntryInput = CmsContext & {
  readonly contentType: string;
  readonly locale: string;
  readonly slug: string;
  readonly fallbackLocales?: readonly string[];
  readonly visibility: CmsVisibility;
};
