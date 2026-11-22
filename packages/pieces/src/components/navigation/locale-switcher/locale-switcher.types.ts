import type { ReactNode } from "react";

export type LocaleOption = {
  id: string;
  locale: string;
  label: string;
  href: string;
  icon?: ReactNode;
};

export type LocaleSwitcherPresentation = "dropdown" | "inline" | "compact";

export type LocaleSwitcherProps = {
  currentLocale: string;
  locales: readonly LocaleOption[];
  presentation?: LocaleSwitcherPresentation;
  label?: ReactNode;
  ariaLabel?: string;
  onLocaleChange?: (locale: LocaleOption) => void;
  className?: string;
};
