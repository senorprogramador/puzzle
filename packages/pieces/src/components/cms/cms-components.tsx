"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import type {
  CmsEntryStatus,
  CmsFields,
  CmsValue,
  FieldDescriptor,
  FieldValue,
  FieldsValue,
} from "@puzzle-ui/cms";
import {
  Breadcrumbs,
  DataTable,
  Dialog,
  JsonEditor,
  Select,
} from "@puzzle-ui/ui";
import { DashboardShell } from "../dashboard";
import { toDateTimeInputValue, toInstantInTimeZone } from "./time-zone.utils";
import type {
  AuditLogViewerProps,
  BlockEditorProps,
  CmsEntryListItem,
  CmsBlockDefinition,
  CmsBlockValue,
  CmsCollectionPresentation,
  CmsFieldRow,
  CmsFieldMap,
  CmsFieldRows,
  CmsNavigationItem,
  CmsRevisionItem,
  CmsShellProps,
  ContentEditorFieldContext,
  ContentEditorProps,
  ContentListProps,
  EditorialCalendarItem,
  EditorialCalendarProps,
  LocalizationEditorProps,
  PublishSchedulerProps,
  RelationshipFieldProps,
  RevisionHistoryProps,
} from "./cms.types";

import "./cms.css";

const errorMessage = (error: unknown) =>
  error instanceof Error && error.message
    ? error.message
    : typeof error === "string" && error
      ? error
      : "The action could not be completed.";

const scalarLabel = (value: CmsValue | undefined, fallback: string) => {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return fallback;
};

const entryTitle = (entry: CmsEntryListItem) =>
  scalarLabel(entry.fields.title, entry.slug || entry.id);

const CmsNavigation = ({
  items,
  activeId,
}: {
  items: readonly CmsNavigationItem[];
  activeId?: string;
}) => (
  <nav className="puzzle-cms-shell__navigation" aria-label="CMS navigation">
    {items.map((item) => (
      <a
        key={item.id}
        href={item.href}
        aria-current={item.id === activeId ? "page" : undefined}
      >
        {item.label}
      </a>
    ))}
  </nav>
);

export const CmsShell = ({
  children,
  title,
  description,
  navigation,
  activeNavigationId,
  breadcrumbs,
  topbar,
  actions,
  className,
}: CmsShellProps) => (
  <DashboardShell
    className={["puzzle-cms-shell", className].filter(Boolean).join(" ")}
    sidebar={
      <CmsNavigation items={navigation} activeId={activeNavigationId} />
    }
    sidebarLabel="CMS navigation"
    topbar={topbar}
  >
    <header className="puzzle-cms-shell__header">
      <div>
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {actions ? <div className="puzzle-cms-shell__actions">{actions}</div> : null}
    </header>
    {children}
  </DashboardShell>
);

const formatDate = (value: Date | string | null | undefined) => {
  if (!value) return "Not scheduled";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime())
    ? "Invalid date"
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
};

