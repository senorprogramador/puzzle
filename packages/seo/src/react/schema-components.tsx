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
  SchemaComponentType,
  SchemaGraphProps,
  SchemaProps,
  SchemaReferenceProps,
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
const registerSchema = <Type extends SchemaComponentType>(
  collector: SchemaCollector,
  type: Type,
  props: SchemaComponentProps<Type>,
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
 * Registers one or more Schema.org nodes into the central graph.
 *
 * This component never renders its own script element.
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
 * Explicitly named alias for the central JSON-LD registration component.
 *
 * The script itself is still rendered once by SeoProvider.
 */
export const SchemaScript = SeoJsonLd;

/**
 * Registers an existing collection of nodes or a complete graph.
 *
 * This makes it possible to compose graph data from separate modules
 * without creating additional graph builders or JSON-LD scripts.
 */
export const SchemaGraph = (props: SchemaGraphProps) => {
  const collector = useSchemaCollector();

  if (props.graph !== undefined) {
    collector.builder.addMany(props.graph["@graph"]);
    return null;
  }

  collector.builder.addMany(props.nodes);

  return null;
};

/**
 * Registers an entity reference in the central graph.
 *
 * A reference without a matching node becomes a minimal Thing node.
 * When a full node with the same @id is registered elsewhere, the graph
 * engine merges the two nodes.
 */
export const SchemaReference = ({
  id,
  type = "Thing",
}: SchemaReferenceProps) => {
  const collector = useSchemaCollector();

  collector.builder.add({
    "@id": id,
    "@type": type,
  });

  return null;
};

/**
 * Factory for strongly named Schema.org components.
 *
 * The component type is fixed. Properties are derived from the generated
 * Schema.org registry definitions, including inherited properties.
 */
const createSchemaComponent = <Type extends SchemaComponentType>(
  type: Type,
) => {
  const Component = (props: SchemaComponentProps<Type>): null => {
    const collector = useSchemaCollector();

    return registerSchema(collector, type, props);
  };

  return Component;
};

// ---------------------------------------------------------------------------
// Organization / Person
// ---------------------------------------------------------------------------

export const LDOrganization = createSchemaComponent("Organization");

export const LDPerson = createSchemaComponent("Person");

// ---------------------------------------------------------------------------
// WebSite / WebPage
// ---------------------------------------------------------------------------

export const LDWebSite = createSchemaComponent("WebSite");

/**
 * Alternative spelling for convenience.
 */
export const LDWebsite = LDWebSite;

export const LDWebPage = createSchemaComponent("WebPage");

// ---------------------------------------------------------------------------
// Article / BlogPosting
// ---------------------------------------------------------------------------

export const LDArticle = createSchemaComponent("Article");

export const LDBlogPosting = createSchemaComponent("BlogPosting");

// ---------------------------------------------------------------------------
// BreadcrumbList
// ---------------------------------------------------------------------------

export const LDBreadcrumbList = createSchemaComponent("BreadcrumbList");

export const LDBreadcrumbs = LDBreadcrumbList;

// ---------------------------------------------------------------------------
// Product / Offer / AggregateRating / Review
// ---------------------------------------------------------------------------

export const LDProduct = createSchemaComponent("Product");

export const LDOffer = createSchemaComponent("Offer");

export const LDAggregateRating = createSchemaComponent("AggregateRating");

export const LDReview = createSchemaComponent("Review");

// ---------------------------------------------------------------------------
// LocalBusiness / Service
// ---------------------------------------------------------------------------

export const LDLocalBusiness = createSchemaComponent("LocalBusiness");

export const LDService = createSchemaComponent("Service");

// ---------------------------------------------------------------------------
// ImageObject / VideoObject / Event
// ---------------------------------------------------------------------------

export const LDImageObject = createSchemaComponent("ImageObject");

export const LDVideoObject = createSchemaComponent("VideoObject");

export const LDEvent = createSchemaComponent("Event");

// ---------------------------------------------------------------------------
// Additional Schema.org components
// ---------------------------------------------------------------------------

export const LDRecipe = createSchemaComponent("Recipe");

export const LDCourse = createSchemaComponent("Course");

export const LDJobPosting = createSchemaComponent("JobPosting");

export const LDPlace = createSchemaComponent("Place");

export const LDPostalAddress = createSchemaComponent("PostalAddress");

export const LDContactPoint = createSchemaComponent("ContactPoint");

export const LDSearchAction = createSchemaComponent("SearchAction");

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
