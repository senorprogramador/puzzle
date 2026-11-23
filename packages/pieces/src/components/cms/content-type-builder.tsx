"use client";

import { useEffect, useId, useState } from "react";
import type { CmsFieldType, CmsFieldDefinition, ContentTypeDefinition } from "@puzzle-ui/cms";
import type { ContentTypeBuilderProps } from "./cms.types";
import { errorMessage } from "./cms.utils";

const cmsFieldTypes = [
  "text",
  "textarea",
  "richText",
  "number",
  "boolean",
  "date",
  "datetime",
  "slug",
  "select",
  "multiSelect",
  "media",
  "relationship",
  "repeater",
  "blocks",
  "json",
  "locale",
] satisfies readonly CmsFieldType[];

const reservedFieldKeys = new Set([
  "id",
  "tenantId",
  "contentTypeId",
  "revisionNumber",
  "status",
  "createdAt",
  "updatedAt",
]);

const contentTypeIssues = (definition: ContentTypeDefinition) => {
  const issues: string[] = [];
  const seen = new Set<string>();
  for (const field of definition.fields) {
    if (!/^[a-z][a-zA-Z0-9_]*$/.test(field.key)) {
      issues.push(`"${field.key}" must start with a lowercase letter and contain only letters, numbers, or underscores.`);
    }
    if (reservedFieldKeys.has(field.key)) issues.push(`"${field.key}" is reserved.`);
    if (seen.has(field.key)) issues.push(`"${field.key}" is duplicated.`);
    seen.add(field.key);
  }
  return issues;
};

const newField = (fields: readonly CmsFieldDefinition[]): CmsFieldDefinition => {
  const keys = new Set(fields.map((field) => field.key));
  let number = fields.length + 1;
  while (keys.has(`field_${number}`)) number += 1;
  return { key: `field_${number}`, type: "text", label: `Field ${number}` };
};

