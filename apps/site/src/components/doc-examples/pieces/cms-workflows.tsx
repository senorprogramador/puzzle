import { useState } from "react";
import {
  AuditLogViewer,
  BlockEditor,
  CmsShell,
  ContentEditor,
  ContentList,
  ContentTypeBuilder,
  EditorialCalendar,
  LocalizationEditor,
  PublishScheduler,
  RelationshipField,
  RevisionHistory,
  WebhookManagement,
} from "@puzzle-ui/pieces";
import type {
  CmsAuditEvent,
  CmsContentRevision,
  CmsEntryView,
  CmsFields,
  ContentListQuery,
  ContentTypeDefinition,
  EditorialCalendarItem,
  RelationshipOption,
  WebhookDeliveryItem,
  WebhookSubscriptionItem,
} from "@puzzle-ui/pieces";

const articleType: ContentTypeDefinition = {
  slug: "article",
  name: "Article",
  description: "Editorial articles.",
  version: 1,
  locales: ["en-US", "fr-FR"],
  defaultLocale: "en-US",
  fields: [
    { key: "title", type: "text", label: "Title", required: true, localized: true },
    { key: "summary", type: "textarea", label: "Summary", localized: true },
    { key: "featured", type: "boolean", label: "Featured" },
  ],
};

const makeEntry = (
  id: string,
  title: string,
  status: CmsEntryView["status"],
  locale: string,
): CmsEntryView => {
  const timestamp = new Date("2026-10-28T12:00:00.000Z");
  return {
    id,
    createdAt: timestamp,
    updatedAt: timestamp,
    revision: 1,
    tenantId: "tenant-demo",
    contentTypeId: "article-type",
    contentTypeSlug: "article",
    translationGroupId: `translation-${id}`,
    locale,
    slug: id,
    publicSlug: null,
    publicSlugKey: id,
    fields: { title },
    schemaVersion: 1,
    revisionNumber: 2,
    status,
    publishedSnapshot: null,
    scheduledAt: null,
    scheduledTimeZone: null,
    scheduledRevisionNumber: null,
    archivedAt: null,
    deletedAt: null,
    createdBy: "editor-demo",
    updatedBy: "editor-demo",
    resolvedLocale: locale,
  };
};

const entries = [
  makeEntry("field-notes", "Field notes for a calmer launch", "draft", "en-US"),
  makeEntry("seasonal-guide", "A guide to the changing season", "published", "fr-FR"),
];

export const CmsShellExample = () => (
  <CmsShell
    title="Editorial workspace"
    description="Manage articles, media, and publishing."
    navigation={[
      { id: "articles", label: "Articles", href: "/admin/articles" },
      { id: "media", label: "Media library", href: "/admin/media" },
      { id: "settings", label: "Settings", href: "/admin/settings" },
    ]}
    activeNavigationId="articles"
    breadcrumbs={[{ label: "CMS", href: "/admin" }, { label: "Articles" }]}
    actions={<button type="button">New article</button>}
  >
    <p>Workspace content is supplied by the host application.</p>
  </CmsShell>
);

export const ContentListExample = () => (
  <ContentList
    title="Articles"
    contentTypeName="article"
    items={entries}
    locales={articleType.locales}
    onCreate={() => undefined}
    onEdit={() => undefined}
    onDuplicate={() => undefined}
    onArchive={() => undefined}
  />
);

export const ContentListRemoteExample = () => {
  const [query, setQuery] = useState<ContentListQuery>({
    search: "",
    status: "all",
    locale: "all",
  });
  const [page, setPage] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const matching = entries.filter(
    (entry) =>
      (query.status === "all" || entry.status === query.status) &&
      (query.locale === "all" || entry.locale === query.locale) &&
      String(entry.fields.title).toLowerCase().includes(query.search.toLowerCase()),
  );
  return (
    <ContentList
      title="Articles"
      contentTypeName="article"
      items={matching.slice(page, page + 1)}
      locales={articleType.locales}
      remote={{
        query,
        onQueryChange: (next) => {
          setQuery(next);
          setPage(0);
        },
        hasPreviousPage: page > 0,
        hasNextPage: page + 1 < matching.length,
        onPreviousPage: () => setPage((current) => current - 1),
        onNextPage: () => setPage((current) => current + 1),
        totalCount: matching.length,
      }}
      selection={{
        selectedIds,
        onSelectionChange: setSelectedIds,
        actions: [{ id: "archive", label: "Simulate archive" }],
        onBulkAction: (ids) => ({ succeededIds: ids, failures: [] }),
      }}
    />
  );
};

