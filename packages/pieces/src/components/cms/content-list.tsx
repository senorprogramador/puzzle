"use client";

import { useId, useMemo, useRef, useState } from "react";
import type { CmsEntryStatus } from "@puzzle-ui/cms";
import { DataTable, Select } from "@puzzle-ui/ui";
import type { CmsEntryListItem, ContentListProps } from "./cms.types";
import { errorMessage, entryTitle, formatDate } from "./cms.utils";

export const ContentList = ({
  items,
  title = "Content",
  contentTypeName = "entry",
  locales = [],
  loading = false,
  error,
  permissionDenied = false,
  onCreate,
  onEdit,
  onDuplicate,
  onArchive,
  remote,
  selection,
  className,
}: ContentListProps) => {
  const id = useId();
  const [localSearch, setSearch] = useState("");
  const [localStatus, setStatus] = useState<CmsEntryStatus | "all">("all");
  const [localLocale, setLocale] = useState("all");
  const [bulkPending, setBulkPending] = useState(false);
  const [bulkFeedback, setBulkFeedback] = useState<{
    role: "status" | "alert";
    message: string;
    details?: string[];
  } | null>(null);
  const selectedIdsRef = useRef(selection?.selectedIds);
  selectedIdsRef.current = selection?.selectedIds;
  const search = remote?.query.search ?? localSearch;
  const status = remote?.query.status ?? localStatus;
  const locale = remote?.query.locale ?? localLocale;
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const filteredItems = useMemo(
    () =>
      remote ? items : items.filter(
        (item) =>
          (status === "all" || item.status === status) &&
          (locale === "all" || item.locale === locale) &&
          `${entryTitle(item)} ${item.slug} ${item.locale} ${item.status}`
            .toLocaleLowerCase()
            .includes(normalizedSearch),
      ),
    [items, locale, normalizedSearch, status, Boolean(remote)],
  );
  const tableItems = remote ? [...filteredItems] : filteredItems.slice(0, 10);
  const count = remote?.totalCount ?? filteredItems.length;
  const countLabel =
    count === 1 ? contentTypeName : contentTypeName === "entry" ? "entries" : `${contentTypeName}s`;

  const runBulkAction = async (actionId: string) => {
    if (!selection?.onBulkAction || bulkPending || selection.selectedIds.length === 0) return;
    const ids = [...new Set(selection.selectedIds)];
    const requested = new Set(ids);
    setBulkPending(true);
    setBulkFeedback(null);
    try {
      const result = await selection.onBulkAction(ids, actionId);
      const failures = new Map(
        result.failures
          .filter((failure) => requested.has(failure.entryId))
          .map((failure) => [failure.entryId, failure.message ?? "Action failed."]),
      );
      const succeeded = new Set(
        result.succeededIds.filter((entryId) => requested.has(entryId) && !failures.has(entryId)),
      );
      for (const entryId of ids) {
        if (!succeeded.has(entryId) && !failures.has(entryId)) {
          failures.set(entryId, "No result was returned for this entry.");
        }
      }
      selection.onSelectionChange(
        (selectedIdsRef.current ?? []).filter((entryId) => !succeeded.has(entryId)),
      );
      setBulkFeedback({
        role: failures.size ? "alert" : "status",
        message: `${succeeded.size} completed; ${failures.size} failed.`,
        details: [...failures].map(([entryId, message]) => `${entryId}: ${message}`),
      });
    } catch (caught) {
      setBulkFeedback({ role: "alert", message: errorMessage(caught) });
    } finally {
      setBulkPending(false);
    }
  };

  if (permissionDenied) {
    return (
      <section className={["puzzle-cms-list", className].filter(Boolean).join(" ")}>
        <p role="alert">You do not have permission to view this content.</p>
      </section>
    );
  }

  return (
    <section
      className={["puzzle-cms-list", className].filter(Boolean).join(" ")}
      aria-labelledby={`${id}-title`}
    >
      <header className="puzzle-cms-list__header">
        <div>
          <h2 id={`${id}-title`}>{title}</h2>
          <p>
            {remote && remote.totalCount === undefined ? "On this page: " : ""}
            {count}{" "}
            {countLabel}
          </p>
        </div>
        {onCreate ? (
          <button type="button" onClick={onCreate}>
            Create {contentTypeName}
          </button>
        ) : null}
      </header>
      <div className="puzzle-cms-list__filters">
        <label>
          Search content
          <input
            type="search"
            value={search}
            onChange={(event) => {
              const next = event.currentTarget.value;
              if (remote) remote.onQueryChange({ ...remote.query, search: next });
              else setSearch(next);
            }}
          />
        </label>
        <label>
          Status
          <Select<CmsEntryStatus | "all">
            aria-label="Status"
            options={[
              { value: "all", label: "All statuses" },
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
              { value: "scheduled", label: "Scheduled" },
              { value: "archived", label: "Archived" },
            ]}
            value={status}
            onChange={(next) => {
              if (next === undefined) return;
              if (remote) remote.onQueryChange({ ...remote.query, status: next });
              else setStatus(next);
            }}
          />
        </label>
        {locales.length > 0 ? (
          <label>
            Locale
            <Select
              aria-label="Locale"
              options={[
                { value: "all", label: "All locales" },
                ...locales.map((itemLocale) => ({
                  value: itemLocale,
                  label: itemLocale,
                })),
              ]}
              value={locale}
              onChange={(next) => {
                if (next === undefined) return;
                if (remote) remote.onQueryChange({ ...remote.query, locale: next });
                else setLocale(next);
              }}
            />
          </label>
        ) : null}
      </div>
      {selection ? (
        <div className="puzzle-cms-list__selection" aria-label="Content selection">
          <label>
            <input
              type="checkbox"
              checked={filteredItems.length > 0 && filteredItems.every((item) => selection.selectedIds.includes(item.id))}
              ref={(input) => {
                if (input) {
                  input.indeterminate =
                    filteredItems.some((item) => selection.selectedIds.includes(item.id)) &&
                    !filteredItems.every((item) => selection.selectedIds.includes(item.id));
                }
              }}
              aria-checked={
                filteredItems.some((item) => selection.selectedIds.includes(item.id)) &&
                !filteredItems.every((item) => selection.selectedIds.includes(item.id))
                  ? "mixed"
                  : undefined
              }
              disabled={loading || bulkPending || filteredItems.length === 0}
              onChange={(event) => {
                const pageIds = new Set(filteredItems.map((item) => item.id));
                const next = event.currentTarget.checked
                  ? [...new Set([...selection.selectedIds, ...pageIds])]
                  : selection.selectedIds.filter((entryId) => !pageIds.has(entryId));
                selection.onSelectionChange(next);
              }}
            />
            {remote ? "Select this page" : "Select matching entries"}
          </label>
          <span>{selection.selectedIds.length} selected</span>
          {selection.onBulkAction
            ? selection.actions?.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  disabled={loading || bulkPending || selection.selectedIds.length === 0}
                  onClick={() => void runBulkAction(action.id)}
                >
                  {action.label}
                </button>
              ))
            : null}
        </div>
      ) : null}
      {bulkFeedback ? (
        <div role={bulkFeedback.role}>
          <p>{bulkFeedback.message}</p>
          {bulkFeedback.details?.length ? (
            <ul>{bulkFeedback.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
          ) : null}
        </div>
      ) : null}
      {error ? <p role="alert">{error}</p> : null}
      {loading ? (
        <p role="status">Loading content…</p>
      ) : filteredItems.length === 0 ? (
        <p className="puzzle-cms-list__empty">No matching content entries.</p>
      ) : (
        <DataTable<CmsEntryListItem>
          key={JSON.stringify(filteredItems)}
          numberOfItems={filteredItems.length}
          header={["Title", "Status", "Locale", "Updated", "Actions"]}
          itemsPerPage={remote ? undefined : 10}
          initialItems={tableItems}
          requestItems={async (start, end) => filteredItems.slice(start, end)}
          getSortValue={remote ? undefined : (item, columnIndex) => {
            if (columnIndex === 0) return entryTitle(item);
            if (columnIndex === 1) return item.status;
            if (columnIndex === 2) return item.locale;
            if (columnIndex === 3) {
              const timestamp =
                item.updatedAt instanceof Date
                  ? item.updatedAt.getTime()
                  : Date.parse(item.updatedAt);
              return Number.isNaN(timestamp) ? String(item.updatedAt) : timestamp;
            }
            return null;
          }}
          defaultSort={remote ? undefined : { columnIndex: 3, direction: "desc" }}
          renderCell={(item) => [
            <span className="puzzle-cms-list__title-cell" key="title">
              {selection ? (
                <input
                  type="checkbox"
                  aria-label={`Select ${entryTitle(item)}`}
                  checked={selection.selectedIds.includes(item.id)}
                  disabled={bulkPending}
                  onChange={(event) => {
                    selection.onSelectionChange(
                      event.currentTarget.checked
                        ? [...new Set([...selection.selectedIds, item.id])]
                        : selection.selectedIds.filter((entryId) => entryId !== item.id),
                    );
                  }}
                />
              ) : null}
              <strong>{entryTitle(item)}</strong>
              <span>{item.slug}</span>
            </span>,
            item.status,
            item.locale,
            formatDate(item.updatedAt),
            <span className="puzzle-cms-list__row-actions" key="actions">
              {onEdit ? (
                <button
                  type="button"
                  aria-label={`Edit ${entryTitle(item)}`}
                  onClick={() => onEdit(item)}
                >
                  Edit
                </button>
              ) : null}
              {onDuplicate ? (
                <button
                  type="button"
                  aria-label={`Duplicate ${entryTitle(item)}`}
                  onClick={() => onDuplicate(item)}
                >
                  Duplicate
                </button>
              ) : null}
              {onArchive && item.status !== "archived" ? (
                <button
                  type="button"
                  aria-label={`Archive ${entryTitle(item)}`}
                  onClick={() => onArchive(item)}
                >
                  Archive
                </button>
              ) : null}
            </span>,
          ]}
        />
      )}
      {remote && !permissionDenied ? (
        <nav className="puzzle-cms-list__pagination" aria-label="Content pages">
          <button type="button" onClick={remote.onPreviousPage} disabled={loading || !remote.hasPreviousPage}>
            Previous page
          </button>
          <button type="button" onClick={remote.onNextPage} disabled={loading || !remote.hasNextPage}>
            Next page
          </button>
        </nav>
      ) : null}
    </section>
  );
};
