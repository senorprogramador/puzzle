"use client";

import { useId, useState } from "react";
import type { RelationshipFieldProps } from "./cms.types";

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
  const allowedOptions = options.filter(
    (option) =>
      relation.targetTypes.includes(option.contentType) &&
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