export const ContentEditorExample = () => {
  const initialFields: CmsFields = {
    title: "Field notes for a calmer launch",
    summary: "A practical guide to preparing a focused release.",
    featured: true,
    displaySettings: { showAuthor: true },
  };
  const [dirty, setDirty] = useState(true);
  const [invalidDraft, setInvalidDraft] = useState(false);
  const [value, setValue] = useState<CmsFields>(initialFields);
  return (
    <>
      <ContentEditor
        contentType={{
          ...articleType,
          fields: [...articleType.fields, { key: "displaySettings", type: "json", label: "Display settings" }],
        }}
        value={value}
        onChange={(next) => {
          setValue(next);
          setDirty(true);
        }}
        onSaveDraft={() => setDirty(false)}
        onPublish={() => undefined}
        onDiscard={() => {
          setValue(initialFields);
          setDirty(false);
        }}
        onInvalidDraftChange={setInvalidDraft}
        dirty={dirty}
        confirmDiscard
      />
      {invalidDraft ? <p role="status">Correct the JSON draft before saving.</p> : null}
    </>
  );
};

const blockDefinitions = [
  {
    type: "callout",
    fields: [
      { key: "heading", type: "text" as const, label: "Heading" },
      { key: "body", type: "textarea" as const, label: "Body" },
    ],
  },
  {
    type: "quote",
    fields: [
      { key: "quote", type: "textarea" as const, label: "Quote" },
      { key: "attribution", type: "text" as const, label: "Attribution" },
    ],
  },
];

export const BlockEditorExample = () => {
  const [blocks, setBlocks] = useState<CmsFields[keyof CmsFields][]>([
    { type: "callout", fields: { heading: "Start with one clear goal" } },
  ]);
  return (
    <BlockEditor
      label="Article blocks"
      definitions={blockDefinitions}
      value={blocks}
      onChange={setBlocks}
    />
  );
};

export const ContentTypeBuilderExample = () => {
  const [definition, setDefinition] = useState(articleType);
  return <ContentTypeBuilder value={definition} onChange={setDefinition} />;
};

export const LocalizationEditorExample = () => {
  const [values, setValues] = useState<Record<string, CmsFields | null>>({
    "en-US": { title: "Field notes", summary: "English summary." },
    "fr-FR": null,
  });
  return (
    <LocalizationEditor
      contentType={articleType}
      values={values}
      onChange={(locale, fields) =>
        setValues((current) => ({ ...current, [locale]: fields }))
      }
      renderLocale={(locale, fields, onChange) => (
        <div className="puzzle-cms-example-fields">
          <label>
            {locale} title
            <input
              value={typeof fields.title === "string" ? fields.title : ""}
              onChange={(event) =>
                onChange({ ...fields, title: event.currentTarget.value })
              }
            />
          </label>
        </div>
      )}
    />
  );
};

const relatedOptions: RelationshipOption[] = [
  {
    id: "field-notes",
    label: "Field notes for a calmer launch",
    contentType: "article",
    locale: "en-US",
    status: "published",
  },
  {
    id: "seasonal-guide",
    label: "A guide to the changing season",
    contentType: "article",
    locale: "en-US",
    status: "published",
  },
];

export const RelationshipFieldExample = () => {
  const [value, setValue] = useState<string | string[] | null>(null);
  const [query, setQuery] = useState("");
  return (
    <RelationshipField
      label="Related articles"
      relation={{ targetTypes: ["article"], multiple: true, sameLocale: true }}
      options={relatedOptions.filter((option) =>
        option.label.toLowerCase().includes(query.toLowerCase()),
      )}
      value={value}
      locale="en-US"
      searchMode="remote"
      onSearch={setQuery}
      onChange={setValue}
    />
  );
};

const revisions: CmsContentRevision[] = [1, 2].map((revisionNumber) => ({
  id: `revision-${revisionNumber}`,
  createdAt: new Date(`2026-10-${revisionNumber + 26}T12:00:00.000Z`),
  updatedAt: new Date(`2026-10-${revisionNumber + 26}T12:00:00.000Z`),
  revision: revisionNumber,
  tenantId: "tenant-demo",
  contentTypeId: "article-type",
  entryId: "field-notes",
  locale: "en-US",
  revisionNumber,
  schemaVersion: 1,
  slug: "field-notes",
  fields: { title: revisionNumber === 1 ? "First draft" : "Field notes" },
  status: "draft",
  publishedSnapshot: null,
  scheduledAt: null,
  scheduledTimeZone: null,
  action: revisionNumber === 1 ? "create" : "save-draft",
  actorId: "editor-demo",
  changeSummary: revisionNumber === 2 ? "Refined the introduction." : undefined,
}));