export const ContentTypeBuilder = ({
  value,
  onChange,
  onSave,
  saving = false,
  disabled = false,
  renderFieldSettings,
  className,
}: ContentTypeBuilderProps) => {
  const id = useId();
  const [saveError, setSaveError] = useState<string | null>(null);
  const localesText = (value.locales ?? []).join(", ");
  const [localeDraft, setLocaleDraft] = useState(localesText);
  const [editingLocales, setEditingLocales] = useState(false);
  useEffect(() => {
    const parsedDraft = localeDraft.split(",").map((locale) => locale.trim()).filter(Boolean).join(", ");
    if (!editingLocales || parsedDraft !== localesText) setLocaleDraft(localesText);
  }, [editingLocales, localeDraft, localesText]);
  const issues = contentTypeIssues(value);
  const updateField = (index: number, nextField: CmsFieldDefinition) =>
    onChange({
      ...value,
      fields: value.fields.map((field, fieldIndex) =>
        fieldIndex === index ? nextField : field,
      ),
    });
  const changeFieldType = (
    field: CmsFieldDefinition,
    type: CmsFieldDefinition["type"],
  ) => {
    const {
      options: _options,
      relation: _relation,
      fields: _fields,
      blocks: _blocks,
      ...shared
    } = field;
    return {
      ...shared,
      type,
      ...(type === "select" || type === "multiSelect" ? { options: field.options } : {}),
      ...(type === "relationship" ? { relation: field.relation } : {}),
      ...(type === "repeater" ? { fields: field.fields } : {}),
      ...(type === "blocks" ? { blocks: field.blocks } : {}),
    } satisfies CmsFieldDefinition;
  };
  const runSave = async () => {
    setSaveError(null);
    try {
      await onSave?.();
    } catch (error) {
      setSaveError(errorMessage(error));
    }
  };

  return (
    <section
      className={["puzzle-cms-type-builder", className].filter(Boolean).join(" ")}
      aria-labelledby={`${id}-title`}
    >
      <header>
        <h2 id={`${id}-title`}>Content type</h2>
        <p>Define the fields and locales available to this content type.</p>
      </header>
      <div className="puzzle-cms-type-builder__meta">
        <label className="puzzle-cms-field">
          <span>Name</span>
          <input
            disabled={disabled}
            value={value.name}
            onChange={(event) => onChange({ ...value, name: event.currentTarget.value })}
          />
        </label>
        <label className="puzzle-cms-field">
          <span>Slug</span>
          <input
            disabled={disabled}
            value={value.slug}
            onChange={(event) => onChange({ ...value, slug: event.currentTarget.value })}
          />
        </label>
        <label className="puzzle-cms-field">
          <span>Description</span>
          <input
            disabled={disabled}
            value={value.description ?? ""}
            onChange={(event) =>
              onChange({ ...value, description: event.currentTarget.value || undefined })
            }
          />
        </label>
        <label className="puzzle-cms-field">
          <span>Schema version</span>
          <input
            disabled={disabled}
            type="number"
            min={1}
            value={value.version}
            onChange={(event) =>
              onChange({ ...value, version: Math.max(1, Number(event.currentTarget.value) || 1) })
            }
          />
        </label>
        <label className="puzzle-cms-field">
          <span>Locales (comma separated)</span>
          <input
            disabled={disabled}
            value={localeDraft}
            onFocus={() => setEditingLocales(true)}
            onBlur={() => setEditingLocales(false)}
            onChange={(event) => {
              const nextDraft = event.currentTarget.value;
              setLocaleDraft(nextDraft);
              onChange({
                ...value,
                locales: nextDraft
                  .split(",")
                  .map((locale) => locale.trim())
                  .filter(Boolean),
              });
            }}
          />
        </label>
        <label className="puzzle-cms-field">
          <span>Default locale</span>
          <select
            disabled={disabled}
            value={value.defaultLocale ?? ""}
            onChange={(event) =>
              onChange({
                ...value,
                defaultLocale: event.currentTarget.value || undefined,
              })
            }
          >
            <option value="">No default</option>
            {(value.locales ?? []).map((locale) => (
              <option value={locale} key={locale}>{locale}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="puzzle-cms-type-builder__fields">
        <div className="puzzle-cms-type-builder__fields-heading">
          <h3>Fields</h3>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange({ ...value, fields: [...value.fields, newField(value.fields)] })}
          >
            Add field
          </button>
        </div>
        {value.fields.map((field, index) => (
          <fieldset className="puzzle-cms-type-builder__field" key={index}>
            <legend>{field.label || `Field ${index + 1}`}</legend>
            <label className="puzzle-cms-field">
              <span>Key</span>
              <input
                disabled={disabled}
                value={field.key}
                onChange={(event) =>
                  updateField(index, { ...field, key: event.currentTarget.value })
                }
              />
            </label>
            <label className="puzzle-cms-field">
              <span>Label</span>
              <input
                disabled={disabled}
                value={field.label}
                onChange={(event) =>
                  updateField(index, { ...field, label: event.currentTarget.value })
                }
              />
            </label>
            <label className="puzzle-cms-field">
              <span>Field type</span>
              <select
                disabled={disabled}
                value={field.type}
                onChange={(event) =>
                  updateField(index, {
                    ...changeFieldType(
                      field,
                      event.currentTarget.value as CmsFieldDefinition["type"],
                    ),
                  })
                }
              >
                {cmsFieldTypes.map((type) => (
                  <option value={type} key={type}>{type}</option>
                ))}
              </select>
            </label>
            <label className="puzzle-cms-type-builder__check">
              <input
                disabled={disabled}
                type="checkbox"
                checked={field.required ?? false}
                onChange={(event) => updateField(index, { ...field, required: event.currentTarget.checked })}
              />
              Required
            </label>
            <label className="puzzle-cms-type-builder__check">
              <input
                disabled={disabled}
                type="checkbox"
                checked={field.localized ?? false}
                onChange={(event) => updateField(index, { ...field, localized: event.currentTarget.checked })}
              />
              Localized
            </label>
            {renderFieldSettings?.(field, index, (next) => updateField(index, next))}
            <div className="puzzle-cms-type-builder__field-actions">
              <button
                type="button"
                disabled={disabled || index === 0}
                aria-label={`Move ${field.label} field up`}
                onClick={() => {
                  const fields = [...value.fields];
                  [fields[index - 1], fields[index]] = [fields[index]!, fields[index - 1]!];
                  onChange({ ...value, fields });
                }}
              >
                Move up
              </button>
              <button
                type="button"
                disabled={disabled || index === value.fields.length - 1}
                aria-label={`Move ${field.label} field down`}
                onClick={() => {
                  const fields = [...value.fields];
                  [fields[index], fields[index + 1]] = [fields[index + 1]!, fields[index]!];
                  onChange({ ...value, fields });
                }}
              >
                Move down
              </button>
              <button
                type="button"
                disabled={disabled}
                onClick={() =>
                  onChange({ ...value, fields: value.fields.filter((_, fieldIndex) => fieldIndex !== index) })
                }
              >
                Remove field
              </button>
            </div>
          </fieldset>
        ))}
      </div>
      {issues.length > 0 ? (
        <ul className="puzzle-cms-type-builder__issues" role="alert">
          {issues.map((issue) => <li key={issue}>{issue}</li>)}
        </ul>
      ) : null}
      {saveError ? <p role="alert">{saveError}</p> : null}
      {onSave ? (
        <button type="button" disabled={disabled || saving || issues.length > 0} onClick={() => void runSave()}>
          {saving ? "Saving…" : "Save content type"}
        </button>
      ) : null}
    </section>
  );
};
