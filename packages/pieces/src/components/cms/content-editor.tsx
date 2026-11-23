"use client";

import { useEffect, useId, useState } from "react";
import type { FormEvent } from "react";
import type { CmsValue, ContentTypeDefinition } from "@puzzle-ui/cms";
import { Dialog } from "@puzzle-ui/ui";
import type { ContentEditorFieldContext, ContentEditorProps } from "./cms.types";
import { errorMessage } from "./cms.utils";
import { CmsJsonField, useInvalidJsonDrafts } from "./cms-json-field";

const renderContentField = (
  context: ContentEditorFieldContext,
  contentType: ContentTypeDefinition,
  idPrefix: string,
  onJsonValidityChange: (fieldKey: string, valid: boolean) => void,
  jsonReset: number,
) => {
  const { field, value, error, disabled, onChange } = context;
  const id = `${idPrefix}-${contentType.slug}-${field.key}`;
  const errorId = `${id}-error`;
  const common = {
    id,
    disabled,
    required: field.required,
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
        <label htmlFor={id}>{field.label}{field.required ? " *" : ""}</label>
      </div>
    );
  }

  if (field.type === "select" || field.type === "multiSelect") {
    const options = field.options ?? [];
    if (field.type === "multiSelect") {
      const selected = Array.isArray(value) ? value : [];
      return (
        <label className="puzzle-cms-field" htmlFor={id}>
          <span>{field.label}{field.required ? " *" : ""}</span>
          <select
            {...common}
            multiple
            value={selected.map((item) =>
              options.findIndex((option) => Object.is(option.value, item)).toString()
            )}
            onChange={(event) =>
              onChange(
                Array.from(event.currentTarget.selectedOptions)
                  .map((option) => options[Number(option.value)]?.value)
                  .filter((item): item is string | number | boolean =>
                    item !== undefined,
                  ),
              )
            }
          >
            {options.map((option, index) => (
              <option key={`${field.key}-${index}`} value={index}>{option.label}</option>
            ))}
          </select>
          {error ? <span id={errorId} role="alert">{error}</span> : null}
        </label>
      );
    }
    return (
      <label className="puzzle-cms-field" htmlFor={id}>
        <span>{field.label}{field.required ? " *" : ""}</span>
        <select
          {...common}
          value={options.findIndex((option) => Object.is(option.value, value)).toString()}
          onChange={(event) => {
            const option = options[Number(event.currentTarget.value)];
            if (option) onChange(option.value);
          }}
        >
          <option value="-1">Choose…</option>
          {options.map((option, index) => (
            <option key={`${field.key}-${index}`} value={index}>{option.label}</option>
          ))}
        </select>
        {error ? <span id={errorId} role="alert">{error}</span> : null}
      </label>
    );
  }

  if (["json", "richText", "repeater", "blocks"].includes(field.type)) {
    return (
      <CmsJsonField
        key={jsonReset}
        {...context}
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
          : "text";
  const inputProps = {
    ...common,
    type: inputType,
    value: displayValue,
    min: field.validation?.min,
    max: field.validation?.max,
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
      <span>{field.label}{field.required ? " *" : ""}</span>
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

export const ContentEditor = ({
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
}: ContentEditorProps) => {
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
  const updateField = (key: string, nextValue: CmsValue | undefined) => {
    const next = { ...value };
    if (nextValue === undefined) delete next[key];
    else next[key] = nextValue;
    onChange(next);
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

  return (
    <form
      className={["puzzle-cms-editor", className].filter(Boolean).join(" ")}
      onSubmit={submit}
      aria-busy={saving}
    >
      <header className="puzzle-cms-editor__header">
        <div>
          <h2>{contentType.name}</h2>
          <p>{contentType.description ?? `Edit ${contentType.name.toLowerCase()} content.`}</p>
        </div>
        {effectiveDirty ? <span className="puzzle-cms-editor__dirty">Unsaved changes</span> : null}
      </header>
      <div className="puzzle-cms-editor__fields">
        {contentType.fields.map((field) => {
          const context: ContentEditorFieldContext = {
            field,
            value: value[field.key],
            error: validationErrors[field.key],
            disabled: disabled || saving,
            onChange: (nextValue) => updateField(field.key, nextValue),
          };
          return (
            <div
              className="puzzle-cms-editor__field"
              key={field.key}
              id={`${id}-${field.key}`}
            >
              {renderField?.(context) ??
                renderContentField(context, contentType, id, onJsonValidityChange, jsonReset)}
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
