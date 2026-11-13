"use client";

import { createElement, useMemo } from "react";

import { normalizeSeoConfig } from "../context";

import { resolveSeoMetadata } from "../metadata";

import type { SeoProviderProps } from "./types";

import { SeoReactContext } from "./context";

import { SeoProvider as SeoSchemaProvider } from "./schema-components";

export const SeoProvider = ({
  config,
  metadata,
  children,
  validation,
  onValidation,
  ...schemaOptions
}: SeoProviderProps) => {
  const resolvedConfig = useMemo(() => normalizeSeoConfig(config), [config]);

  const resolvedMetadata = useMemo(
    () => resolveSeoMetadata(metadata ?? {}, resolvedConfig),
    [metadata, resolvedConfig],
  );

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
