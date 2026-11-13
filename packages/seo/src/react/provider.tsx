"use client";

import { createElement, useMemo } from "react";

import { normalizeSeoConfig } from "../context";

import { resolveSeoMetadata } from "../metadata";

import type { SeoProviderProps } from "./types";

import { SeoReactContext } from "./context";

import {
  assertSeoValidationReport,
  normalizeValidation,
  SeoProvider as SeoSchemaProvider,
} from "./schema-components";

import { validateSeo } from "../validation/validate";

export const SeoProvider = ({
  config,
  metadata,
  children,
  validation,
  onValidation,
  ...schemaOptions
}: SeoProviderProps) => {
  const resolvedConfig = useMemo(() => normalizeSeoConfig(config), [config]);

  const resolvedMetadata = useMemo(() => {
    try {
      return resolveSeoMetadata(metadata ?? {}, resolvedConfig);
    } catch (error) {
      // Report unresolvable metadata (e.g. unsafe URLs) as validation
      // errors in strict mode instead of the raw resolution error.
      const options = normalizeValidation(validation ?? {});

      if (options !== false && metadata) {
        assertSeoValidationReport(
          validateSeo(
            { metadata },
            {
              ...options,
              baseUrl: options.baseUrl ?? resolvedConfig.siteUrl,
            },
          ),
        );
      }

      throw error;
    }
  }, [metadata, resolvedConfig, validation]);

  const contextValue = useMemo(
    () => ({
      config: resolvedConfig,
      metadata: resolvedMetadata,
    }),
    [resolvedConfig, resolvedMetadata],
  );

  return createElement(
    SeoReactContext.Provider,
    {
      value: contextValue,
    },
    createElement(SeoSchemaProvider, {
      config: resolvedConfig,
      metadata: resolvedMetadata,
      validation,
      onValidation,
      ...schemaOptions,
      children,
    }),
  );
};
