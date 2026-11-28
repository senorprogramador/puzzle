"use client";

import { Select } from "@puzzle-ui/ui";
import type {
  LocaleOption,
  LocaleSwitcherPresentation,
  LocaleSwitcherProps,
} from "./locale-switcher.types";

import "./locale-switcher.css";

const changeLocale = (
  option: LocaleOption,
  onLocaleChange?: (locale: LocaleOption) => void,
) => {
  if (onLocaleChange) {
    onLocaleChange(option);
    return;
  }

  if (typeof window !== "undefined") {
    window.location.assign(option.href);
  }
};

const LocaleSwitcher = ({
  currentLocale,
  locales,
  presentation = "dropdown",
  label = "Language",
  ariaLabel = "Choose language",
  onLocaleChange,
  className,
}: LocaleSwitcherProps) => {
  const current = locales.find((locale) => locale.locale === currentLocale);

  return (
    <div
      className={["puzzle-locale-switcher", className].filter(Boolean).join(" ")}
      data-presentation={presentation satisfies LocaleSwitcherPresentation}
      lang={currentLocale}
    >
      <span className="puzzle-locale-switcher__label">{label}</span>
      {presentation === "inline" ? (
        <nav aria-label={ariaLabel}>
          <ul className="puzzle-locale-switcher__links">
            {locales.map((locale) => (
              <li key={locale.id}>
                <a
                  className="puzzle-locale-switcher__link"
                  href={locale.href}
                  lang={locale.locale}
                  aria-current={locale.locale === currentLocale ? "true" : undefined}
                  onClick={() => onLocaleChange?.(locale)}
                >
                  {locale.icon ? <span aria-hidden="true">{locale.icon}</span> : null}
                  <span>{locale.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : (
        <Select
          className="puzzle-locale-switcher__select"
          value={current?.id}
          options={locales.map((locale) => ({
            id: locale.id,
            value: locale.id,
            label: locale.label,
          }))}
          placeholder=""
          aria-label={ariaLabel}
          renderOption={(option) => {
            const locale = locales.find((item) => item.id === option.value);
            return <span lang={locale?.locale}>{option.label}</span>;
          }}
          onChange={(localeId) => {
            const option = locales.find((locale) => locale.id === localeId);
            if (option) changeLocale(option, onLocaleChange);
          }}
        />
      )}
    </div>
  );
};

export { LocaleSwitcher };