const dateTimeAttribute = (value: Date | string) => {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

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
            value={status}
            options={[
              { value: "all", label: "All statuses" },
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
              { value: "scheduled", label: "Scheduled" },
              { value: "archived", label: "Archived" },
            ]}
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
              value={locale}
              options={[
                { value: "all", label: "All locales" },
                ...locales.map((itemLocale) => ({
                  value: itemLocale,
                  label: itemLocale,
                })),
              ]}
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

const isJsonValue = (value: unknown): value is CmsValue =>
  value === null ||
  typeof value === "string" ||
  (typeof value === "number" && Number.isFinite(value)) ||
  typeof value === "boolean" ||
  (Array.isArray(value) && value.every(isJsonValue)) ||
  (typeof value === "object" &&
    value !== null &&
    Object.values(value).every(isJsonValue));

const useInvalidJsonDrafts = (onInvalidDraftChange?: (invalid: boolean) => void) => {
  const [invalidFields, setInvalidFields] = useState<ReadonlySet<string>>(new Set());
  const setValidity = useCallback((fieldKey: string, valid: boolean) => {
    setInvalidFields((current) => {
      if (current.has(fieldKey) === !valid) return current;
      const next = new Set(current);
      if (valid) next.delete(fieldKey);
      else next.add(fieldKey);
      return next;
    });
  }, []);
  const hasInvalidDraft = invalidFields.size > 0;
  useEffect(() => {
    onInvalidDraftChange?.(hasInvalidDraft);
  }, [hasInvalidDraft, onInvalidDraftChange]);
  return { hasInvalidDraft, setValidity };
};

const CmsJsonField = <TField extends CmsFieldRow,>({
  field,
  value,
  error,
  disabled,
  onChange,
  onValidityChange,
  validateValue,
}: ContentEditorFieldContext<TField> & {
  onValidityChange: (fieldKey: string, valid: boolean) => void;
  validateValue?: (value: CmsValue) => string | null;
}) => {
  const serializedValue = JSON.stringify(value ?? null, null, 2);
  const [source, setSource] = useState(serializedValue);
  const [draftError, setDraftError] = useState<string | null>(null);
  const lastEmitted = useRef<string | null>(null);

  useEffect(() => {
    const emitted = lastEmitted.current;
    lastEmitted.current = null;
    if (emitted === serializedValue) return;
    setSource(serializedValue);
    setDraftError(null);
    onValidityChange(field.key, true);
  }, [field.key, onValidityChange, serializedValue]);

  useEffect(() => () => onValidityChange(field.key, true), [field.key, onValidityChange]);

  return (
    <JsonEditor
      label={field.label}
      description={`Edit ${field.label} as JSON-compatible content.`}
      value={source}
      onChange={(nextSource) => {
        setSource(nextSource);
        let parsed: unknown;
        try {
          parsed = JSON.parse(nextSource);
        } catch (parseError) {
          if (!(parseError instanceof SyntaxError)) throw parseError;
          setDraftError("Enter valid JSON before continuing.");
          onValidityChange(field.key, false);
          return;
        }
        if (!isJsonValue(parsed)) {
          setDraftError("JSON numbers must be finite.");
          onValidityChange(field.key, false);
          return;
        }
        const validationError = validateValue?.(parsed) ?? null;
        if (validationError) {
          setDraftError(validationError);
          onValidityChange(field.key, false);
          return;
        }
        setDraftError(null);
        onValidityChange(field.key, true);
        lastEmitted.current = JSON.stringify(parsed, null, 2);
        onChange(parsed as FieldValue<TField>);
      }}
      disabled={disabled}
      required={field.required === true && field.defaultValue === undefined}
      error={draftError ?? error}
      validate={(parsed) => isJsonValue(parsed)
        ? validateValue?.(parsed) ?? null
        : "JSON numbers must be finite."}
    />
  );
};

const renderContentField = (
  context: ContentEditorFieldContext,
  idPrefix: string,
  onJsonValidityChange: (fieldKey: string, valid: boolean) => void,
  jsonReset: number,
) => {
  const { field, value, error, disabled, onChange } = context;
  const id = `${idPrefix}-${field.key}`;
  const errorId = `${id}-error`;
  const isRequired = field.required === true && field.defaultValue === undefined;
  const common = {
    id,
    disabled,
    required: isRequired,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
  } as const;

  if (field.type === "boolean") {
    return (
      <div className="puzzle-cms-editor__check-field">
        <input
          {...common}
          type="checkbox"
          checked={value === true}
          onChange={(event) => onChange(event.currentTarget.checked)}
        />
        <label htmlFor={id}>{field.label}{isRequired ? " *" : ""}</label>
      </div>
    );
  }

  if (field.type === "select" || field.type === "multiSelect") {
    const options = field.options ?? [];
    const selectOptions = options.map((option, index) => ({
      id: index,
      value: option.value,
      label: option.label,
    }));
    if (field.type === "multiSelect") {
      const selected = Array.isArray(value) ? value : [];
      return (
        <label className="puzzle-cms-field" htmlFor={id}>
          <span>{field.label}{isRequired ? " *" : ""}</span>
          <Select
            {...common}
            multiple
            aria-label={field.label}
            options={selectOptions}
            value={selected}
            onChange={onChange}
          />
          {error ? <span id={errorId} role="alert">{error}</span> : null}
        </label>
      );
    }
    return (
      <label className="puzzle-cms-field" htmlFor={id}>
        <span>{field.label}{isRequired ? " *" : ""}</span>
        <Select
          {...common}
          aria-label={field.label}
          options={selectOptions}
          value={options.find((option) => Object.is(option.value, value))?.value}
          placeholder="Choose…"
          onChange={(next) => {
            if (next !== undefined) onChange(next);
          }}
        />
        {error ? <span id={errorId} role="alert">{error}</span> : null}
      </label>
    );
  }

  if (
    ["array", "blocks", "computed", "custom", "json", "media", "object", "relationship", "richText"]
      .includes(field.type)
  ) {
    return (
      <CmsJsonField
        key={jsonReset}
        {...context}
        disabled={disabled || field.type === "computed"}
        onValidityChange={onJsonValidityChange}
      />
    );
  }

  const inputValue =
    value === null || value === undefined
      ? ""
      : typeof value === "string" || typeof value === "number"
        ? String(value)
        : "";
  const displayValue =
    field.type === "datetime" && inputValue
      ? (() => {
          const date = new Date(inputValue);
          return Number.isNaN(date.getTime())
            ? ""
            : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
        })()
      : inputValue;
  const inputType =
    field.type === "number"
      ? "number"
      : field.type === "date"
        ? "date"
        : field.type === "datetime"
          ? "datetime-local"
          : field.type === "email"
            ? "email"
            : field.type === "url"
              ? "url"
              : "text";
  const inputProps = {
    ...common,
    type: inputType,
    value: displayValue,
    min: field.validation?.min,
    max: field.validation?.max,
    minLength: field.validation?.minLength,
    maxLength: field.validation?.maxLength,
    pattern: field.validation?.pattern,
    onChange: (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const raw = event.currentTarget.value;
      if (field.type === "number") {
        onChange(raw === "" ? null : Number(raw));
        return;
      }
      if (field.type === "datetime") {
        if (raw === "") onChange(null);
        else {
          const date = new Date(raw);
          if (!Number.isNaN(date.getTime())) onChange(date.toISOString());
        }
        return;
      }
      onChange(raw);
    },
  };

  return (
    <label className="puzzle-cms-field" htmlFor={id}>
      <span>{field.label}{isRequired ? " *" : ""}</span>
      {field.type === "textarea" ? (
        <textarea {...inputProps} rows={4} />
      ) : (
        <input {...inputProps} />
      )}
      {field.type === "datetime" ? (
        <span className="puzzle-cms-field__hint">
          Entered in the browser's local timezone and stored as an ISO timestamp.
        </span>
      ) : null}
      {error ? <span id={errorId} role="alert">{error}</span> : null}
    </label>
  );
};

export const ContentEditor = <TFields extends CmsFieldMap = CmsFieldMap>({
  contentType,
  value,
  validationErrors = {},
  disabled = false,
  saving = false,
  dirty = false,
  confirmDiscard = false,
  warnOnUnload = false,
  onChange,
  onSaveDraft,
  onPublish,
  onDiscard,
  onInvalidDraftChange,
  renderField,
  className,
}: ContentEditorProps<TFields>) => {
  const id = useId();
  const [actionError, setActionError] = useState<string | null>(null);
  const [discardOpen, setDiscardOpen] = useState(false);
  const { hasInvalidDraft, setValidity: onJsonValidityChange } = useInvalidJsonDrafts(onInvalidDraftChange);
  const [jsonReset, setJsonReset] = useState(0);
  const effectiveDirty = dirty || hasInvalidDraft;
  useEffect(() => {
    if (!effectiveDirty || !warnOnUnload) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [effectiveDirty, warnOnUnload]);
  useEffect(() => {
    if (!effectiveDirty) setDiscardOpen(false);
  }, [effectiveDirty]);
  const updateField = (key: string, nextValue: unknown) => {
    const next = { ...value } as Record<string, unknown>;
    if (nextValue === undefined) delete next[key];
    else next[key] = nextValue;
    onChange(next as Partial<FieldsValue<NoInfer<TFields>>>);
  };
  const runAction = async (action: () => void | Promise<void>) => {
    setActionError(null);
    try {
      await action();
    } catch (error) {
      setActionError(errorMessage(error));
    }
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!hasInvalidDraft) void runAction(onSaveDraft);
  };
  const discard = () => {
    onDiscard?.();
    setJsonReset((current) => current + 1);
  };
  const contentTypeName = contentType.name ?? "Content";
  const fieldRows = Object.entries(contentType.fields).map(([key, descriptor]) => ({
    ...descriptor,
    key,
    label: descriptor.label ?? key,
  })) as unknown as CmsFieldRows<TFields>[];

  return (
    <form
      className={["puzzle-cms-editor", className].filter(Boolean).join(" ")}
      onSubmit={submit}
      aria-busy={saving}
    >
      <header className="puzzle-cms-editor__header">
        <div>
          <h2>{contentTypeName}</h2>
          <p>{contentType.description ?? `Edit ${contentTypeName.toLowerCase()} content.`}</p>
        </div>
        {effectiveDirty ? <span className="puzzle-cms-editor__dirty">Unsaved changes</span> : null}
      </header>
      <div className="puzzle-cms-editor__fields">
        {fieldRows.map((field) => {
          const fieldValue = Object.prototype.hasOwnProperty.call(value, field.key)
            ? (value as Readonly<Record<string, unknown>>)[field.key]
            : field.defaultValue;
          const context: ContentEditorFieldContext<CmsFieldRows<TFields>> = {
            field,
            value: fieldValue as FieldValue<CmsFieldRows<TFields>> | undefined,
            error: validationErrors[field.key],
            disabled: disabled || saving,
            onChange: (nextValue) => updateField(field.key, nextValue),
          };
          return (
            <div
              className="puzzle-cms-editor__field"
              key={field.key}
              id={`${id}-field-${field.key}`}
            >
              {renderField?.(context) ??
                renderContentField(
                  context as unknown as ContentEditorFieldContext,
                  id,
                  onJsonValidityChange,
                  jsonReset,
                )}
            </div>
          );
        })}
      </div>
      {actionError ? <p role="alert">{actionError}</p> : null}
      <footer className="puzzle-cms-editor__actions">
        {onDiscard ? (
          <button
            type="button"
            disabled={saving}
            onClick={() => {
              if (effectiveDirty && confirmDiscard) setDiscardOpen(true);
              else discard();
            }}
          >
            Discard
          </button>
        ) : null}
        <button type="submit" disabled={disabled || saving || hasInvalidDraft}>
          {saving ? "Saving…" : "Save draft"}
        </button>
        {onPublish ? (
          <button
            type="button"
            disabled={disabled || saving || hasInvalidDraft}
            onClick={() => {
              if (!hasInvalidDraft) void runAction(onPublish);
            }}
          >
            Publish
          </button>
        ) : null}
      </footer>
      {onDiscard && confirmDiscard ? (
        <Dialog
          open={discardOpen}
          onOpenChange={setDiscardOpen}
          title="Discard unsaved changes?"
          description="Your unsaved changes will be lost."
          footer={
            <>
              <button type="button" onClick={() => setDiscardOpen(false)}>Cancel</button>
              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  setDiscardOpen(false);
                  discard();
                }}
              >
                Discard changes
              </button>
            </>
          }
        />
      ) : null}
    </form>
  );
};

