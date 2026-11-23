"use client";

import { useState } from "react";
import type { LocalizationEditorProps } from "./cms.types";
import { CmsJsonField, useInvalidJsonDrafts } from "./cms-json-field";
import { isCmsFields } from "./cms.utils";

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
  const locales = contentType.locales ?? [];
  const [internalLocale, setInternalLocale] = useState(
    activeLocale ?? contentType.defaultLocale ?? locales[0] ?? "",
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
        <p role="status">No locales are configured for {contentType.name}.</p>
      )}
    </section>
  );
};
