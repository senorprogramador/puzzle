import type {
  CmsAuditEvent,
  CmsContentEntry,
  CmsContentRevision,
  CmsContentTypeRecord,
  CmsCreateEntryInput,
  CmsEntryMutationInput,
  CmsEntryPage,
  CmsEntryQuery,
  CmsEntryView,
  CmsErrorCode,
  CmsFields,
  CmsFindEntryInput,
  CmsListAuditEventsInput,
  CmsListContentTypesInput,
  CmsListMediaUsagesInput,
  CmsListRevisionsInput,
  CmsMediaUsage,
  CmsRegisterContentTypeInput,
  CmsRestoreRevisionInput,
  CmsScheduleEntryInput,
  CmsScheduledPublication,
  CmsUpdateEntryInput,
  CmsValidationIssue,
  CmsValue,
  CmsWebhookAttempt,
  CmsWebhookDelivery,
  CmsWebhookEventType,
  CmsWebhookSubscription,
  ContentTypeDefinition,
} from "@puzzle-ui/cms";

export type CmsApiDate = string;

export type CmsApiContentType = Omit<
  CmsContentTypeRecord,
  "createdAt" | "updatedAt"
> & {
  readonly createdAt: CmsApiDate;
  readonly updatedAt: CmsApiDate;
};

export type CmsApiPublishedSnapshot = Omit<
  NonNullable<CmsContentEntry["publishedSnapshot"]>,
  "publishedAt"
> & {
  readonly publishedAt: CmsApiDate;
};

export type CmsApiAdminEntry = Omit<
  CmsEntryView,
  | "createdAt"
  | "updatedAt"
  | "scheduledAt"
  | "archivedAt"
  | "deletedAt"
  | "publishedSnapshot"
> & {
  readonly createdAt: CmsApiDate;
  readonly updatedAt: CmsApiDate;
  readonly scheduledAt: CmsApiDate | null;
  readonly archivedAt: CmsApiDate | null;
  readonly deletedAt: CmsApiDate | null;
  readonly publishedSnapshot: CmsApiPublishedSnapshot | null;
};

export type CmsPublishedEntry = {
  readonly id: string;
  readonly contentType: string;
  readonly locale: string;
  readonly slug: string;
  readonly revision: number;
  readonly schemaVersion: number;
  readonly fields: CmsFields;
  readonly publishedAt: CmsApiDate;
};

export type CmsApiEntryPage = Omit<CmsEntryPage, "items"> & {
  readonly items: readonly CmsApiAdminEntry[];
};

export type CmsPublishedEntryPage = Omit<CmsEntryPage, "items"> & {
  readonly items: readonly CmsPublishedEntry[];
};

export type CmsApiRevision = Omit<
  CmsContentRevision,
  "createdAt" | "updatedAt" | "publishedSnapshot"
> & {
  readonly createdAt: CmsApiDate;
  readonly updatedAt: CmsApiDate;
  readonly publishedSnapshot: CmsApiPublishedSnapshot | null;
};

export type CmsApiAuditEvent = Omit<
  CmsAuditEvent,
  "createdAt" | "updatedAt" | "timestamp"
> & {
  readonly createdAt: CmsApiDate;
  readonly updatedAt: CmsApiDate;
  readonly timestamp: CmsApiDate;
};

export type CmsApiWebhookSubscription = Omit<
  CmsWebhookSubscription,
  "tenantId" | "secretRef" | "createdAt" | "updatedAt"
> & {
  readonly secretConfigured: true;
  readonly createdAt: CmsApiDate;
  readonly updatedAt: CmsApiDate;
};

export type CmsApiWebhookDelivery = Omit<
  CmsWebhookDelivery,
  "tenantId" | "leaseToken" | "createdAt" | "updatedAt" | "nextAttemptAt" | "event"
> & {
  readonly event: Omit<CmsWebhookDelivery["event"], "occurredAt"> & { readonly occurredAt: CmsApiDate };
  readonly createdAt: CmsApiDate;
  readonly updatedAt: CmsApiDate;
  readonly nextAttemptAt: CmsApiDate;
};

export type CmsApiWebhookAttempt = Omit<
  CmsWebhookAttempt,
  "tenantId" | "createdAt" | "updatedAt" | "startedAt" | "completedAt"
> & {
  readonly createdAt: CmsApiDate;
  readonly updatedAt: CmsApiDate;
  readonly startedAt: CmsApiDate;
  readonly completedAt: CmsApiDate;
};

