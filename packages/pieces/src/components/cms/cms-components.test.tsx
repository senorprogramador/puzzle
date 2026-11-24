import { useState } from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { fields } from "@puzzle-ui/cms";
import type {
  CmsAuditEvent,
  CmsContentRevision,
  CmsEntryView,
  CmsFields,
  FieldsValue,
} from "@puzzle-ui/cms";
import type { CmsBlockValue, CmsCollectionPresentation } from "./cms.types";
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
} from "./cms-components";

const typeDefinition = {
  kind: "collection",
  name: "Article",
  description: "Edit article content.",
  localization: {
    locales: ["en-US", "fr-FR"],
    defaultLocale: "en-US",
  },
  fields: {
    title: fields.text({ label: "Title", required: true }),
    published: fields.boolean({ label: "Published" }),
    related: fields.relationship({ label: "Related", target: "article" }),
  },
} satisfies CmsCollectionPresentation;

const makeEntry = (
  id: string,
  title: string,
  status: CmsEntryView["status"] = "draft",
  locale = "en-US",
): CmsEntryView => {
  const timestamp = new Date("2026-07-14T09:00:00.000Z");
  return {
    id,
    createdAt: timestamp,
    updatedAt: timestamp,
    revision: 1,
    tenantId: "tenant-1",
    contentTypeId: "type-1",
    contentTypeSlug: "article",
    translationGroupId: `translation-${id}`,
    locale,
    slug: id,
    publicSlug: null,
    publicSlugKey: id,
    fields: { title },
    schemaVersion: 1,
    revisionNumber: 1,
    status,
    publishedSnapshot: null,
    scheduledAt: null,
    scheduledTimeZone: null,
    scheduledRevisionNumber: null,
    archivedAt: null,
    deletedAt: null,
    createdBy: "editor-1",
    updatedBy: "editor-1",
    resolvedLocale: locale,
  };
};

const makeRevision = (id: string, revisionNumber: number): CmsContentRevision => ({
  id,
  createdAt: new Date("2026-07-14T09:00:00.000Z"),
  updatedAt: new Date("2026-07-14T09:00:00.000Z"),
  revision: revisionNumber,
  tenantId: "tenant-1",
  contentTypeId: "type-1",
  entryId: "entry-1",
  locale: "en-US",
  revisionNumber,
  schemaVersion: 1,
  slug: "article",
  fields: { title: `Revision ${revisionNumber}` },
  status: "draft",
  publishedSnapshot: null,
  scheduledAt: null,
  scheduledTimeZone: null,
  action: "save-draft",
  actorId: "editor-1",
});

const makeAuditEvent = (
  id: string,
  result: CmsAuditEvent["result"],
): CmsAuditEvent => ({
  id,
  createdAt: new Date("2026-07-14T09:00:00.000Z"),
  updatedAt: new Date("2026-07-14T09:00:00.000Z"),
  revision: 1,
  tenantId: "tenant-1",
  actorId: "editor-1",
  resource: "entry",
  resourceId: id,
  action: result === "success" ? "entry:update" : "entry:publish",
  result,
  timestamp: new Date("2026-07-14T09:00:00.000Z"),
});

