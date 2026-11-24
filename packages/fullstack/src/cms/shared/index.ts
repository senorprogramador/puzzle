export type CmsApiValue =
  | null
  | boolean
  | number
  | string
  | readonly CmsApiValue[]
  | { readonly [key: string]: CmsApiValue };

export type CmsApiRecord = Readonly<Record<string, CmsApiValue>>;

export type CmsApiDocument = CmsApiRecord & {
  readonly id: string;
  readonly slug?: string;
  readonly locale?: string;
  readonly status?: string;
  readonly publishedAt?: string | null;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly revision?: number;
  readonly revisionNumber?: number;
  readonly scheduledAt?: string | null;
  readonly scheduledTimeZone?: string | null;
  readonly scheduledRevisionNumber?: number | null;
  readonly archivedAt?: string | null;
  readonly deletedAt?: string | null;
};

export type CmsApiPage<TDocument extends CmsApiDocument = CmsApiDocument> = {
  readonly items: readonly TDocument[];
  readonly nextCursor: string | null;
  readonly hasNextPage: boolean;
  readonly page?: number;
  readonly limit?: number;
};

export type CmsApiWhereCondition = {
  readonly equals?: CmsApiValue;
  readonly notEquals?: CmsApiValue;
  readonly contains?: CmsApiValue;
  readonly in?: readonly CmsApiValue[];
  readonly notIn?: readonly CmsApiValue[];
  readonly gt?: CmsApiValue;
  readonly gte?: CmsApiValue;
  readonly lt?: CmsApiValue;
  readonly lte?: CmsApiValue;
  readonly greaterThan?: CmsApiValue;
  readonly greaterThanOrEqual?: CmsApiValue;
  readonly lessThan?: CmsApiValue;
  readonly lessThanOrEqual?: CmsApiValue;
  readonly exists?: boolean;
};

export type CmsApiWhere = Readonly<
  Record<string, CmsApiWhereCondition | readonly CmsApiWhere[] | undefined>
>;

export type CmsApiQueryInput = {
  readonly where?: CmsApiWhere;
  readonly sort?: string;
  readonly limit?: number;
  readonly page?: number;
  readonly after?: string;
  readonly locale?: string;
};

export type CmsApiSlugInput = {
  readonly locale?: string;
  readonly fallbackLocales?: readonly string[];
};

export type CmsApiCreateOptions = {
  readonly slug?: string;
  readonly locale?: string;
  readonly translationGroupId?: string;
  readonly changeSummary?: string;
};

export type CmsApiSingletonCreateOptions = {
  readonly locale?: string;
  readonly translationGroupId?: string;
  readonly changeSummary?: string;
};

export type CmsApiTranslationCreateOptions = {
  readonly slug?: string;
  readonly locale: string;
  readonly changeSummary?: string;
};

export type CmsApiUpdateOptions = {
  readonly expectedRevision: number;
  readonly changeSummary?: string;
  readonly slug?: string;
};

export type CmsApiMutationInput = {
  readonly expectedRevision: number;
  readonly changeSummary?: string;
};

export type CmsApiScheduleInput = CmsApiMutationInput & {
  readonly publishAt: string;
  readonly timeZone: string;
};

export type CmsApiRestoreRevisionInput = CmsApiMutationInput & {
  readonly revisionId: string;
};

export type CmsApiScheduledPublicationResult =
  | { readonly published: true; readonly entry: CmsApiDocument }
  | {
      readonly published: false;
      readonly reason: "stale" | "not-due";
    };

export type CmsApiPublishedSnapshot = {
  readonly revisionNumber: number;
  readonly entryRevision: number;
  readonly schemaVersion: number;
  readonly slug: string;
  readonly locale: string;
  readonly fields: CmsApiRecord;
  readonly publishedAt: string;
  readonly publishedBy: string | null;
};

