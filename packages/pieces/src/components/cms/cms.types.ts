import type {
  CmsAuditEvent,
  CmsContentRevision,
  CmsEntryStatus,
  CmsEntryView,
  CmsFields,
  CmsValue,
  CmsWebhookEventType,
  CmsCollectionPresentation as PublicCmsCollectionPresentation,
  CollectionKind,
  FieldDescriptor,
  FieldMap,
  FieldValue,
  FieldsValue,
} from "@puzzle-ui/cms";
import type { ReactNode } from "react";
import type { BreadcrumbsProps } from "@puzzle-ui/ui";

export type CmsNavigationItem = {
  readonly id: string;
  readonly label: ReactNode;
  readonly href: string;
};

export type CmsEntryListItem = Pick<
  CmsEntryView,
  | "id"
  | "revision"
  | "slug"
  | "locale"
  | "status"
  | "fields"
  | "revisionNumber"
> & {
  readonly updatedAt: Date | string;
};

export type CmsRevisionItem = Pick<
  CmsContentRevision,
  | "id"
  | "revisionNumber"
  | "schemaVersion"
  | "slug"
  | "fields"
  | "status"
  | "action"
  | "actorId"
  | "changeSummary"
> & {
  readonly createdAt: Date | string;
};

export type CmsAuditLogItem = Pick<
  CmsAuditEvent,
  "id" | "actorId" | "resourceId" | "action"
> & {
  readonly resource: CmsAuditEvent["resource"] | "upload" | "asset" | "folder";
  readonly result: CmsAuditEvent["result"] | "failure";
  readonly timestamp: Date | string;
};

export type WebhookSubscriptionItem = {
  readonly id: string;
  readonly revision: number;
  readonly endpoint: string;
  readonly events: readonly CmsWebhookEventType[];
  readonly enabled: boolean;
  readonly secretConfigured: boolean;
};

export type WebhookDeliveryItem = {
  readonly id: string;
  readonly revision: number;
  readonly status: "pending" | "delivering" | "delivered" | "failed" | "cancelled";
  readonly attempts: number;
  readonly lastStatus: number | null;
  readonly lastFailure: string | null;
  readonly createdAt: Date | string;
};

export type WebhookAttemptItem = {
  readonly id: string;
  readonly number: number;
  readonly status: number | null;
  readonly failure: string | null;
  readonly completedAt: Date | string;
};

export type WebhookSubscriptionValues = {
  readonly endpoint: string;
  readonly events: readonly CmsWebhookEventType[];
  readonly enabled: boolean;
};

export type WebhookManagementProps = {
  readonly subscriptions: readonly WebhookSubscriptionItem[];
  readonly eventTypes: readonly CmsWebhookEventType[];
  readonly deliveries: readonly WebhookDeliveryItem[];
  readonly deliverySubscriptionId?: string;
  readonly attemptsByDelivery?: Readonly<Record<string, readonly WebhookAttemptItem[]>>;
  readonly onSelectSubscription: (subscriptionId: string) => void | Promise<void>;
  readonly onCreate: (values: WebhookSubscriptionValues) => WebhookSubscriptionItem | Promise<WebhookSubscriptionItem>;
  readonly onUpdate: (
    subscriptionId: string,
    values: WebhookSubscriptionValues & { readonly expectedRevision: number; readonly rotateSecret: boolean },
  ) => WebhookSubscriptionItem | Promise<WebhookSubscriptionItem>;
  readonly onRetry: (deliveryId: string, expectedRevision: number) => void | Promise<void>;
  readonly onRequestAttempts?: (deliveryId: string) => void | Promise<void>;
  readonly onDirtyChange?: (dirty: boolean) => void;
  readonly loading?: boolean;
  readonly error?: ReactNode;
  readonly className?: string;
};

export type CmsShellProps = {
  readonly children: ReactNode;
  readonly title: ReactNode;
  readonly description?: ReactNode;
  readonly navigation: readonly CmsNavigationItem[];
  readonly activeNavigationId?: string;
  readonly breadcrumbs?: BreadcrumbsProps["items"];
  readonly topbar?: ReactNode;
  readonly actions?: ReactNode;
  readonly className?: string;
};