describe("CmsShell", () => {
  it("composes caller navigation and page content", () => {
    render(
      <CmsShell
        title="Articles"
        navigation={[
          { id: "articles", label: "Articles", href: "/admin/articles" },
          { id: "media", label: "Media", href: "/admin/media" },
        ]}
        activeNavigationId="articles"
        breadcrumbs={[{ label: "CMS", href: "/admin" }, { label: "Articles" }]}
      >
        <p>Article overview</p>
      </CmsShell>,
    );

    expect(screen.getByRole("heading", { name: "Articles" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Articles" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByText("Article overview")).toBeVisible();
    expect(within(screen.getByRole("navigation", { name: "Breadcrumbs" })).getByRole("link", { name: "CMS" })).toHaveAttribute("href", "/admin");
  });
});

describe("ContentList", () => {
  it("filters entries by status and exposes row actions", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onArchive = vi.fn();
    render(
      <ContentList
        items={[
          makeEntry("draft-1", "Draft article"),
          makeEntry("live-1", "Published article", "published", "fr-FR"),
        ]}
        locales={["en-US", "fr-FR"]}
        onEdit={onEdit}
        onArchive={onArchive}
      />,
    );

    expect(screen.getByRole("searchbox", { name: "Search content" })).toBeVisible();
    await user.selectOptions(screen.getByLabelText("Status"), "published");
    expect(screen.getByText("Published article")).toBeVisible();
    expect(screen.queryByText("Draft article")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Edit Published article" }));
    expect(onEdit).toHaveBeenCalledWith(
      expect.objectContaining({ id: "live-1" }),
    );
    await user.click(screen.getByRole("button", { name: "Archive Published article" }));
    expect(onArchive).toHaveBeenCalledWith(
      expect.objectContaining({ id: "live-1" }),
    );
  });

  it("shows loading, error, empty, and permission-denied states", () => {
    const { rerender } = render(<ContentList items={[]} loading />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading content");
    rerender(<ContentList items={[]} error="Offline" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Offline");
    rerender(<ContentList items={[]} permissionDenied />);
    expect(screen.getByRole("alert")).toHaveTextContent("permission");
  });

  it("uses caller-owned remote queries and cursor pages without filtering the supplied page", async () => {
    const user = userEvent.setup();
    const onQueryChange = vi.fn();
    const onNextPage = vi.fn();
    const onPreviousPage = vi.fn();
    const remote = {
      query: { search: "server search", status: "draft" as const, locale: "en-US" },
      onQueryChange,
      hasPreviousPage: false,
      hasNextPage: true,
      onPreviousPage,
      onNextPage,
    };
    const { rerender } = render(
      <ContentList items={[makeEntry("first", "First result")]} locales={["en-US", "fr-FR"]} remote={remote} />,
    );
    expect(screen.getByText("First result")).toBeVisible();
    expect(screen.getByText("On this page: 1 entry")).toBeVisible();
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(onNextPage).toHaveBeenCalledOnce();
    await user.selectOptions(screen.getByLabelText("Status"), "published");
    expect(onQueryChange).toHaveBeenLastCalledWith({
      ...remote.query,
      status: "published",
    });
    await user.selectOptions(screen.getByLabelText("Locale"), "fr-FR");
    expect(onQueryChange).toHaveBeenLastCalledWith({
      ...remote.query,
      locale: "fr-FR",
    });
    await user.clear(screen.getByRole("searchbox", { name: "Search content" }));
    expect(onQueryChange).toHaveBeenLastCalledWith({
      ...remote.query,
      search: "",
    });

    rerender(
      <ContentList
        items={[makeEntry("second", "Second result")]}
        remote={{ ...remote, hasPreviousPage: true, hasNextPage: false, totalCount: 2 }}
      />,
    );
    expect(screen.queryByText("First result")).not.toBeInTheDocument();
    expect(screen.getByText("Second result")).toBeVisible();
    expect(screen.getByText("2 entries")).toBeVisible();
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Previous page" }));
    expect(onPreviousPage).toHaveBeenCalledOnce();

    rerender(<ContentList items={[]} remote={remote} loading />);
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  });

  it("updates local table rows when callers replace entries without changing the count", () => {
    const { rerender } = render(<ContentList items={[makeEntry("first", "First result")]} />);
    rerender(<ContentList items={[makeEntry("second", "Second result")]} />);
    expect(screen.queryByText("First result")).not.toBeInTheDocument();
    expect(screen.getByText("Second result")).toBeVisible();
  });

  it("supports bulk selection across pages and reports incomplete results", async () => {
    const user = userEvent.setup();
    const onBulkAction = vi.fn(async () => ({
      succeededIds: ["first"],
      failures: [{ entryId: "second", message: "Revision changed." }],
    }));
    const TestList = () => {
      const [selectedIds, setSelectedIds] = useState<string[]>(["other-page"]);
      return (
        <ContentList
          items={[makeEntry("first", "First"), makeEntry("second", "Second"), makeEntry("third", "Third")]}
          selection={{
            selectedIds,
            onSelectionChange: setSelectedIds,
            actions: [{ id: "archive", label: "Archive selected" }],
            onBulkAction,
          }}
        />
      );
    };
    render(<TestList />);
    await user.click(screen.getByRole("checkbox", { name: "Select matching entries" }));
    expect(screen.getByText("4 selected")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Archive selected" }));
    expect(onBulkAction).toHaveBeenCalledWith(
      ["other-page", "first", "second", "third"],
      "archive",
    );
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("1 completed; 3 failed.");
    expect(alert).toHaveTextContent("second: Revision changed.");
    expect(alert).toHaveTextContent("third: No result was returned for this entry.");
    expect(screen.getByText("3 selected")).toBeVisible();
    expect(screen.getByRole("checkbox", { name: "Select First" })).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Select Second" })).toBeChecked();
  });

  it("keeps the selection and surfaces rejected bulk actions", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <ContentList
        items={[makeEntry("first", "First")]}
        selection={{
          selectedIds: ["first"],
          onSelectionChange,
          actions: [{ id: "archive", label: "Archive selected" }],
          onBulkAction: async () => { throw new Error("Access denied"); },
        }}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Archive selected" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Access denied");
    expect(onSelectionChange).not.toHaveBeenCalled();
  });
});

describe("ContentEditor", () => {
  it("propagates valid JSON edits and blocks saving invalid drafts", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const onPublish = vi.fn();
    const onInvalidDraftChange = vi.fn();
    const editorFields = { data: fields.json({ label: "Data" }) };
    const ControlledEditor = () => {
      const [value, setValue] = useState<Partial<FieldsValue<typeof editorFields>>>({
        data: { count: 1 },
      });
      return (
        <ContentEditor
          contentType={{ ...typeDefinition, fields: editorFields }}
          value={value}
          validationErrors={{ data: "Server validation failed." }}
          onChange={setValue}
          onSaveDraft={() => onSave(value)}
          onPublish={() => onPublish(value)}
          onInvalidDraftChange={onInvalidDraftChange}
          warnOnUnload
        />
      );
    };
    render(<ControlledEditor />);
    const input = screen.getByRole("textbox", { name: "Data" });
    fireEvent.change(input, { target: { value: '{"count":' } });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Enter valid JSON");
    expect(screen.getByRole("button", { name: "Save draft" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Publish" })).toBeDisabled();
    expect(screen.getByText("Unsaved changes")).toBeVisible();
    expect(onInvalidDraftChange).toHaveBeenLastCalledWith(true);
    const unload = new Event("beforeunload", { cancelable: true });
    expect(window.dispatchEvent(unload)).toBe(false);
    expect(onSave).not.toHaveBeenCalled();
    expect(onPublish).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: "1e309" } });
    expect(screen.getByRole("button", { name: "Save draft" })).toBeDisabled();
    fireEvent.change(input, { target: { value: '{"count":2}' } });
    expect(input).toHaveValue('{"count":2}');
    expect(screen.getByRole("alert")).toHaveTextContent("Server validation failed.");
    expect(onInvalidDraftChange).toHaveBeenLastCalledWith(false);
    await user.click(screen.getByRole("button", { name: "Save draft" }));
    await user.click(screen.getByRole("button", { name: "Publish" }));
    expect(onSave).toHaveBeenCalledWith({ data: { count: 2 } });
    expect(onPublish).toHaveBeenCalledWith({ data: { count: 2 } });
  });

  it("confirms and clears invalid JSON on discard, and releases removed fields", async () => {
    const user = userEvent.setup();
    const onDiscard = vi.fn();
    const type = { ...typeDefinition, fields: { data: fields.json({ label: "Data" }) } };
    const props = {
      contentType: type,
      value: { data: { count: 1 } },
      onChange: vi.fn(),
      onSaveDraft: vi.fn(),
      onDiscard,
      confirmDiscard: true,
    };
    const { rerender } = render(<ContentEditor {...props} />);
    fireEvent.change(screen.getByRole("textbox", { name: "Data" }), { target: { value: "{" } });
    await user.click(screen.getByRole("button", { name: "Discard" }));
    expect(screen.getByRole("dialog")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Discard changes" }));
    expect(onDiscard).toHaveBeenCalledOnce();
    expect(screen.getByRole("textbox", { name: "Data" })).toHaveValue('{\n  "count": 1\n}');
    expect(screen.getByRole("button", { name: "Save draft" })).toBeEnabled();

    fireEvent.change(screen.getByRole("textbox", { name: "Data" }), { target: { value: "{" } });
    rerender(<ContentEditor {...props} contentType={{ ...type, fields: {} }} />);
    await waitFor(() => expect(screen.getByRole("button", { name: "Save draft" })).toBeEnabled());
  });

  it("keeps save blocked until every invalid JSON field is fixed", () => {
    render(
      <ContentEditor
        contentType={{
          ...typeDefinition,
          fields: {
            first: fields.json({ label: "First JSON" }),
            second: fields.json({ label: "Second JSON" }),
          },
        }}
        value={{ first: 1, second: 2 }}
        onChange={vi.fn()}
        onSaveDraft={vi.fn()}
      />,
    );
    const first = screen.getByRole("textbox", { name: "First JSON" });
    const second = screen.getByRole("textbox", { name: "Second JSON" });
    fireEvent.change(first, { target: { value: "invalid" } });
    fireEvent.change(second, { target: { value: "invalid" } });
    fireEvent.change(first, { target: { value: "1" } });
    expect(screen.getByRole("button", { name: "Save draft" })).toBeDisabled();
    fireEvent.change(second, { target: { value: "2" } });
    expect(screen.getByRole("button", { name: "Save draft" })).toBeEnabled();
  });

  it("updates typed fields and separates draft save from publish", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onSaveDraft = vi.fn();
    const onPublish = vi.fn();
    const ControlledEditor = () => {
      const [value, setValue] = useState<Partial<FieldsValue<typeof typeDefinition.fields>>>({
        title: "First draft",
        published: false,
      });
      return (
        <ContentEditor
          contentType={typeDefinition}
          value={value}
          onChange={(next) => {
            onChange(next);
            setValue(next);
          }}
          onSaveDraft={onSaveDraft}
          onPublish={onPublish}
        />
      );
    };
    render(<ControlledEditor />);

    await user.clear(screen.getByRole("textbox", { name: /^Title\s*\*$/ }));
    await user.type(screen.getByRole("textbox", { name: /^Title\s*\*$/ }), "Updated draft");
    expect(onChange).toHaveBeenLastCalledWith({
      title: "Updated draft",
      published: false,
    });

    await user.click(screen.getByRole("button", { name: "Save draft" }));
    expect(onSaveDraft).toHaveBeenCalledOnce();
    await user.click(screen.getByRole("button", { name: "Publish" }));
    expect(onPublish).toHaveBeenCalledOnce();
  });

  it("maps nested field descriptors into render rows without losing schema metadata", () => {
    const schemaFields = {
      profile: fields.object({
        label: "Profile",
        fields: {
          displayName: fields.text({ required: true }),
          preferences: fields.object({
            fields: {
              color: fields.select({
                options: [
                  { label: "Blue", value: "blue" },
                  { label: "Green", value: "green" },
                ],
              }),
            },
          }),
        },
      }),
      gallery: fields.array({
        label: "Gallery",
        of: fields.media({ accept: ["image/*"] }),
      }),
      sections: fields.blocks({
        blocks: [{
          type: "hero",
          label: "Hero",
          fields: { heading: fields.text({ required: true }) },
        }],
      }),
    };
    const renderField = vi.fn(({ field }) => (
      <div data-testid={`custom-${field.key}`}>{field.type}</div>
    ));

    render(
      <ContentEditor
        contentType={{ kind: "collection", name: "Article", fields: schemaFields }}
        value={{}}
        onChange={vi.fn()}
        onSaveDraft={vi.fn()}
        renderField={renderField}
      />,
    );

    expect(screen.getByTestId("custom-profile")).toHaveTextContent("object");
    expect(screen.getByTestId("custom-gallery")).toHaveTextContent("array");
    expect(screen.getByTestId("custom-sections")).toHaveTextContent("blocks");
    const contexts = renderField.mock.calls.map(([context]) => context);
    expect(contexts.map(({ field }) => field.key)).toEqual([
      "profile",
      "gallery",
      "sections",
    ]);
    expect(contexts[0]?.field.fields.preferences.fields.color.options).toEqual([
      { label: "Blue", value: "blue" },
      { label: "Green", value: "green" },
    ]);
    expect(contexts[1]?.field.of.accept).toEqual(["image/*"]);
    expect(contexts[2]?.field.blocks[0]?.fields.heading.required).toBe(true);
  });

  it("shows schema defaults and required/server validation state", () => {
    const schemaFields = {
      title: fields.text({ label: "Title", required: true }),
      summary: fields.text({
        label: "Summary",
        required: true,
        defaultValue: "A starting summary",
      }),
    };
    render(
      <ContentEditor
        contentType={{ kind: "collection", name: "Article", fields: schemaFields }}
        value={{}}
        validationErrors={{ title: "Title is required." }}
        onChange={vi.fn()}
        onSaveDraft={vi.fn()}
      />,
    );

    const title = screen.getByRole("textbox", {
      name: /Title\s*\* Title is required\./,
    });
    expect(title).toBeRequired();
    expect(title).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Title is required.");
    const summary = screen.getByRole("textbox", { name: "Summary" });
    expect(summary).toHaveValue("A starting summary");
    expect(summary).not.toBeRequired();
  });

  it("uses a caller field renderer and announces validation failures", async () => {
    const user = userEvent.setup();
    const renderField = vi.fn(({ field }) => (
      <label>
        Custom {field.label}
        <input aria-label={`Custom ${field.label}`} />
      </label>
    ));
    const onSaveDraft = vi.fn(async () => {
      throw new Error("Revision conflict");
    });
    render(
      <ContentEditor
        contentType={typeDefinition}
        value={{}}
        validationErrors={{ title: "Title is required." }}
        onChange={vi.fn()}
        onSaveDraft={onSaveDraft}
        renderField={renderField}
      />,
    );

    expect(screen.getByRole("textbox", { name: "Custom Title" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Save draft" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Revision conflict");
  });

  it("confirms dirty discards only when enabled", async () => {
    const user = userEvent.setup();
    const onDiscard = vi.fn();
    const props = {
      contentType: typeDefinition,
      value: {},
      onChange: vi.fn(),
      onSaveDraft: vi.fn(),
      onDiscard,
    };
    const { rerender } = render(<ContentEditor {...props} dirty confirmDiscard />);
    await user.click(screen.getByRole("button", { name: "Discard" }));
    expect(screen.getByRole("dialog", { name: "Discard unsaved changes?" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onDiscard).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Discard" }));
    await user.click(screen.getByRole("button", { name: "Discard changes" }));
    expect(onDiscard).toHaveBeenCalledOnce();
    rerender(<ContentEditor {...props} dirty />);
    await user.click(screen.getByRole("button", { name: "Discard" }));
    expect(onDiscard).toHaveBeenCalledTimes(2);
    rerender(<ContentEditor {...props} confirmDiscard />);
    await user.click(screen.getByRole("button", { name: "Discard" }));
    expect(onDiscard).toHaveBeenCalledTimes(3);
  });

  it("registers an unload warning only while enabled and dirty", () => {
    const props = {
      contentType: typeDefinition,
      value: {},
      onChange: vi.fn(),
      onSaveDraft: vi.fn(),
    };
    const { rerender, unmount } = render(<ContentEditor {...props} dirty warnOnUnload />);
    const warned = new Event("beforeunload", { cancelable: true });
    expect(window.dispatchEvent(warned)).toBe(false);
    rerender(<ContentEditor {...props} warnOnUnload />);
    expect(window.dispatchEvent(new Event("beforeunload", { cancelable: true }))).toBe(true);
    rerender(<ContentEditor {...props} dirty warnOnUnload />);
    unmount();
    expect(window.dispatchEvent(new Event("beforeunload", { cancelable: true }))).toBe(true);
  });
});

describe("BlockEditor", () => {
  const definitions = [
    {
      type: "hero",
      fields: { heading: fields.text({ label: "Heading", defaultValue: "Welcome" }) },
    },
  ];

  it("reports invalid block JSON and prevents changes that would discard it", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onInvalidDraftChange = vi.fn();
    render(
      <BlockEditor
        label="Page blocks"
        definitions={definitions}
        value={[{ type: "hero", fields: { heading: "Hello" } }]}
        onChange={onChange}
        onInvalidDraftChange={onInvalidDraftChange}
      />,
    );
    const input = screen.getByRole("textbox", { name: "hero fields" });
    fireEvent.change(input, { target: { value: "[]" } });
    expect(screen.getByRole("alert")).toHaveTextContent("Fields must be a JSON object.");
    expect(onInvalidDraftChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByRole("button", { name: "Remove" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Remove" }));
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.change(input, { target: { value: '{"heading":"Changed"}' } });
    expect(onChange).toHaveBeenLastCalledWith([{ type: "hero", fields: { heading: "Changed" } }]);
    expect(onInvalidDraftChange).toHaveBeenLastCalledWith(false);
    expect(screen.getByRole("button", { name: "Remove" })).toBeEnabled();
  });

  it("adds blocks from the schema and keeps invalid stored values visible", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <BlockEditor
        label="Page blocks"
        definitions={definitions}
        value={[]}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Add hero" }));
    expect(onChange).toHaveBeenCalledWith([
      { type: "hero", fields: { heading: "Welcome" } },
    ]);

    rerender(
      <BlockEditor
        label="Page blocks"
        definitions={definitions}
        value={["invalid block"] as unknown as CmsBlockValue[]}
        onChange={onChange}
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("invalid");
    expect(screen.getByRole("button", { name: "Remove invalid block" })).toBeVisible();
  });
});

describe("LocalizationEditor", () => {
  it("keeps an invalid locale draft visible and prevents switching locales", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onInvalidDraftChange = vi.fn();
    render(
      <LocalizationEditor
        contentType={typeDefinition}
        values={{ "en-US": { title: "Hello" }, "fr-FR": null }}
        onChange={onChange}
        onInvalidDraftChange={onInvalidDraftChange}
      />,
    );
    const input = screen.getByRole("textbox", { name: "en-US fields" });
    fireEvent.change(input, { target: { value: "null" } });
    expect(screen.getByRole("alert")).toHaveTextContent("Fields must be a JSON object.");
    expect(onInvalidDraftChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByRole("tab", { name: /fr-FR/ })).toBeDisabled();
    await user.click(screen.getByRole("tab", { name: /fr-FR/ }));
    expect(screen.getByRole("textbox", { name: "en-US fields" })).toBeVisible();
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.change(input, { target: { value: '{"title":"Updated"}' } });
    expect(onChange).toHaveBeenCalledWith("en-US", { title: "Updated" });
    expect(onInvalidDraftChange).toHaveBeenLastCalledWith(false);
    expect(screen.getByRole("tab", { name: /fr-FR/ })).toBeEnabled();
  });

  it("shows missing translations and edits the selected locale", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <LocalizationEditor
        contentType={typeDefinition}
        values={{ "en-US": { title: "Hello" }, "fr-FR": null }}
        onChange={onChange}
        renderLocale={(locale) => <p>{locale} translation editor</p>}
      />,
    );

    expect(screen.getByText("Translated")).toBeVisible();
    expect(screen.getByText("Missing")).toBeVisible();
    await user.click(screen.getByRole("tab", { name: /fr-FR/ }));
    expect(screen.getByText("fr-FR translation editor")).toBeVisible();
  });
});

describe("RelationshipField", () => {
  it("filters by schema constraints and returns selected IDs", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const options = [
      { id: "allowed", label: "Allowed entry", contentType: "article", locale: "en-US", status: "published" as const },
      { id: "wrong-type", label: "Wrong type", contentType: "page", locale: "en-US", status: "published" as const },
      { id: "wrong-locale", label: "Wrong locale", contentType: "article", locale: "fr-FR", status: "published" as const },
      { id: "draft", label: "Draft entry", contentType: "article", locale: "en-US", status: "draft" as const },
    ];
    render(
      <RelationshipField
        label="Related articles"
        relation={fields.relationship({
          target: "article",
          multiple: true,
          sameLocale: true,
          allowedStatuses: ["published"],
        })}
        options={options}
        value={[]}
        locale="en-US"
        onChange={onChange}
      />,
    );

    expect(screen.getByText("Allowed entry")).toBeVisible();
    expect(screen.queryByText("Wrong type")).not.toBeInTheDocument();
    expect(screen.queryByText("Wrong locale")).not.toBeInTheDocument();
    expect(screen.queryByText("Draft entry")).not.toBeInTheDocument();
    await user.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith(["allowed"]);
  });

  it("preserves remote matches and allows removing selections absent from current results", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    const onChange = vi.fn();
    render(
      <RelationshipField
        label="Related"
        relation={fields.relationship({ target: "article", multiple: true })}
        options={[
          { id: "allowed", label: "Visible result", contentType: "article", locale: "en-US", status: "draft" },
          { id: "wrong", label: "Wrong type", contentType: "page", locale: "en-US", status: "draft" },
        ]}
        value={["missing"]}
        searchMode="remote"
        onSearch={onSearch}
        onChange={onChange}
      />,
    );
    await user.type(screen.getByRole("searchbox", { name: "Search related content" }), "synonym");
    expect(onSearch).toHaveBeenLastCalledWith("synonym");
    expect(screen.getByText("Visible result")).toBeVisible();
    expect(screen.queryByText("Wrong type")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Remove Unavailable or outside current results (missing)" }));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("requires a search callback in remote mode", () => {
    expect(() => render(
      <RelationshipField
        label="Related"
        relation={fields.relationship({ target: "article" })}
        options={[]}
        value={null}
        searchMode="remote"
        onChange={vi.fn()}
      />,
    )).toThrow("RelationshipField remote search requires onSearch.");
  });

  it("does not offer same-locale relationships when the source locale is missing", () => {
    render(
      <RelationshipField
        label="Related"
        relation={fields.relationship({ target: "article", sameLocale: true })}
        options={[{ id: "entry", label: "Entry", contentType: "article", locale: "en-US", status: "draft" }]}
        value={null}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("A locale is required");
    expect(screen.queryByText("Entry")).not.toBeInTheDocument();
  });
});

describe("RevisionHistory", () => {
  it("restores a selected revision as a new version through the supplied action", async () => {
    const user = userEvent.setup();
    const onRestore = vi.fn();
    render(
      <RevisionHistory
        revisions={[makeRevision("revision-1", 1), makeRevision("revision-2", 2)]}
        currentRevisionNumber={2}
        onRestore={onRestore}
      />,
    );

    expect(screen.getByText("Revision history")).toBeVisible();
    await user.click(
      screen.getByRole("button", { name: "Restore revision 1 as new revision" }),
    );
    expect(onRestore).toHaveBeenCalledWith("revision-1", 1);
  });

  it("compares changed, added, and removed fields with the supplied current revision", async () => {
    const user = userEvent.setup();
    const previous = {
      ...makeRevision("old", 1),
      fields: { changed: { count: 1 }, removed: "old", same: { a: 1, b: 2 }, nullable: null },
    };
    const current = {
      ...makeRevision("current", 2),
      fields: { changed: { count: 2 }, added: "new", same: { b: 2, a: 1 }, nullable: null },
    };
    const { rerender } = render(
      <RevisionHistory revisions={[previous, current]} currentRevisionNumber={2} />,
    );
    const comparison = screen.getByText("Compare revision 1 with current revision 2").closest("details")!;
    await user.click(within(comparison).getByText("Compare revision 1 with current revision 2"));
    expect(within(comparison).getByText("changed")).toBeVisible();
    expect(within(comparison).getByText("added")).toBeVisible();
    expect(within(comparison).getByText("removed")).toBeVisible();
    expect(within(comparison).queryByText("same")).not.toBeInTheDocument();
    expect(within(comparison).queryByText("nullable")).not.toBeInTheDocument();
    expect(within(comparison).getAllByText("Not present")).toHaveLength(2);
    expect(within(comparison).getByText(/"count": 1/)).toBeVisible();
    expect(within(comparison).getByText(/"count": 2/)).toBeVisible();

    rerender(<RevisionHistory revisions={[previous]} currentRevisionNumber={2} />);
    expect(screen.queryByText("Compare revision 1 with current revision 2")).not.toBeInTheDocument();
  });

  it("optionally confirms restores and prevents restoring the active revision", async () => {
    const user = userEvent.setup();
    const onRestore = vi.fn();
    const revisions = [makeRevision("old", 1), makeRevision("current", 2)];
    const { rerender } = render(
      <RevisionHistory revisions={revisions} currentRevisionNumber={2} confirmRestore onRestore={onRestore} />,
    );
    await user.click(screen.getByRole("button", { name: "Restore revision 1 as new revision" }));
    expect(screen.getByRole("dialog", { name: "Restore this revision?" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onRestore).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Restore revision 1 as new revision" }));
    rerender(<RevisionHistory revisions={revisions} currentRevisionNumber={1} confirmRestore onRestore={onRestore} />);
    expect(screen.getByRole("button", { name: "Restore revision" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    rerender(<RevisionHistory revisions={revisions} currentRevisionNumber={2} confirmRestore onRestore={onRestore} />);
    await user.click(screen.getByRole("button", { name: "Restore revision 1 as new revision" }));
    await user.click(screen.getByRole("button", { name: "Restore revision" }));
    expect(onRestore).toHaveBeenCalledWith("old", 1);
  });
});

describe("PublishScheduler", () => {
  it("submits a future instant with the explicit timezone and supports cancel", async () => {
    const user = userEvent.setup();
    const onSchedule = vi.fn();
    const onCancelSchedule = vi.fn();
    render(
      <PublishScheduler
        scheduledAt={new Date("2035-02-01T10:00:00.000Z")}
        timeZone="UTC"
        onSchedule={onSchedule}
        onCancelSchedule={onCancelSchedule}
      />,
    );

    const dateTime = screen.getByLabelText("Publish date and time");
    await user.clear(dateTime);
    await user.type(dateTime, "2035-02-02T10:00");
    await user.click(screen.getByRole("button", { name: "Schedule" }));
    await waitFor(() => {
      expect(onSchedule).toHaveBeenCalledWith(
        new Date("2035-02-02T10:00:00.000Z"),
        "UTC",
      );
    });
    await user.click(screen.getByRole("button", { name: "Cancel schedule" }));
    expect(onCancelSchedule).toHaveBeenCalledOnce();
  });

  it("shows daylight-saving gaps and callback failures instead of hiding them", async () => {
    const user = userEvent.setup();
    render(
      <PublishScheduler
        timeZone="America/New_York"
        onSchedule={vi.fn()}
      />,
    );

    await user.type(
      screen.getByLabelText("Publish date and time"),
      "2026-03-08T02:30",
    );
    await user.click(screen.getByRole("button", { name: "Schedule" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("does not exist");
  });
});

describe("EditorialCalendar", () => {
  it("groups scheduled items by the requested timezone and returns selected items", async () => {
    const user = userEvent.setup();
    const item = {
      id: "entry-1",
      title: "Launch",
      contentType: "article",
      locale: "en-US",
      status: "scheduled" as const,
      scheduledAt: new Date("2026-07-14T09:00:00.000Z"),
    };
    const onSelectItem = vi.fn();
    render(
      <EditorialCalendar
        items={[item]}
        timeZone="UTC"
        initialMonth={new Date("2026-07-15T12:00:00.000Z")}
        onSelectItem={onSelectItem}
      />,
    );

    expect(screen.getByRole("heading", { name: "July 2026" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: /Launch/ }));
    expect(onSelectItem).toHaveBeenCalledWith(item);
  });
});

describe("AuditLogViewer", () => {
  it("supports media failures without a resource ID", async () => {
    const user = userEvent.setup();
    render(<AuditLogViewer events={[{
      id: "media-event", actorId: "editor", resource: "upload", resourceId: "",
      action: "upload:create", result: "failure", timestamp: "2026-01-01T00:00:00.000Z",
    }]} />);
    await user.selectOptions(screen.getByLabelText("Result"), "failure");
    expect(screen.getByText("upload:create")).toBeVisible();
    expect(screen.getByText("failure")).toBeVisible();
    expect(screen.getByRole("cell", { name: "upload" })).toBeVisible();
  });

  it("filters events and paginates without hiding denied operations", async () => {
    const user = userEvent.setup();
    render(
      <AuditLogViewer
        events={[
          makeAuditEvent("entry-1", "success"),
          makeAuditEvent("entry-2", "denied"),
        ]}
        pageSize={1}
      />,
    );

    expect(screen.getByText("Page 1 of 2")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("denied")).toBeVisible();
    await user.selectOptions(screen.getByLabelText("Result"), "success");
    expect(screen.getByText("success")).toBeVisible();
    expect(screen.queryByText("denied")).not.toBeInTheDocument();
  });
});
