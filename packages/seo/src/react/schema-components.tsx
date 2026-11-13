"use client";
import { createContext, createElement, Fragment, useContext } from "react";

import { createSeoGraphBuilder, stringifySeoGraph } from "../core";

import type {
  SeoGraph,
  SeoNode,
  SeoGraphBuilder,
  SeoGraphBuilderOptions,
} from "../core";

import { createDefaultSchemaRegistry, validateSchemaNode } from "../schema";

import type { SchemaRegistry, SchemaValidationOptions } from "../schema";

import type { SeoConfig } from "../context/types";

import type {
  SchemaComponentProps,
  SchemaProps,
  SeoJsonLdProps,
  SeoProviderProps,
} from "./types";

interface SchemaCollector {
  config: SeoConfig;
  builder: SeoGraphBuilder;
  registry: SchemaRegistry;
  validation: SchemaValidationOptions | false;
  nonce?: string;
  scriptId: string;
}

const defaultRegistry = createDefaultSchemaRegistry();

const SchemaContext = createContext<SchemaCollector | null>(null);

const useSchemaCollector = (): SchemaCollector => {
  const collector = useContext(SchemaContext);

  if (!collector) {
    throw new Error(
      "Puzzle SEO schema components must be rendered inside SeoProvider.",
    );
  }

  return collector;
};

const validateGraph = (
  graph: SeoGraph,
  registry: SchemaRegistry,
  options: SchemaValidationOptions | false,
): void => {
  if (options === false) {
    return;
  }

  const issues = graph["@graph"].flatMap(
    (node) => validateSchemaNode(node, registry, options).issues,
  );

  if (options.strict && issues.some((issue) => issue.severity === "error")) {
    const messages = issues
      .filter((issue) => issue.severity === "error")
      .map((issue) => issue.message);

    throw new Error(
      `Puzzle SEO schema validation failed:\n${messages.join("\n")}`,
    );
  }
};

interface SchemaGraphOutputProps {
  collector: SchemaCollector;
}

const SchemaGraphOutput = ({ collector }: SchemaGraphOutputProps) => {
  const graph = collector.builder.build();
  const graphIssues = collector.builder.getIssues();

  const graphErrors = graphIssues.filter((issue) => issue.severity === "error");

  if (graphErrors.length > 0) {
    throw new Error(
      `Puzzle SEO graph validation failed:\n${graphErrors
        .map((issue) => issue.message)
        .join("\n")}`,
    );
  }

  if (graph["@graph"].length === 0) {
    return null;
  }

  validateGraph(graph, collector.registry, collector.validation);

  const json = stringifySeoGraph(graph, {
    pretty: false,
    safe: true,
    scriptSafe: true,
    validate: true,
  });

  return createElement("script", {
    id: collector.scriptId,
    type: "application/ld+json",
    nonce: collector.nonce,
    dangerouslySetInnerHTML: {
      __html: json,
    },
  });
};

/**
 * Central SEO provider.
 *
 * Creates an isolated graph builder for every render.
 * All descendant schema components register into this graph.
 *
 * The final JSON-LD script is rendered after the children.
 */
export const SeoProvider = ({
  config,
  children,
  scriptId = "puzzle-seo-jsonld",
  nonce,
  graphOptions,
  schemaRegistry,
  validation = {},
}: SeoProviderProps) => {
  const options: SeoGraphBuilderOptions = {
    ...graphOptions,
    baseUrl: graphOptions?.baseUrl ?? config.siteUrl,
  };

  const collector: SchemaCollector = {
    config,
    builder: createSeoGraphBuilder(options),
    registry: schemaRegistry ?? defaultRegistry,
    validation,
    nonce,
    scriptId,
  };

  return createElement(
    SchemaContext.Provider,
    {
      value: collector,
    },
    createElement(
      Fragment,
      null,
      children,
      createElement(SchemaGraphOutput, {
        collector,
      }),
    ),
  );
};

/**
 * Registers a Schema.org node.
 *
 * All properties are preserved. The graph engine is responsible
 * for normalization, references, deduplication and ID generation.
 */
const registerSchema = (
  collector: SchemaCollector,
  type: string,
  props: SchemaComponentProps,
): null => {
  const { id, data, ...properties } = props;

  const node: Record<string, unknown> = {
    ...data,
    ...properties,
    "@type": type,
  };

  if (id !== undefined) {
    node["@id"] = id;
  }

  collector.builder.add(node as SeoNode);

  return null;
};

/**
 * Generic Schema.org component.
 *
 * Supports generated Schema.org definitions and custom types.
 */
export const Schema = ({ type, id, data, properties }: SchemaProps) => {
  const collector = useSchemaCollector();

  const node: Record<string, unknown> = {
    ...data,
    ...properties,
    "@type": type,
  };

  if (id !== undefined) {
    node["@id"] = id;
  }

  collector.builder.add(node as SeoNode);

  return null;
};