const isCmsBlock = (value: unknown): value is CmsBlockValue =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  "type" in value &&
  typeof value.type === "string" &&
  "fields" in value &&
  isCmsFields(value.fields);

const isCmsFields = (value: unknown): value is CmsFields =>
  isJsonValue(value) &&
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value);

const defaultCmsFields = (definitions: Readonly<Record<string, FieldDescriptor>>) =>
  Object.fromEntries(
    Object.entries(definitions).flatMap(([key, field]) =>
      field.defaultValue === undefined
        ? []
        : [[key, field.defaultValue] as const],
    ),
  ) as CmsFields;

export const BlockEditor = ({
  label,
  definitions,
  value,
  onChange,
  onInvalidDraftChange,
  renderBlock,
  disabled = false,
  error,
  className,
}: BlockEditorProps) => {
  const { hasInvalidDraft, setValidity } = useInvalidJsonDrafts(onInvalidDraftChange);
  const blocks = [...value];
  const updateBlock = (index: number, next: CmsBlockValue) => {
    const nextValue = [...blocks];
    nextValue[index] = next;
    onChange(nextValue);
  };

  return (
    <section
      className={["puzzle-cms-block-editor", className].filter(Boolean).join(" ")}
      aria-label={typeof label === "string" ? label : "Block editor"}
    >
      <header className="puzzle-cms-block-editor__header">
        <h3>{label}</h3>
        <div className="puzzle-cms-block-editor__add">
          {definitions.map((definition) => (
            <button
              type="button"
              key={definition.type}
              disabled={disabled || hasInvalidDraft}
              onClick={() =>
                onChange([
                  ...blocks,
                  {
                    type: definition.type,
                    fields: defaultCmsFields(definition.fields),
                  },
                ])
              }
            >
              Add {definition.type}
            </button>
          ))}
        </div>
      </header>
      {blocks.length === 0 ? (
        <p>No content blocks yet.</p>
      ) : (
        <ol className="puzzle-cms-block-editor__list">
          {blocks.map((rawBlock, index) => {
            if (!isCmsBlock(rawBlock)) {
              return (
                <li key={`invalid-${index}`}>
                  <p role="alert">This block is invalid and cannot be edited.</p>
                  <button
                    type="button"
                    disabled={disabled || hasInvalidDraft}
                    onClick={() => onChange(blocks.filter((_, itemIndex) => itemIndex !== index))}
                  >
                    Remove invalid block
                  </button>
                </li>
              );
            }
            const block = rawBlock;
            const definition = definitions.find((item) => item.type === block.type);
            const fields = block.fields;
            const changeFields = (nextFields: CmsFields) =>
              updateBlock(index, { type: block.type, fields: nextFields });
            return (
              <li key={`${block.type}-${index}`}>
                <div className="puzzle-cms-block-editor__block-header">
                  <h4>{definition?.type ?? block.type}</h4>
                  <div>
                    <button
                      type="button"
                      disabled={disabled || hasInvalidDraft || index === 0}
                      aria-label={`Move ${block.type} block up`}
                      onClick={() => {
                        const next = [...blocks];
                        [next[index - 1], next[index]] = [next[index]!, next[index - 1]!];
                        onChange(next);
                      }}
                    >
                      Move up
                    </button>
                    <button
                      type="button"
                      disabled={disabled || hasInvalidDraft || index === blocks.length - 1}
                      aria-label={`Move ${block.type} block down`}
                      onClick={() => {
                        const next = [...blocks];
                        [next[index], next[index + 1]] = [next[index + 1]!, next[index]!];
                        onChange(next);
                      }}
                    >
                      Move down
                    </button>
                    <button
                      type="button"
                      disabled={disabled || hasInvalidDraft}
                      onClick={() =>
                        onChange([
                          ...blocks.slice(0, index + 1),
                          { type: block.type, fields: { ...fields } },
                          ...blocks.slice(index + 1),
                        ])
                      }
                    >
                      Duplicate
                    </button>
                    <button
                      type="button"
                      disabled={disabled || hasInvalidDraft}
                      onClick={() => onChange(blocks.filter((_, itemIndex) => itemIndex !== index))}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                {definition && renderBlock ? (
                  renderBlock(definition, fields, changeFields)
                ) : (
                  <CmsJsonField
                    field={{
                      key: String(index),
                      type: "json",
                      label: `${block.type} fields`,
                    }}
                    value={fields}
                    disabled={disabled}
                    onValidityChange={setValidity}
                    validateValue={(next) => isCmsFields(next) ? null : "Fields must be a JSON object."}
                    onChange={(nextFields) => {
                      if (isCmsFields(nextFields)) changeFields(nextFields);
                    }}
                  />
                )}
              </li>
            );
          })}
        </ol>
      )}
      {error ? <p role="alert">{error}</p> : null}
    </section>
  );
};

