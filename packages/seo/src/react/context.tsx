"use client";

import { createContext, useContext } from "react";

import type { SeoResolvedConfig } from "../context/types";

import { resolveSeoMetadata } from "../metadata";

import type { ResolvedSeoMetadata, SeoPageMetadata } from "../metadata/types";

export interface SeoReactContextValue {
  config: SeoResolvedConfig;
  metadata?: ResolvedSeoMetadata;
}

export const SeoReactContext = createContext<SeoReactContextValue | null>(null);

export const useSeoReactContext = (): SeoReactContextValue => {
  const context = useContext(SeoReactContext);

  if (!context) {
    throw new Error("Puzzle SEO hooks must be used inside SeoProvider.");
  }

  return context;
};

export const useSeoConfig = (): SeoResolvedConfig => {
  return useSeoReactContext().config;
};

/**
 * Returns the metadata from the closest SEO context.
 *
 * Passing metadata explicitly resolves it against the current config.
 * This is useful when a route component owns its metadata object.
 */
export const useSeoMetadata = (
  metadata?: SeoPageMetadata,
): ResolvedSeoMetadata | undefined => {
  const context = useSeoReactContext();

  if (metadata) {
    return resolveSeoMetadata(metadata, context.config);
  }

  return context.metadata;
};