export type CmsApiRevision = {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly revision: number;
  readonly contentTypeId: string;
  readonly entryId: string;
  readonly locale: string;
  readonly revisionNumber: number;
  readonly schemaVersion: number;
  readonly slug: string;
  readonly fields: CmsApiRecord;
  readonly status: string;
  readonly publishedSnapshot: CmsApiPublishedSnapshot | null;
  readonly scheduledAt: string | null;
  readonly scheduledTimeZone: string | null;
  readonly action: string;
  readonly actorId: string | null;
  readonly changeSummary?: string;
};

export type CmsApiErrorCode =
  | "VALIDATION"
  | "SCHEMA"
  | "NOT_FOUND"
  | "CONFLICT"
  | "DUPLICATE"
  | "PERMISSION_DENIED"
  | "CAPABILITY"
  | "SCHEDULER"
  | "AUDIT"
  | "INTERNAL"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "INVALID_REQUEST";

export type CmsApiError = {
  readonly error: {
    readonly code: CmsApiErrorCode;
    readonly message: string;
    readonly issues?: readonly {
      readonly path: string;
      readonly code: string;
      readonly message: string;
    }[];
  };
};

export type CmsApiWebhookEventType =
  | "content-type:create"
  | "content-type:update"
  | "entry:create"
  | "entry:save-draft"
  | "entry:publish"
  | "entry:unpublish"
  | "entry:schedule"
  | "entry:unschedule"
  | "entry:archive"
  | "entry:delete"
  | "entry:restore"
  | "entry:scheduled-publish";

export type CmsApiWebhookSubscription = {
  readonly id: string;
  readonly endpoint: string;
  readonly events: readonly CmsApiWebhookEventType[];
  readonly enabled: boolean;
  readonly revision: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly secretConfigured: true;
};

export type CmsApiWebhookSubscriptionInput = {
  readonly endpoint: string;
  readonly events: readonly CmsApiWebhookEventType[];
  readonly enabled: boolean;
};

export type CmsApiWebhookSubscriptionUpdateInput =
  CmsApiWebhookSubscriptionInput & {
    readonly expectedRevision: number;
    readonly rotateSecret?: boolean;
  };

export type CmsApiWebhookDelivery = {
  readonly id: string;
  readonly eventId: string;
  readonly subscriptionId: string;
  readonly event: {
    readonly resource: string;
    readonly resourceId: string;
    readonly action: string;
    readonly occurredAt: string;
    readonly revisionNumber?: number;
  };
  readonly status: "pending" | "delivering" | "delivered" | "failed" | "cancelled";
  readonly attempts: number;
  readonly cycleAttempts: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly nextAttemptAt: string;
  readonly lastStatus: number | null;
  readonly lastFailure:
    | "transport"
    | "secret"
    | "http"
    | "invalid-response"
    | "lease-expired"
    | "disabled"
    | null;
  readonly revision: number;
};

export type CmsApiWebhookAttempt = {
  readonly id: string;
  readonly deliveryId: string;
  readonly number: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly startedAt: string;
  readonly completedAt: string;
  readonly status: number | null;
  readonly failure: CmsApiWebhookDelivery["lastFailure"];
  readonly revision: number;
};

export type CmsApiChangeEvent = {
  readonly id: string;
  readonly resource: string;
  readonly resourceId: string;
  readonly action: string;
  readonly occurredAt: string;
  readonly revisionNumber?: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly revision: number;
};

export type CmsApiChangeEventPage = {
  readonly items: readonly CmsApiChangeEvent[];
  readonly nextCursor: string | null;
  readonly hasNextPage: boolean;
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
  | { readonly type: "webhook-subscriptions"; readonly subscriptionId?: string }
  | {
      readonly type: "webhook-deliveries";
      readonly subscriptionId?: string;
      readonly deliveryId?: string;
    }
  | { readonly type: "audit"; readonly resourceId?: string }
  | { readonly type: "change-events" }
  | {
      readonly type: "relationships";
      readonly contentType: string;
      readonly fieldPath: string;
    };

export type CmsQueryInvalidator = (
  keys: readonly CmsInvalidationKey[],
) => void | Promise<void>;
