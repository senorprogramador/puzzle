"use client";

import type { CmsFieldDefinition, CmsFields, CmsValue } from "@puzzle-ui/cms";
import type { BlockEditorProps } from "./cms.types";
import { CmsJsonField, useInvalidJsonDrafts } from "./cms-json-field";
import { isCmsFields, isJsonValue } from "./cms.utils";

const isCmsBlock = (value: CmsValue): value is CmsValue & {
  readonly type: string;
  readonly fields: CmsFields;
} =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  "type" in value &&
  typeof value.type === "string" &&
  "fields" in value &&
  isCmsFields(value.fields);

const defaultCmsFields = (definitions: readonly CmsFieldDefinition[]) =>
  Object.fromEntries(
    definitions.flatMap((field) =>
      field.defaultValue === undefined
        ? []
        : [[field.key, field.defaultValue] as const],
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
  const updateBlock = (index: number, next: CmsValue) => {
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
