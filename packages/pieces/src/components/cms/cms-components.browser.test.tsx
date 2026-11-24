import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { page, userEvent as browserUserEvent } from "vitest/browser";
import { expect, it, vi } from "vitest";
import { fields } from "@puzzle-ui/cms";
import { CmsShell, ContentEditor, ContentList, EditorialCalendar, RelationshipField, RevisionHistory } from "./cms-components";
import type { CmsEntryListItem, CmsRevisionItem, EditorialCalendarItem } from "./cms.types";

const items: EditorialCalendarItem[] = [
  {
    id: "article-1",
    title: "Scheduled article",
    contentType: "article",
    locale: "en-US",
    status: "scheduled",
    scheduledAt: new Date("2026-10-28T12:00:00.000Z"),
  },
];

it("keeps the calendar responsive and supports keyboard item selection", async () => {
  const user = userEvent.setup();
  const onSelectItem = vi.fn();
  await page.viewport(375, 800);
  const { container } = render(
    <EditorialCalendar
      items={items}
      timeZone="UTC"
      initialMonth={new Date("2026-10-15T12:00:00.000Z")}
      onSelectItem={onSelectItem}
    />,
  );
  const calendar = container.querySelector(".puzzle-cms-calendar")!;

  expect(getComputedStyle(calendar).overflowX).toBe("auto");
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
    document.documentElement.clientWidth,
  );

  await page.viewport(768, 1024);
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
    document.documentElement.clientWidth,
  );

  const entryButton = screen.getByRole("button", { name: /Scheduled article/ });
  entryButton.focus();
  await user.keyboard("{Enter}");
  expect(onSelectItem).toHaveBeenCalledWith(items[0]);

  await page.viewport(1280, 800);
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
    document.documentElement.clientWidth,
  );
});

it("keeps remote content navigation responsive and keyboard accessible", async () => {
  const user = userEvent.setup();
  const onNextPage = vi.fn();
  const onSelectionChange = vi.fn();
  const entries: CmsEntryListItem[] = [{
    id: "article-1",
    revision: 1,
    revisionNumber: 1,
    slug: "article-1",
    locale: "en-US",
    status: "draft",
    fields: { title: "Article" },
    updatedAt: "2026-10-28T12:00:00.000Z",
  }];
  const { container } = render(
    <ContentList
      items={entries}
      remote={{
        query: { search: "", status: "all", locale: "all" },
        onQueryChange: () => undefined,
        hasPreviousPage: false,
        hasNextPage: true,
        onPreviousPage: () => undefined,
        onNextPage,
      }}
      selection={{ selectedIds: [], onSelectionChange }}
    />,
  );
  for (const width of [320, 768, 1280]) {
    await page.viewport(width, 800);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth,
    );
    expect(container.querySelector(".puzzle-cms-list__pagination")).toBeVisible();
  }
  const next = screen.getByRole("button", { name: "Next page" });
  next.focus();
  await user.keyboard("{Enter}");
  expect(onNextPage).toHaveBeenCalledOnce();
  const selectPage = screen.getByRole("checkbox", { name: "Select this page" });
  selectPage.focus();
  await user.keyboard(" ");
  expect(onSelectionChange).toHaveBeenCalledWith(["article-1"]);
});

it("confirms dirty discards with keyboard access at mobile width", async () => {
  const user = userEvent.setup();
  const onDiscard = vi.fn();
  await page.viewport(375, 800);
  render(
    <ContentEditor
      contentType={{ kind: "collection", name: "Article", fields: {} }}
      value={{}}
      onChange={() => undefined}
      onSaveDraft={() => undefined}
      onDiscard={onDiscard}
      dirty
      confirmDiscard
    />,
  );
  const discard = screen.getByRole("button", { name: "Discard" });
  discard.focus();
  await user.keyboard("{Enter}");
  await waitFor(() => {
    expect(screen.getByRole("dialog", { name: "Discard unsaved changes?" })).toBeVisible();
  });

  await user.keyboard("{Escape}");
  expect(onDiscard).not.toHaveBeenCalled();
  await waitFor(() => {
    expect(screen.queryByRole("dialog", { name: "Discard unsaved changes?" })).not.toBeInTheDocument();
  });
  await user.click(discard);
  const confirm = screen.getByRole("button", { name: "Discard changes" });
  await waitFor(() => expect(confirm).toBeVisible());
  confirm.focus();
  await user.keyboard("{Enter}");
  expect(onDiscard).toHaveBeenCalledOnce();
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
    document.documentElement.clientWidth,
  );
});

