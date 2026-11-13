"use client";

import { createContext, useContext } from "react";

import type { SeoResolvedConfig } from "../context/types";

import type { ResolvedSeoMetadata } from "../metadata/types";

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

export const useSeoMetadata = (): ResolvedSeoMetadata | undefined => {
  return useSeoReactContext().metadata;
};