export const RevisionHistoryExample = () => (
  <RevisionHistory
    revisions={revisions}
    currentRevisionNumber={2}
    confirmRestore
    onRestore={() => undefined}
  />
);

export const PublishSchedulerExample = () => (
  <PublishScheduler
    scheduledAt={new Date("2035-02-01T10:00:00.000Z")}
    timeZone="UTC"
    onSchedule={() => undefined}
    onCancelSchedule={() => undefined}
  />
);

const calendarItems: EditorialCalendarItem[] = [
  {
    id: "field-notes",
    title: "Field notes for a calmer launch",
    contentType: "article",
    locale: "en-US",
    status: "scheduled",
    scheduledAt: new Date("2026-10-28T12:00:00.000Z"),
  },
  {
    id: "seasonal-guide",
    title: "A guide to the changing season",
    contentType: "article",
    locale: "fr-FR",
    status: "scheduled",
    scheduledAt: new Date("2026-10-30T09:30:00.000Z"),
  },
];

export const EditorialCalendarExample = () => (
  <EditorialCalendar
    items={calendarItems}
    timeZone="Europe/Amsterdam"
    initialMonth={new Date("2026-10-15T12:00:00.000Z")}
    onSelectItem={() => undefined}
  />
);

const auditEvents: CmsAuditEvent[] = [
  {
    id: "audit-1",
    createdAt: new Date("2026-10-28T12:00:00.000Z"),
    updatedAt: new Date("2026-10-28T12:00:00.000Z"),
    revision: 1,
    tenantId: "tenant-demo",
    actorId: "editor-demo",
    resource: "entry",
    resourceId: "field-notes",
    action: "entry:update",
    result: "success",
    timestamp: new Date("2026-10-28T12:00:00.000Z"),
    revisionNumber: 2,
  },
  {
    id: "audit-2",
    createdAt: new Date("2026-10-28T12:30:00.000Z"),
    updatedAt: new Date("2026-10-28T12:30:00.000Z"),
    revision: 1,
    tenantId: "tenant-demo",
    actorId: null,
    resource: "entry",
    resourceId: "seasonal-guide",
    action: "entry:publish",
    result: "denied",
    timestamp: new Date("2026-10-28T12:30:00.000Z"),
  },
];

export const AuditLogViewerExample = () => (
  <AuditLogViewer events={auditEvents} pageSize={5} />
);

export const WebhookManagementExample = () => {
  const [subscriptions, setSubscriptions] = useState<WebhookSubscriptionItem[]>([{
    id: "example",
    revision: 1,
    endpoint: "https://example.com/webhooks/cms",
    events: ["entry:publish", "entry:archive"],
    enabled: true,
    secretConfigured: true,
  }]);
  const [selectedId, setSelectedId] = useState<string>();
  const [deliveries, setDeliveries] = useState<WebhookDeliveryItem[]>([{
    id: "delivery-1",
    revision: 1,
    status: "failed",
    attempts: 2,
    lastStatus: 503,
    lastFailure: "http",
    createdAt: "2026-10-28T12:00:00.000Z",
  }]);
  return (
    <WebhookManagement
      subscriptions={subscriptions}
      eventTypes={["entry:create", "entry:save-draft", "entry:publish", "entry:archive"]}
      deliverySubscriptionId={selectedId}
      deliveries={selectedId === "example" ? deliveries : []}
      attemptsByDelivery={{ "delivery-1": [{ id: "attempt-1", number: 2, status: 503, failure: "http", completedAt: "2026-10-28T12:00:00.000Z" }] }}
      onSelectSubscription={setSelectedId}
      onCreate={(values) => {
        const saved = { ...values, id: `example-${Date.now()}`, revision: 1, secretConfigured: true };
        setSubscriptions((current) => [...current, saved]);
        return saved;
      }}
      onUpdate={(id, values) => {
        const saved = { id, endpoint: values.endpoint, events: values.events, enabled: values.enabled, revision: values.expectedRevision + 1, secretConfigured: true };
        setSubscriptions((current) => current.map((item) => item.id === id ? saved : item));
        return saved;
      }}
      onRetry={(id) => setDeliveries((current) => current.map((item) => item.id === id ? { ...item, status: "pending" } : item))}
    />
  );
};