export type ContentListQuery = {
  readonly search: string;
  readonly status: CmsEntryStatus | "all";
  readonly locale: string;
};

export type ContentListRemote = {
  readonly query: ContentListQuery;
  readonly onQueryChange: (query: ContentListQuery) => void;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;
  readonly onPreviousPage: () => void;
  readonly onNextPage: () => void;
  readonly totalCount?: number;
};

export type ContentListBulkAction = {
  readonly id: string;
  readonly label: string;
};

export type ContentListBulkResult = {
  readonly succeededIds: readonly string[];
  readonly failures: readonly { readonly entryId: string; readonly message?: string }[];
};

export type ContentListSelection = {
  readonly selectedIds: readonly string[];
  readonly onSelectionChange: (ids: string[]) => void;
  readonly actions?: readonly ContentListBulkAction[];
  readonly onBulkAction?: (
    ids: string[],
    actionId: string,
  ) => ContentListBulkResult | Promise<ContentListBulkResult>;
};

export type ContentListProps = {
  readonly items: readonly CmsEntryListItem[];
  readonly title?: ReactNode;
  readonly contentTypeName?: string;
  readonly locales?: readonly string[];
  readonly loading?: boolean;
  readonly error?: ReactNode;
  readonly permissionDenied?: boolean;
  readonly onCreate?: () => void;
  readonly onEdit?: (entry: CmsEntryListItem) => void;
  readonly onDuplicate?: (entry: CmsEntryListItem) => void;
  readonly onArchive?: (entry: CmsEntryListItem) => void;
  /** Caller-controlled query and cursor navigation. Items represent one server page. */
  readonly remote?: ContentListRemote;
  readonly selection?: ContentListSelection;
  readonly className?: string;
};

export type CmsFieldMap = FieldMap;
export type CmsFieldRow<TField extends FieldDescriptor = FieldDescriptor> = TField & {
  readonly key: string;
  readonly label: string;
};
export type CmsFieldRows<TFields extends FieldMap> = {
  [TKey in keyof TFields]: CmsFieldRow<TFields[TKey]> & {
    readonly key: TKey & string;
  };
}[keyof TFields];
export type CmsCollectionPresentation<
  TFields extends FieldMap = FieldMap,
  TKind extends CollectionKind = CollectionKind,
> = PublicCmsCollectionPresentation<TFields, TKind>;

export type ContentEditorFieldContext<TField = CmsFieldRow> = {
  readonly field: TField;
  readonly value: FieldValue<TField> | undefined;
  readonly error?: string;
  readonly disabled: boolean;
  readonly onChange: (value: FieldValue<TField> | undefined) => void;
};

export type ContentEditorProps<TFields extends FieldMap = FieldMap> = {
  readonly contentType: CmsCollectionPresentation<TFields>;
  readonly value: Partial<FieldsValue<NoInfer<TFields>>>;
  readonly validationErrors?: Readonly<Record<string, string>>;
  readonly disabled?: boolean;
  readonly saving?: boolean;
  readonly dirty?: boolean;
  readonly confirmDiscard?: boolean;
  readonly warnOnUnload?: boolean;
  readonly onChange: (value: Partial<FieldsValue<NoInfer<TFields>>>) => void;
  readonly onSaveDraft: () => void | Promise<void>;
  readonly onPublish?: () => void | Promise<void>;
  readonly onDiscard?: () => void;
  /** Reports invalid text in built-in JSON fields so hosts can guard navigation. */
  readonly onInvalidDraftChange?: (invalid: boolean) => void;
  readonly renderField?: (
    context: ContentEditorFieldContext<CmsFieldRows<NoInfer<TFields>>>,
  ) => ReactNode;
  readonly className?: string;
};

export type CmsBlockDefinition = NonNullable<
  Extract<FieldDescriptor, { readonly type: "blocks" }>["blocks"]