/**
 * Backwards-compatible generic JSON-LD registration component.
 *
 * Unlike standalone JSON-LD components, this component registers
 * nodes into the central graph.
 */
export const SeoJsonLd = ({ data, id, nonce }: SeoJsonLdProps) => {
  const collector = useSchemaCollector();

  if (nonce) {
    if (collector.nonce && collector.nonce !== nonce) {
      throw new Error(
        "Conflicting CSP nonces were provided to SeoProvider and SeoJsonLd.",
      );
    }

    collector.nonce = nonce;
  }

  if (Array.isArray(data)) {
    collector.builder.addMany(data);
    return null;
  }

  const value = data as SeoGraph | SeoNode;

  if (
    typeof value === "object" &&
    value !== null &&
    "@graph" in value &&
    Array.isArray(value["@graph"])
  ) {
    collector.builder.addMany(value["@graph"]);
    return null;
  }

  if (typeof value !== "object" || value === null || !("@type" in value)) {
    throw new Error("SeoJsonLd requires a Schema.org node or graph.");
  }

  const node: SeoNode = {
    ...value,
    ...(id !== undefined ? { "@id": id } : {}),
  } as SeoNode;

  collector.builder.add(node);

  return null;
};

/**
 * Factory for strongly named Schema.org components.
 *
 * The component type is fixed. All data flows through the
 * shared Schema Registry and Graph Engine.
 */
const createSchemaComponent = (type: string) => {
  const Component = (props: SchemaComponentProps): null => {
    const collector = useSchemaCollector();

    return registerSchema(collector, type, props);
  };

  return Component;
};

// ---------------------------------------------------------------------------
// E4.2 — Organization / Person
// ---------------------------------------------------------------------------

export const LDOrganization = createSchemaComponent("Organization");

export const LDPerson = createSchemaComponent("Person");

// ---------------------------------------------------------------------------
// E4.3 — WebSite / WebPage
// ---------------------------------------------------------------------------

export const LDWebSite = createSchemaComponent("WebSite");

/**
 * Alternative spelling for convenience.
 */
export const LDWebsite = LDWebSite;

export const LDWebPage = createSchemaComponent("WebPage");

// ---------------------------------------------------------------------------
// E4.4 — Article / BlogPosting
// ---------------------------------------------------------------------------

export const LDArticle = createSchemaComponent("Article");

export const LDBlogPosting = createSchemaComponent("BlogPosting");

// ---------------------------------------------------------------------------
// E4.5 — BreadcrumbList
// ---------------------------------------------------------------------------

export const LDBreadcrumbList = createSchemaComponent("BreadcrumbList");

export const LDBreadcrumbs = LDBreadcrumbList;

// ---------------------------------------------------------------------------
// E4.6 — Product / Offer / AggregateRating / Review
// ---------------------------------------------------------------------------

export const LDProduct = createSchemaComponent("Product");

export const LDOffer = createSchemaComponent("Offer");

export const LDAggregateRating = createSchemaComponent("AggregateRating");

export const LDReview = createSchemaComponent("Review");

// ---------------------------------------------------------------------------
// E4.7 — LocalBusiness / Service
// ---------------------------------------------------------------------------

export const LDLocalBusiness = createSchemaComponent("LocalBusiness");

export const LDService = createSchemaComponent("Service");

// ---------------------------------------------------------------------------
// E4.8 — ImageObject / VideoObject / Event
// ---------------------------------------------------------------------------

export const LDImageObject = createSchemaComponent("ImageObject");

export const LDVideoObject = createSchemaComponent("VideoObject");

export const LDEvent = createSchemaComponent("Event");

// ---------------------------------------------------------------------------
// E4.9 — Additional Schema.org components
// ---------------------------------------------------------------------------

export const LDRecipe = createSchemaComponent("Recipe");

export const LDCourse = createSchemaComponent("Course");

export const LDJobPosting = createSchemaComponent("JobPosting");

export const LDPlace = createSchemaComponent("Place");

export const LDItemList = createSchemaComponent("ItemList");

export const LDSoftwareApplication = createSchemaComponent(
  "SoftwareApplication",
);

export const LDHowTo = createSchemaComponent("HowTo");

export const LDFaqPage = createSchemaComponent("FAQPage");

export const LDFAQPage = LDFaqPage;

export const LDCollectionPage = createSchemaComponent("CollectionPage");

export const LDProfilePage = createSchemaComponent("ProfilePage");

/**
 * Exposes the current SEO configuration to descendant components.
 *
 * The returned registration method is scoped to the current provider.
 */
export const useSeo = () => {
  const collector = useSchemaCollector();

  return {
    config: collector.config,

    registerNode: (node: SeoNode) => {
      collector.builder.add(node);
    },
  };
};