it("blocks save and publish while a JSON draft is invalid", async () => {
  const user = userEvent.setup();
  const onSave = vi.fn();
  const onPublish = vi.fn();
  await page.viewport(375, 800);
  const Editor = () => {
    const [value, setValue] = useState<{ data: number }>({ data: 1 });
    return (
      <ContentEditor
        contentType={{
          kind: "collection", name: "Article",
          fields: { data: fields.json({ label: "Data" }) },
        }}
        value={value}
        onChange={(next) => {
          if (typeof next.data === "number") setValue({ data: next.data });
        }}
        onSaveDraft={onSave}
        onPublish={onPublish}
      />
    );
  };
  render(<Editor />);
  const source = screen.getByRole("textbox", { name: "Data" });
  await user.clear(source);
  await user.type(source, "bad");
  expect(source).toHaveAttribute("aria-invalid", "true");
  expect(screen.getByRole("button", { name: "Save draft" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Publish" })).toBeDisabled();
  await user.clear(source);
  await user.type(source, "1e309");
  await user.click(screen.getByRole("button", { name: "Format JSON" }));
  expect(source).toHaveValue("1e309");
  expect(screen.getByRole("button", { name: "Save draft" })).toBeDisabled();
  await user.clear(source);
  await user.type(source, "2");
  await user.click(screen.getByRole("button", { name: "Save draft" }));
  expect(onSave).toHaveBeenCalledOnce();
});

it("opens revision comparisons with the keyboard without mobile overflow", async () => {
  await page.viewport(320, 800);
  const revision = (number: number): CmsRevisionItem => ({
    id: `revision-${number}`,
    revisionNumber: number,
    schemaVersion: 1,
    slug: "story",
    fields: { title: `Revision ${number} ${"longword".repeat(50)}` },
    status: "draft",
    action: "save-draft",
    actorId: "editor",
    createdAt: "2026-10-28T12:00:00.000Z",
  });

  render(<RevisionHistory revisions={[revision(1), revision(2)]} currentRevisionNumber={2} />);
  const summary = screen.getByText("Compare revision 1 with current revision 2");
  summary.focus();
  await browserUserEvent.keyboard("{Enter}");
  expect(screen.getByText("Current revision 2")).toBeVisible();
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
    document.documentElement.clientWidth,
  );
});

it("supports keyboard removal of an off-page relationship on mobile", async () => {
  const onChange = vi.fn();
  await page.viewport(320, 800);
  render(
    <RelationshipField
      label="Related"
      relation={fields.relationship({ target: "article", multiple: true })}
      options={[]}
      value={["off-page"]}
      onChange={onChange}
    />,
  );
  const remove = screen.getByRole("button", {
    name: "Remove Unavailable or outside current results (off-page)",
  });
  remove.focus();
  await browserUserEvent.keyboard("{Enter}");
  expect(onChange).toHaveBeenCalledWith([]);
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
    document.documentElement.clientWidth,
  );
});

it("confirms a revision restore with keyboard interaction", async () => {
  const onRestore = vi.fn();
  await page.viewport(375, 800);
  render(
    <RevisionHistory
      revisions={[{
        id: "old",
        revisionNumber: 1,
        schemaVersion: 1,
        slug: "story",
        fields: {},
        status: "draft",
        action: "save-draft",
        actorId: "editor",
        createdAt: "2026-10-28T12:00:00.000Z",
      }]}
      currentRevisionNumber={2}
      confirmRestore
      onRestore={onRestore}
    />,
  );
  const open = screen.getByRole("button", { name: "Restore revision 1 as new revision" });
  open.focus();
  await browserUserEvent.keyboard("{Enter}");
  const confirm = screen.getByRole("button", { name: "Restore revision" });
  await waitFor(() => expect(confirm).toBeVisible());
  expect(onRestore).not.toHaveBeenCalled();
  confirm.focus();
  await browserUserEvent.keyboard("{Enter}");
  expect(onRestore).toHaveBeenCalledWith("old", 1);
});

it("renders shell breadcrumbs accessibly on mobile", async () => {
  await page.viewport(375, 800);
  render(
    <CmsShell
      title="Articles"
      navigation={[{ id: "articles", label: "Articles", href: "/admin/articles" }]}
      breadcrumbs={[{ label: "CMS", href: "/admin" }, { label: "Articles" }]}
    >
      Content
    </CmsShell>,
  );
  const breadcrumbs = screen.getByRole("navigation", { name: "Breadcrumbs" });
  expect(breadcrumbs).toBeVisible();
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
    document.documentElement.clientWidth,
  );
});