>[number];
export type CmsBlockValue = {
  readonly type: string;
  readonly fields: CmsFields;
};

type CmsBlockRenderer = (
  definition: CmsBlockDefinition,
  fields: CmsFields,
  onChange: (fields: CmsFields) => void,
) => ReactNode;

export type BlockEditorProps = {
  readonly label: ReactNode;
  readonly definitions: readonly CmsBlockDefinition[];
  readonly value: readonly CmsBlockValue[];
  readonly onChange: (value: CmsBlockValue[]) => void;
  /** Reports invalid text in built-in JSON field editors. */
  readonly onInvalidDraftChange?: (invalid: boolean) => void;
  readonly renderBlock?: CmsBlockRenderer;
  readonly disabled?: boolean;
  readonly error?: ReactNode;
  readonly className?: string;
};

type CmsLocaleRenderer = (
  locale: string,
  value: CmsFields,
  onChange: (value: CmsFields) => void,
) => ReactNode;

export type LocalizationEditorProps = {
  readonly contentType: CmsCollectionPresentation;
  readonly values: Readonly<Record<string, CmsFields | null | undefined>>;
  readonly activeLocale?: string;
  readonly onActiveLocaleChange?: (locale: string) => void;
  readonly onChange: (locale: string, fields: CmsFields) => void;
  /** Reports invalid text in the built-in JSON field editor. */
  readonly onInvalidDraftChange?: (invalid: boolean) => void;
  readonly renderLocale?: CmsLocaleRenderer;
  readonly disabled?: boolean;
  readonly className?: string;
};

export type RelationshipOption = {
  readonly id: string;
  readonly label: string;
  readonly contentType: string;
  readonly locale: string;
  readonly status: CmsEntryStatus;
};

export type RelationshipFieldProps = {
  readonly label: ReactNode;
  readonly relation: Extract<
    FieldDescriptor,
    { readonly type: "relationship" }
  >;
  readonly options: readonly RelationshipOption[];
  readonly value: string | readonly string[] | null;
  readonly locale?: string;
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly error?: ReactNode;
  readonly searchMode?: "local" | "remote";
  readonly onSearch?: (query: string) => void;
  readonly onChange: (value: string | string[] | null) => void;
  readonly className?: string;
};

export type RevisionHistoryProps = {
  readonly revisions: readonly CmsRevisionItem[];
  readonly currentRevisionNumber?: number;
  readonly loading?: boolean;
  readonly error?: ReactNode;
  readonly confirmRestore?: boolean;
  readonly onRestore?: (revisionId: string, revisionNumber: number) => void | Promise<void>;
  readonly className?: string;
};

export type PublishSchedulerProps = {
  readonly scheduledAt?: Date | string | null;
  readonly timeZone?: string;
  readonly disabled?: boolean;
  readonly scheduling?: boolean;
  readonly onSchedule: (publishAt: Date, timeZone: string) => void | Promise<void>;
  readonly onCancelSchedule?: () => void | Promise<void>;
  readonly className?: string;
};

export type EditorialCalendarItem = {
  readonly id: string;
  readonly title: string;
  readonly contentType: string;
  readonly locale: string;
  readonly status: CmsEntryStatus;
  readonly scheduledAt: Date | string;
  readonly timeZone?: string;
};

export type EditorialCalendarProps = {
  readonly items: readonly EditorialCalendarItem[];
  readonly timeZone: string;
  readonly initialMonth?: Date;
  readonly loading?: boolean;
  readonly onSelectItem?: (item: EditorialCalendarItem) => void;
  readonly onMonthChange?: (month: Date) => void;
  readonly className?: string;
};

export type AuditLogViewerProps = {
  readonly events: readonly CmsAuditLogItem[];
  readonly loading?: boolean;
  readonly error?: ReactNode;
  readonly pageSize?: number;
  readonly className?: string;
};

export type {
  CmsAuditEvent,
  CmsContentRevision,
  CmsEntryStatus,
  CmsEntryView,
  CmsFields,
  CmsValue,
  FieldDescriptor,
  FieldValue,
  FieldsValue,
};