export const LocalizationEditor = ({
  contentType,
  values,
  activeLocale,
  onActiveLocaleChange,
  onChange,
  onInvalidDraftChange,
  renderLocale,
  disabled = false,
  className,
}: LocalizationEditorProps) => {
  const { hasInvalidDraft, setValidity } = useInvalidJsonDrafts(onInvalidDraftChange);
  const locales = contentType.localization?.locales ?? [];
  const [internalLocale, setInternalLocale] = useState(
    activeLocale ?? contentType.localization?.defaultLocale ?? locales[0] ?? "",
  );
  const selectedLocale = activeLocale ?? internalLocale;
  const activeFields = values[selectedLocale] ?? {};
  const updateLocale = (locale: string) => {
    if (activeLocale === undefined) setInternalLocale(locale);
    onActiveLocaleChange?.(locale);
  };

  return (
    <section
      className={["puzzle-cms-localization", className].filter(Boolean).join(" ")}
      aria-label="Content translations"
    >
      <div className="puzzle-cms-localization__tabs" role="tablist" aria-label="Locales">
        {locales.map((locale) => {
          const exists = Boolean(values[locale]);
          return (
            <button
              type="button"
              role="tab"
              key={locale}
              id={`puzzle-cms-locale-tab-${locale}`}
              aria-selected={selectedLocale === locale}
              aria-controls={`puzzle-cms-locale-panel-${locale}`}
              tabIndex={selectedLocale === locale ? 0 : -1}
              disabled={disabled || (hasInvalidDraft && selectedLocale !== locale)}
              onClick={() => updateLocale(locale)}
            >
              {locale}
              <span className="puzzle-cms-localization__status">
                {exists ? "Translated" : "Missing"}
              </span>
            </button>
          );
        })}
      </div>
      {locales.includes(selectedLocale) ? (
        <div
          id={`puzzle-cms-locale-panel-${selectedLocale}`}
          role="tabpanel"
          aria-labelledby={`puzzle-cms-locale-tab-${selectedLocale}`}
          className="puzzle-cms-localization__panel"
        >
          {renderLocale ? (
            renderLocale(selectedLocale, activeFields, (next) => onChange(selectedLocale, next))
          ) : (
            <CmsJsonField
              field={{ key: selectedLocale, type: "json", label: `${selectedLocale} fields` }}
              value={activeFields}
              disabled={disabled}
              onValidityChange={setValidity}
              validateValue={(next) => isCmsFields(next) ? null : "Fields must be a JSON object."}
              onChange={(next) => {
                if (isCmsFields(next)) onChange(selectedLocale, next);
              }}
            />
          )}
        </div>
      ) : (
        <p role="status">No locales are configured for {contentType.name ?? "this collection"}.</p>
      )}
    </section>
  );
};

