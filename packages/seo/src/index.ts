import {
  SchemaReference as SchemaReferenceComponent,
  SeoMetadata as SeoMetadataComponent,
} from "./react";

import type { SeoMetadata as SeoMetadataData } from "./core";

import type { SchemaReference as SchemaReferenceData } from "./schema";

export const SchemaReference = SchemaReferenceComponent;
export type SchemaReference = SchemaReferenceData;

export const SeoMetadata = SeoMetadataComponent;
export type SeoMetadata = SeoMetadataData;

export type { SeoValidationIssue } from "./core";
export type { SeoValidationIssue as SeoValidationReportIssue } from "./validation";

export * from "./core";

export type * from "./context";
export type * from "./schema";
export type * from "./metadata";

export * from "./validation";
export * from "./react";

export type * from "./server";
export type * from "./sitemap";
export type * from "./robots";
export type * from "./urls";
export * from "./testing";

export * from "./sitemap";
export * from "./robots";
export * from "./urls";
