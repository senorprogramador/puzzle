import type { ReactNode } from "react";

import type { SeoConfig } from "../context/types";

import type { SeoPageMetadata } from "../metadata/types";

export interface SeoProviderProps {
  config: SeoConfig;

  children: ReactNode;
}

export interface SeoContextValue {
  config: SeoConfig;

  metadata?: SeoPageMetadata;
}

export interface SeoMetadataProps {
  metadata: SeoPageMetadata;
}

export interface SeoJsonLdProps {
  data: unknown;

  id?: string;

  nonce?: string;
}

export interface SeoHeadProps {
  children?: ReactNode;
}
