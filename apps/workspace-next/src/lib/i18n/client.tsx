"use client";

import { createI18nReact } from "@puzzle-ui/i18n/react";

import { i18n } from "./config";

const bindings = createI18nReact(i18n);

export const LocaleProvider = bindings.Provider;
export const useLocaleAttributes = bindings.useLocaleAttributes;
export const useTranslation = bindings.useTranslation;
