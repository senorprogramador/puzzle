import type {
  SeoConfig,
  SeoNode,
  SeoGraph,
  SeoPageMetadata,
  SchemaDefinition,
  SeoValidationResult,
  SitemapOptions,
  RobotsOptions,
} from "../index";

import type { SeoNode as CoreSeoNode } from "../core";

import type { SeoProviderProps } from "../react";

const config: SeoConfig = {
  siteUrl: "https://example.com",
  defaultLocale: "en",
  supportedLocales: ["en", "nl"],
  trailingSlash: "never",
};

const node: SeoNode = {
  "@type": "Organization",
  name: "Example",
  url: "https://example.com",
};

const graph: SeoGraph = {
  "@context": "https://schema.org",
  "@graph": [node],
};

const metadata: SeoPageMetadata = {
  title: "Example",
  description: "Example description",
  canonical: "https://example.com",
};

const definition: SchemaDefinition = {
  name: "Organization",
  type: "Organization",
  source: "generated",
};

const validation: SeoValidationResult = {
  valid: true,
  issues: [],
};

const sitemap: SitemapOptions = {
  baseUrl: "https://example.com",
  entries: [
    {
      url: "https://example.com/",
    },
  ],
};

const robots: RobotsOptions = {
  rules: [
    {
      userAgent: "*",
      allow: ["/"],
    },
  ],
};

type ReactProps = SeoProviderProps;

type CoreNode = CoreSeoNode;

const publicApi = {
  config,
  node,
  graph,
  metadata,
  definition,
  validation,
  sitemap,
  robots,
};

export type { ReactProps, CoreNode };

void publicApi;