export type CmsApiWebhookSubscriptionInput = {
  readonly endpoint: string;
  readonly events: readonly CmsWebhookEventType[];
  readonly enabled: boolean;
};

export type CmsApiWebhookSubscriptionUpdateInput = CmsApiWebhookSubscriptionInput & {
  readonly expectedRevision: number;
  readonly rotateSecret?: boolean;
};

export type CmsApiMediaUsage = Omit<
  CmsMediaUsage,
  "createdAt" | "updatedAt"
> & {
  readonly createdAt: CmsApiDate;
  readonly updatedAt: CmsApiDate;
};

export type CmsApiRegisterContentTypeInput = Omit<
  CmsRegisterContentTypeInput,
  "tenantId" | "actor" | "migration"
>;

export type CmsApiCreateEntryInput = Omit<
  CmsCreateEntryInput,
  "tenantId" | "actor"
>;

export type CmsApiUpdateEntryInput = Omit<
  CmsUpdateEntryInput,
  "tenantId" | "actor" | "entryId"
>;

export type CmsApiEntryMutationInput = Omit<
  CmsEntryMutationInput,
  "tenantId" | "actor" | "entryId"
>;

export type CmsApiScheduleEntryInput = Omit<
  CmsScheduleEntryInput,
  "tenantId" | "actor" | "entryId" | "publishAt"
> & {
  readonly publishAt: CmsApiDate;
};

export type CmsApiRestoreRevisionInput = Omit<
  CmsRestoreRevisionInput,
  "tenantId" | "actor" | "entryId"
>;

export type CmsApiEntryQuery = Omit<
  CmsEntryQuery,
  "tenantId" | "actor" | "visibility"
>;

export type CmsApiFindPublishedInput = Omit<
  CmsFindEntryInput,
  "tenantId" | "actor" | "visibility"
>;

export type CmsApiListContentTypesInput = Omit<
  CmsListContentTypesInput,
  "tenantId" | "actor"
>;

export type CmsApiListRevisionsInput = Omit<
  CmsListRevisionsInput,
  "tenantId" | "actor"
>;

export type CmsApiListAuditEventsInput = Omit<
  CmsListAuditEventsInput,
  "tenantId" | "actor"
>;

export type CmsApiListMediaUsagesInput = Omit<
  CmsListMediaUsagesInput,
  "tenantId" | "actor"
>;

export type CmsApiPublication = Omit<
  CmsScheduledPublication,
  "publishAt" | "tenantId" | "id"
> & {
  readonly publishAt: CmsApiDate;
};

export type CmsRelationshipLookupInput = {
  readonly contentType: string;
  readonly fieldPath: string;
  readonly locale?: string;
  readonly first?: number;
  readonly search?: string;
};

export type CmsRelationshipOption = {
  readonly contentType: string;
  readonly entry: CmsApiAdminEntry;
};

export type CmsRelationshipLookupResult = {
  readonly targetTypes: readonly string[];
  readonly items: readonly CmsRelationshipOption[];
};

export type CmsApiErrorCode =
  | CmsErrorCode
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "INVALID_REQUEST"
  | "INTERNAL";

export type CmsApiError = {
  readonly error: {
    readonly code: CmsApiErrorCode;
    readonly message: string;
    readonly issues?: readonly CmsValidationIssue[];
  };
};

export type CmsInvalidationKey =
  | { readonly type: "content-types" }
  | {
      readonly type: "admin-entries";
      readonly contentType?: string;
      readonly locale?: string;
      readonly entryId?: string;
    }
  | {
      readonly type: "public-entries";
      readonly contentType?: string;
      readonly locale?: string;
      readonly slug?: string;
      readonly entryId?: string;
    }
  | { readonly type: "revisions"; readonly entryId: string }
  | { readonly type: "audit"; readonly resourceId?: string }
  | { readonly type: "webhook-subscriptions"; readonly subscriptionId?: string }
  | { readonly type: "webhook-deliveries"; readonly subscriptionId?: string; readonly deliveryId?: string }
  | {
      readonly type: "relationships";
      readonly contentType: string;
      readonly fieldPath: string;
    };

export type CmsQueryInvalidator = (
  keys: readonly CmsInvalidationKey[],
) => void | Promise<void>;

export type {
  CmsFields,
  CmsValue,
  ContentTypeDefinition,
};