export const RelationshipField = ({
  label,
  relation,
  options,
  value,
  locale,
  loading = false,
  disabled = false,
  error,
  searchMode = "local",
  onSearch,
  onChange,
  className,
}: RelationshipFieldProps) => {
  const id = useId();
  const [query, setQuery] = useState("");
  if (searchMode === "remote" && !onSearch) {
    throw new TypeError("RelationshipField remote search requires onSearch.");
  }
  const allowedStatuses = relation.allowedStatuses;
  const missingLocale = Boolean(relation.sameLocale && !locale);
  const targets = typeof relation.target === "string"
    ? [relation.target]
    : relation.target;
  const allowedOptions = options.filter(
    (option) =>
      targets.includes(option.contentType) &&
      (!relation.sameLocale || (Boolean(locale) && option.locale === locale)) &&
      (!allowedStatuses || allowedStatuses.includes(option.status)),
  );
  const filteredOptions = searchMode === "remote"
    ? allowedOptions
    : allowedOptions.filter((option) =>
        option.label.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
      );
  const selectedIds = Array.isArray(value) ? value : value ? [value] : [];
  const multiple = relation.multiple ?? false;

  return (
    <fieldset
      className={["puzzle-cms-relationship", className].filter(Boolean).join(" ")}
      disabled={disabled}
      aria-describedby={error ? `${id}-error` : undefined}
    >
      <legend>{label}</legend>
      <label className="puzzle-cms-field">
        <span>Search related content</span>
        <input
          type="search"
          value={query}
          onChange={(event) => {
            const nextQuery = event.currentTarget.value;
            setQuery(nextQuery);
            onSearch?.(nextQuery);
          }}
        />
      </label>
      {missingLocale ? <p role="alert">A locale is required to select related content.</p> : null}
      {selectedIds.length > 0 ? (
        <div className="puzzle-cms-relationship__selected">
          <strong>Selected relationships</strong>
          <ul>
            {selectedIds.map((selectedId) => {
              const selected = allowedOptions.find((option) => option.id === selectedId);
              const selectedLabel = selected?.label ?? `Unavailable or outside current results (${selectedId})`;
              return (
                <li key={selectedId}>
                  <span>{selectedLabel}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${selectedLabel}`}
                    onClick={() =>
                      onChange(multiple ? selectedIds.filter((item) => item !== selectedId) : null)
                    }
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
      {loading ? <p role="status">Searching…</p> : null}
      {!loading && !missingLocale && filteredOptions.length === 0 ? <p>No related entries found.</p> : null}
      <ul className="puzzle-cms-relationship__options">
        {filteredOptions.map((option) => {
          const checked = selectedIds.includes(option.id);
          return (
            <li key={option.id}>
              <label>
                <input
                  type={multiple ? "checkbox" : "radio"}
                  name={`${id}-relationship`}
                  checked={checked}
                  onChange={() => {
                    if (!multiple) {
                      onChange(option.id);
                      return;
                    }
                    onChange(
                      checked
                        ? selectedIds.filter((id) => id !== option.id)
                        : [...selectedIds, option.id],
                    );
                  }}
                />
                <span>{option.label}</span>
                <small>{option.contentType} · {option.locale} · {option.status}</small>
              </label>
            </li>
          );
        })}
      </ul>
      {selectedIds.length > 0 ? (
        <button type="button" disabled={disabled} onClick={() => onChange(multiple ? [] : null)}>
          Clear selection
        </button>
      ) : null}
      {error ? <p id={`${id}-error`} role="alert">{error}</p> : null}
    </fieldset>
  );
};

const canonicalCmsValue = (value: CmsValue): string => {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalCmsValue).join(",")}]`;
  return `{${Object.entries(value)
    .sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0)
    .map(([key, item]) => `${JSON.stringify(key)}:${canonicalCmsValue(item)}`)
    .join(",")}}`;
};

const RevisionComparison = ({
  revision,
  current,
}: {
  revision: CmsRevisionItem;
  current: CmsRevisionItem;
}) => {
  const keys = [...new Set([...Object.keys(revision.fields), ...Object.keys(current.fields)])]
    .sort();
  const changes = keys.flatMap((key) => {
    const hadValue = Object.prototype.hasOwnProperty.call(revision.fields, key);
    const hasValue = Object.prototype.hasOwnProperty.call(current.fields, key);
    const before = revision.fields[key];
    const after = current.fields[key];
    if (
      hadValue === hasValue &&
      before !== undefined &&
      after !== undefined &&
      canonicalCmsValue(before) === canonicalCmsValue(after)
    ) return [];
    return [{ key, hadValue, hasValue, before, after }];
  });
  return (
    <details className="puzzle-cms-revisions__diff">
      <summary>
        Compare revision {revision.revisionNumber} with current revision {current.revisionNumber}
      </summary>
      {changes.length ? (
        <ul>
          {changes.map(({ key, hadValue, hasValue, before, after }) => (
            <li key={key}>
              <strong>{key}</strong>
              <div>
                <span>Revision {revision.revisionNumber}</span>
                <pre>{hadValue ? JSON.stringify(before, null, 2) : "Not present"}</pre>
              </div>
              <div>
                <span>Current revision {current.revisionNumber}</span>
                <pre>{hasValue ? JSON.stringify(after, null, 2) : "Not present"}</pre>
              </div>
            </li>
          ))}
        </ul>
      ) : <p>No field changes.</p>}
    </details>
  );
};

export const RevisionHistory = ({
  revisions,
  currentRevisionNumber,
  loading = false,
  error,
  confirmRestore = false,
  onRestore,
  className,
}: RevisionHistoryProps) => {
  const id = useId();
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [confirmRevisionId, setConfirmRevisionId] = useState<string | null>(null);
  const currentRevision = revisions.find(
    (revision) => revision.revisionNumber === currentRevisionNumber,
  );
  const confirmRevision = revisions.find((revision) => revision.id === confirmRevisionId);
  useEffect(() => {
    if (confirmRevisionId && !confirmRevision) setConfirmRevisionId(null);
  }, [confirmRevisionId, confirmRevision]);

  const restore = async (revision: CmsRevisionItem) => {
    if (!onRestore) return;
    setRestoringId(revision.id);
    setRestoreError(null);
    try {
      await onRestore(revision.id, revision.revisionNumber);
    } catch (restoreFailure) {
      setRestoreError(errorMessage(restoreFailure));
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <section
      className={["puzzle-cms-revisions", className].filter(Boolean).join(" ")}
      aria-labelledby={`${id}-title`}
    >
      <h2 id={`${id}-title`}>Revision history</h2>
      {error ? <p role="alert">{error}</p> : null}
      {restoreError ? <p role="alert">{restoreError}</p> : null}
      {loading ? <p role="status">Loading revisions…</p> : null}
      {!loading && revisions.length === 0 ? <p>No revisions yet.</p> : null}
      <ol className="puzzle-cms-revisions__list">
        {revisions.map((revision) => (
          <li key={revision.id}>
            <div>
              <strong>Revision {revision.revisionNumber}</strong>
              <span>{revision.action.replaceAll("-", " ")}</span>
              {dateTimeAttribute(revision.createdAt) ? (
                <time dateTime={dateTimeAttribute(revision.createdAt)}>
                  {formatDate(revision.createdAt)}
                </time>
              ) : (
                <span>{formatDate(revision.createdAt)}</span>
              )}
              <span>{revision.actorId ?? "System"} · {revision.status}</span>
              {revision.changeSummary ? <p>{revision.changeSummary}</p> : null}
              <details>
                <summary>Preview revision fields</summary>
                <pre>{JSON.stringify(revision.fields, null, 2)}</pre>
              </details>
              {currentRevision && revision.id !== currentRevision.id ? (
                <RevisionComparison revision={revision} current={currentRevision} />
              ) : null}
            </div>
            {onRestore ? (
              <button
                type="button"
                aria-label={`Restore revision ${revision.revisionNumber} as new revision`}
                disabled={
                  restoringId !== null ||
                  revision.revisionNumber === currentRevisionNumber
                }
                onClick={() => {
                  if (confirmRestore) setConfirmRevisionId(revision.id);
                  else void restore(revision);
                }}
              >
                {restoringId === revision.id ? "Restoring…" : "Restore as new revision"}
              </button>
            ) : null}
          </li>
        ))}
      </ol>
      {confirmRestore && onRestore ? (
        <Dialog
          open={Boolean(confirmRevision)}
          onOpenChange={(open) => {
            if (!open) setConfirmRevisionId(null);
          }}
          title="Restore this revision?"
          description={
            confirmRevision
              ? `Revision ${confirmRevision.revisionNumber} will be restored as a new revision.`
              : undefined
          }
          footer={
            <>
              <button type="button" onClick={() => setConfirmRevisionId(null)}>Cancel</button>
              <button
                type="button"
                disabled={
                  !confirmRevision ||
                  restoringId !== null ||
                  confirmRevision.revisionNumber === currentRevisionNumber
                }
                onClick={() => {
                  if (!confirmRevision) return;
                  setConfirmRevisionId(null);
                  void restore(confirmRevision);
                }}
              >
                Restore revision
              </button>
            </>
          }
        />
      ) : null}
    </section>
  );
};

export const PublishScheduler = ({
  scheduledAt = null,
  timeZone: initialTimeZone,
  disabled = false,
  scheduling = false,
  onSchedule,
  onCancelSchedule,
  className,
}: PublishSchedulerProps) => {
  const defaultTimeZone =
    initialTimeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC";
  const scheduledDate = useMemo(
    () => (scheduledAt === null ? null : new Date(scheduledAt)),
    [scheduledAt],
  );
  const validScheduledDate = useMemo(
    () =>
      scheduledDate && !Number.isNaN(scheduledDate.getTime())
        ? scheduledDate
        : null,
    [scheduledDate],
  );
  const [timeZone, setTimeZone] = useState(defaultTimeZone);
  const [dateTime, setDateTime] = useState(
    validScheduledDate
      ? toDateTimeInputValue(validScheduledDate, defaultTimeZone)
      : "",
  );
  const [actionError, setActionError] = useState<string | null>(null);
  const hasScheduledTime = scheduledAt !== null;

  useEffect(() => {
    setTimeZone(defaultTimeZone);
    setDateTime(
      validScheduledDate
        ? toDateTimeInputValue(validScheduledDate, defaultTimeZone)
        : "",
    );
  }, [defaultTimeZone, validScheduledDate]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActionError(null);
    try {
      const instant = toInstantInTimeZone(dateTime, timeZone);
      if (instant.getTime() <= Date.now()) {
        setActionError("Choose a publication time in the future.");
        return;
      }
      await onSchedule(instant, timeZone);
    } catch (error) {
      setActionError(errorMessage(error));
    }
  };

  const cancel = async () => {
    if (!onCancelSchedule) return;
    setActionError(null);
    try {
      await onCancelSchedule();
    } catch (error) {
      setActionError(errorMessage(error));
    }
  };

  return (
    <form
      className={["puzzle-cms-publish-scheduler", className].filter(Boolean).join(" ")}
      onSubmit={(event) => void submit(event)}
    >
      <h2>Publishing</h2>
      <label className="puzzle-cms-field">
        <span>Publish date and time</span>
        <input
          required
          type="datetime-local"
          value={dateTime}
          disabled={disabled || scheduling}
          onChange={(event) => setDateTime(event.currentTarget.value)}
        />
      </label>
      <label className="puzzle-cms-field">
        <span>Time zone (IANA)</span>
        <input
          required
          value={timeZone}
          disabled={disabled || scheduling}
          onChange={(event) => setTimeZone(event.currentTarget.value)}
          placeholder="Europe/Amsterdam"
        />
      </label>
      {scheduledAt ? (
        <p>
          Currently scheduled for{" "}
          {validScheduledDate
            ? new Intl.DateTimeFormat(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
                timeZone: defaultTimeZone,
              }).format(validScheduledDate)
            : "an invalid date"}
          ({defaultTimeZone}).
        </p>
      ) : null}
      {actionError ? <p role="alert">{actionError}</p> : null}
      <div className="puzzle-cms-publish-scheduler__actions">
        <button type="submit" disabled={disabled || scheduling}>
          {scheduling ? "Scheduling…" : "Schedule"}
        </button>
        {hasScheduledTime && onCancelSchedule ? (
          <button
            type="button"
            disabled={disabled || scheduling}
            onClick={() => void cancel()}
          >
            Cancel schedule
          </button>
        ) : null}
      </div>
      <p className="puzzle-cms-publish-scheduler__note">
        The server scheduler is responsible for publishing at this time.
      </p>
    </form>
  );
};

const dateKeyInTimeZone = (date: Date, timeZone: string) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
};

const utcDateKey = (date: Date) =>
  `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;

const calendarTitle = (date: Date, timeZone: string) =>
  new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
    timeZone,
  }).format(date);

export const EditorialCalendar = ({
  items,
  timeZone,
  initialMonth = new Date(),
  loading = false,
  onSelectItem,
  onMonthChange,
  className,
}: EditorialCalendarProps) => {
  const [month, setMonth] = useState(
    new Date(Date.UTC(initialMonth.getUTCFullYear(), initialMonth.getUTCMonth(), 1, 12)),
  );
  const [status, setStatus] = useState<CmsEntryStatus | "all">("all");
  const filtered = items.filter((item) => status === "all" || item.status === status);
  const start = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth(), 1));
  const offset = (start.getUTCDay() + 6) % 7;
  const gridStart = new Date(start.getTime() - offset * 86_400_000);
  const days = Array.from({ length: 42 }, (_, index) =>
    new Date(gridStart.getTime() + index * 86_400_000),
  );
  const itemsByDate = new Map<string, EditorialCalendarItem[]>();
  const invalidDateCount = filtered.filter((item) =>
    Number.isNaN(new Date(item.scheduledAt).getTime()),
  ).length;
  for (const item of filtered) {
    const scheduledDate = new Date(item.scheduledAt);
    if (Number.isNaN(scheduledDate.getTime())) continue;
    const key = dateKeyInTimeZone(scheduledDate, timeZone);
    const bucket = itemsByDate.get(key) ?? [];
    bucket.push(item);
    itemsByDate.set(key, bucket);
  }
  const changeMonth = (delta: number) => {
    const next = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + delta, 1, 12));
    setMonth(next);
    onMonthChange?.(next);
  };

  return (
    <section
      className={["puzzle-cms-calendar", className].filter(Boolean).join(" ")}
      aria-label={`Editorial calendar in ${timeZone}`}
    >
      <header className="puzzle-cms-calendar__header">
        <button type="button" aria-label="Previous month" onClick={() => changeMonth(-1)}>Previous</button>
        <h2>{calendarTitle(month, timeZone)}</h2>
        <button type="button" aria-label="Next month" onClick={() => changeMonth(1)}>Next</button>
        <label>
          Status
          <Select<CmsEntryStatus | "all">
            aria-label="Status"
            value={status}
            options={[
              { value: "all", label: "All statuses" },
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
              { value: "scheduled", label: "Scheduled" },
              { value: "archived", label: "Archived" },
            ]}
            onChange={(next) => {
              if (next !== undefined) setStatus(next);
            }}
          />
        </label>
      </header>
      {loading ? <p role="status">Loading schedule…</p> : null}
      {invalidDateCount > 0 ? (
        <p role="alert">
          {invalidDateCount} scheduled item{invalidDateCount === 1 ? "" : "s"} has an invalid date and cannot be placed.
        </p>
      ) : null}
      <div className="puzzle-cms-calendar__grid" role="grid" aria-label={calendarTitle(month, "UTC")}>
        <div className="puzzle-cms-calendar__row" role="row">
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
            <div className="puzzle-cms-calendar__weekday" role="columnheader" key={day}>
              {day}
            </div>
          ))}
        </div>
        {Array.from({ length: 6 }, (_, weekIndex) => (
          <div className="puzzle-cms-calendar__row" role="row" key={`week-${weekIndex}`}>
            {days.slice(weekIndex * 7, weekIndex * 7 + 7).map((day) => {
              const key = utcDateKey(day);
              const dateItems = itemsByDate.get(key) ?? [];
              const inMonth = day.getUTCMonth() === month.getUTCMonth();
              return (
                <div
                  className="puzzle-cms-calendar__day"
                  role="gridcell"
                  key={key}
                  aria-label={`${key}, ${dateItems.length} scheduled items`}
                  data-outside-month={!inMonth || undefined}
                >
                  <time dateTime={key}>{day.getUTCDate()}</time>
                  <ul>
                    {dateItems.map((item) => (
                      <li key={item.id}>
                        <button type="button" onClick={() => onSelectItem?.(item)}>
                          <span>{item.title}</span>
                          <small>{new Intl.DateTimeFormat(undefined, {
                            hour: "numeric",
                            minute: "2-digit",
                            timeZone,
                          }).format(new Date(item.scheduledAt))} · {item.locale}</small>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
};

export const AuditLogViewer = ({
  events,
  loading = false,
  error,
  pageSize = 10,
  className,
}: AuditLogViewerProps) => {
  const id = useId();
  const [resource, setResource] = useState("all");
  const [result, setResult] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  if (!Number.isInteger(pageSize) || pageSize <= 0) {
    throw new RangeError("AuditLogViewer pageSize must be a positive integer.");
  }
  const resources = [...new Set(events.map((event) => event.resource))].sort();
  const filtered = events.filter((event) => {
    const haystack =
      `${event.actorId ?? ""} ${event.action} ${event.resourceId}`.toLocaleLowerCase();
    return (
      (resource === "all" || event.resource === resource) &&
      (result === "all" || event.result === result) &&
      haystack.includes(search.trim().toLocaleLowerCase())
    );
  });
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount));
  }, [pageCount]);

  return (
    <section
      className={["puzzle-cms-audit", className].filter(Boolean).join(" ")}
      aria-labelledby={`${id}-title`}
    >
      <header>
        <h2 id={`${id}-title`}>Audit log</h2>
        <p>{filtered.length} events</p>
      </header>
      <div className="puzzle-cms-audit__filters">
        <label>
          Search
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.currentTarget.value);
              setPage(1);
            }}
          />
        </label>
        <label>
          Resource
          <Select
            aria-label="Resource"
            value={resource}
            options={[
              { value: "all", label: "All resources" },
              ...resources.map((item) => ({ value: item, label: item })),
            ]}
            onChange={(next) => {
              if (next === undefined) return;
              setResource(next);
              setPage(1);
            }}
          />
        </label>
        <label>
          Result
          <Select
            aria-label="Result"
            value={result}
            options={[
              { value: "all", label: "All results" },
              { value: "success", label: "Success" },
              { value: "denied", label: "Denied" },
              { value: "failure", label: "Failure" },
            ]}
            onChange={(next) => {
              if (next === undefined) return;
              setResult(next);
              setPage(1);
            }}
          />
        </label>
      </div>
      {error ? <p role="alert">{error}</p> : null}
      {loading ? <p role="status">Loading audit events…</p> : null}
      {!loading && visible.length === 0 ? <p>No audit events match these filters.</p> : null}
      {visible.length > 0 ? (
        <div className="puzzle-cms-audit__table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Time</th>
                <th scope="col">Actor</th>
                <th scope="col">Action</th>
                <th scope="col">Resource</th>
                <th scope="col">Result</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((event) => (
                <tr key={event.id}>
                  <td>
                    {dateTimeAttribute(event.timestamp) ? (
                      <time dateTime={dateTimeAttribute(event.timestamp)}>
                        {formatDate(event.timestamp)}
                      </time>
                    ) : (
                      formatDate(event.timestamp)
                    )}
                  </td>
                  <td>{event.actorId ?? "System"}</td>
                  <td>{event.action}</td>
                  <td>{event.resource}{event.resourceId ? ` · ${event.resourceId}` : ""}</td>
                  <td><span data-result={event.result}>{event.result}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {pageCount > 1 ? (
        <nav className="puzzle-cms-audit__pagination" aria-label="Audit log pages">
          <button type="button" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span>Page {page} of {pageCount}</span>
          <button type="button" disabled={page === pageCount} onClick={() => setPage(page + 1)}>Next</button>
        </nav>
      ) : null}
    </section>
  );
};

export type {
  AuditLogViewerProps,
  BlockEditorProps,
  CmsShellProps,
  ContentEditorProps,
  ContentListProps,
  EditorialCalendarProps,
  LocalizationEditorProps,
  PublishSchedulerProps,
  RelationshipFieldProps,
  RevisionHistoryProps,
};
