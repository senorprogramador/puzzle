import { useState } from "react";
import { collection, defineCMS, fields, toCmsPresentation } from "@puzzle-ui/cms";
import type { FieldsValue } from "@puzzle-ui/cms";
import {
  AuditLogViewer,
  BlockEditor,
  CmsShell,
  ContentEditor,
  ContentList,
  EditorialCalendar,
  LocalizationEditor,
  PublishScheduler,
  RelationshipField,
  RevisionHistory,
  WebhookManagement,
} from "@puzzle-ui/pieces";
import type {
  CmsAuditLogItem,
  CmsBlockDefinition,
  CmsBlockValue,
  CmsEntryListItem,
  CmsFields,
  CmsRevisionItem,
  ContentListQuery,
  EditorialCalendarItem,
  RelationshipOption,
  WebhookDeliveryItem,
  WebhookSubscriptionItem,
} from "@puzzle-ui/pieces";

const cmsConfig = defineCMS({
  collections: {
    articles: collection({
      name: "Article",
      description: "Editorial articles.",
      version: 1,
      fields: {
        title: fields.text({ label: "Title", required: true, localized: true }),
        slug: fields.slug({ label: "Slug", from: "title", required: true, localized: true }),
        summary: fields.textarea({ label: "Summary", localized: true }),
        featured: fields.boolean({ label: "Featured", defaultValue: false }),
        displaySettings: fields.json({ label: "Display settings" }),
        related: fields.relationship({
          label: "Related articles",
          target: "articles",
          multiple: true,
          sameLocale: true,
          allowedStatuses: ["published"],
        }),
      },
      drafts: true,
      timestamps: true,
      localization: {
        locales: ["en-US", "fr-FR"],
        defaultLocale: "en-US",
      },
    }),
  },
});

const articleFields = cmsConfig.collections.articles.fields;
const articlePresentation = toCmsPresentation(cmsConfig).collections.articles;

const makeEntry = (
  id: string,
  title: string,
  status: CmsEntryListItem["status"],
  locale: string,
): CmsEntryListItem => {
  const timestamp = new Date("2026-10-28T12:00:00.000Z");
  return {
    id,
    updatedAt: timestamp,
    revision: 1,
    slug: id,
    locale,
    status,
    fields: { title },
    revisionNumber: 1,
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
    locales={articlePresentation.localization.locales}
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
      locales={articlePresentation.localization.locales}
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
  const initialFields: Partial<FieldsValue<typeof articleFields>> = {
    title: "Field notes for a calmer launch",
    summary: "A practical guide to preparing a focused release.",
    featured: true,
    displaySettings: { showAuthor: true },
  };
  const [dirty, setDirty] = useState(true);
  const [invalidDraft, setInvalidDraft] = useState(false);
  const [value, setValue] = useState<Partial<FieldsValue<typeof articleFields>>>(initialFields);
  return (
    <>
      <ContentEditor
        contentType={articlePresentation}
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

const blockDefinitions: CmsBlockDefinition[] = [
  {
    type: "callout",
    fields: {
      heading: { type: "text", label: "Heading" },
      body: { type: "textarea", label: "Body" },
    },
  },
  {
    type: "quote",
    fields: {
      quote: { type: "textarea", label: "Quote" },
      attribution: { type: "text", label: "Attribution" },
    },
  },
];

export const BlockEditorExample = () => {
  const [blocks, setBlocks] = useState<CmsBlockValue[]>([
    { type: "callout", fields: { heading: "Start with one clear goal" } },
  ]);
  return (
    <BlockEditor
      label="Article blocks"
      definitions={blockDefinitions}
      value={blocks}
      onChange={(next) => setBlocks([...next])}
    />
  );
};

export const LocalizationEditorExample = () => {
  const [values, setValues] = useState<Record<string, CmsFields | null>>({
    "en-US": { title: "Field notes", summary: "English summary." },
    "fr-FR": null,
  });
  return (
    <LocalizationEditor
      contentType={articlePresentation}
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
      relation={articlePresentation.fields.related}
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

const revisions: CmsRevisionItem[] = [1, 2].map((revisionNumber) => ({
  id: `revision-${revisionNumber}`,
  createdAt: new Date(`2026-10-${revisionNumber + 26}T12:00:00.000Z`),
  revisionNumber,
  schemaVersion: 1,
  slug: "field-notes",
  fields: { title: revisionNumber === 1 ? "First draft" : "Field notes" },
  status: "draft",
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

const auditEvents: CmsAuditLogItem[] = [
  {
    id: "audit-1",
    actorId: "editor-demo",
    resource: "entry",
    resourceId: "field-notes",
    action: "entry:update",
    result: "success",
    timestamp: new Date("2026-10-28T12:00:00.000Z"),
  },
  {
    id: "audit-2",
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
