"use client";

import {
  createContext,
  createElement,
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { createSeoGraphBuilder, stringifySeoGraph } from "../core";

import type {
  SeoGraph,
  SeoNode,
  SeoGraphBuilder,
  SeoGraphBuilderOptions,
} from "../core";

import { createDefaultSchemaRegistry } from "../schema";

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
import type { ResolvedSeoMetadata } from "../metadata/types";
import type {
  SeoValidationOptions,
  SeoValidationReport,
} from "../validation/types";
import { validateSeo } from "../validation/validate";

/**
 * Client-side node registry.
 *
 * Render-phase collection only works when every schema component renders
 * before the output in the same pass, which holds for server rendering but
 * not on the client (Suspense, code-split routes, navigation). On the client,
 * components therefore register their nodes from effects and unregister on
 * unmount, and the output subscribes to this store.
 */
interface SchemaStore {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => number;
  register: (nodes: readonly SeoNode[]) => () => void;
  getNodes: () => SeoNode[];
}

const createSchemaStore = (): SchemaStore => {
  const entries = new Map<symbol, readonly SeoNode[]>();
  const listeners = new Set<() => void>();
  let version = 0;

  const notify = () => {
    version += 1;

    for (const listener of listeners) {
      listener();
    }
  };

  return {
    subscribe(listener) {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },

    getSnapshot: () => version,

    register(nodes) {
      const key = Symbol("schema-registration");

      entries.set(key, nodes);
      notify();

      return () => {
        if (entries.delete(key)) {
          notify();
        }
      };
    },

    getNodes: () => [...entries.values()].flat(),
  };
};

// Store versions start at 0, so -1 identifies the server/hydration render.
const SERVER_SNAPSHOT = -1;

const getServerSnapshot = () => SERVER_SNAPSHOT;

interface SchemaCollector {
  config: SeoConfig;
  builder: SeoGraphBuilder;
  graphOptions: SeoGraphBuilderOptions;
  store: SchemaStore;
  registry: SchemaRegistry;
  metadata?: ResolvedSeoMetadata;
  validation: SeoValidationOptions | false;
  onValidation?: (report: SeoValidationReport) => void;
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

const EMPTY_SIGNATURE = "[]";

/**
 * Returns a render-time registration function for the current component.
 *
 * Nodes are added to the render-phase builder for server rendering and
 * synchronized with the client store after commit. The registration is
 * replaced when the nodes change and removed when the component unmounts.
 */
const useSchemaRegistration = (collector: SchemaCollector) => {
  const nodes: SeoNode[] = [];
  const registration = useRef<{
    signature: string;
    unregister?: () => void;
  }>({ signature: EMPTY_SIGNATURE });

  useEffect(() => {
    const signature = JSON.stringify(nodes);

    if (signature === registration.current.signature) {
      return;
    }

    registration.current.unregister?.();
    registration.current = {
      signature,
      unregister:
        nodes.length > 0 ? collector.store.register(nodes) : undefined,
    };
  });

  useEffect(
    () => () => {
      registration.current.unregister?.();
      registration.current = { signature: EMPTY_SIGNATURE };
    },
    [collector.store],
  );

  return (node: SeoNode) => {
    collector.builder.add(node);
    nodes.push(node);
  };
};

/**
 * Throws when a strict validation report contains errors.
 */
export const assertSeoValidationReport = (report: SeoValidationReport): void => {
  if (report.mode !== "strict" || report.valid) {
    return;
  }

  const errors = report.issues.filter((issue) => issue.severity === "error");

  const messages = errors.map(
    (issue) => `[${issue.source}:${issue.code}] ${issue.message}`,
  );

  // Keep the established message when only schema rules failed.
  const scope =
    errors.length > 0 &&
    errors.every(
      (issue) => issue.source === "schema" || issue.source === "registry",
    )
      ? "schema validation"
      : "validation";

  throw new Error(`Puzzle SEO ${scope} failed:\n${messages.join("\n")}`);
};

interface SchemaGraphOutputProps {
  collector: SchemaCollector;
}

const SchemaGraphOutput = ({ collector }: SchemaGraphOutputProps) => {
  const version = useSyncExternalStore(
    collector.store.subscribe,
    collector.store.getSnapshot,
    getServerSnapshot,
  );

  const isServerSnapshot = version === SERVER_SNAPSHOT;

  // While hydrating, client-side schema components may not have rendered
  // yet (e.g. inside a suspended route), so the server markup is reused
  // verbatim. The store-based graph replaces it right after hydration.
  const hydratingScript =
    isServerSnapshot && typeof document !== "undefined"
      ? document.getElementById(collector.scriptId)
      : null;

  let builder = collector.builder;

  if (!isServerSnapshot) {
    builder = createSeoGraphBuilder(collector.graphOptions).addMany(
      collector.store.getNodes(),
    );
  }

  const graph = builder.build();
  const graphIssues = hydratingScript ? [] : builder.getIssues();

  const graphErrors = graphIssues.filter((issue) => issue.severity === "error");

  const report =
    collector.validation !== false && !hydratingScript
      ? validateSeo(
          {
            graph,
            metadata: collector.metadata,
          },
          {
            ...collector.validation,
            registry: collector.validation.registry ?? collector.registry,
            baseUrl: collector.validation.baseUrl ?? collector.config.siteUrl,
          },
        )
      : undefined;

  useEffect(() => {
    if (report && collector.onValidation) {
      collector.onValidation(report);
    }
  }, [report, collector.onValidation]);

  if (graphErrors.length > 0) {
    throw new Error(
      `Puzzle SEO graph validation failed:\n${graphErrors
        .map((issue) => issue.message)
        .join("\n")}`,
    );
  }

  if (report) {
    assertSeoValidationReport(report);
  }

  if (hydratingScript) {
    return createElement("script", {
      id: collector.scriptId,
      type: "application/ld+json",
      nonce: collector.nonce,
      dangerouslySetInnerHTML: {
        __html: hydratingScript.textContent ?? "",
      },
    });
  }

  // Metadata-only validation is supported. An empty graph simply means
  // that there is no JSON-LD script to render.
  if (graph["@graph"].length === 0) {
    return null;
  }

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
 * Legacy options are identified by `strict`, the only property that
 * SeoValidationOptions does not share; `mode` always wins when present.
 */
const isLegacyValidation = (
  validation: SeoValidationOptions | SchemaValidationOptions,
): validation is SchemaValidationOptions =>
  "strict" in validation && !("mode" in validation);

export const normalizeValidation = (
  validation: SeoValidationOptions | SchemaValidationOptions | false,
): SeoValidationOptions | false => {
  if (validation === false) {
    return false;
  }

  if (!isLegacyValidation(validation)) {
    return validation;
  }

  const { strict, ...options } = validation;

  return {
    ...options,
    mode: strict ? "strict" : "warn",
  };
};

/**
 * Props for the internal schema provider. The public SeoProvider resolves
 * page metadata before passing it on, so it arrives here already resolved.
 */
export interface SchemaProviderProps extends Omit<
  SeoProviderProps,
  "metadata"
> {
  metadata?: ResolvedSeoMetadata;
}

/**
 * Central SEO provider.
 *
 * Creates an isolated graph builder for every server render; in the browser
 * the graph is rebuilt from mounted schema components.
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
  metadata,
  validation = {},
  onValidation,
}: SchemaProviderProps) => {
  const options: SeoGraphBuilderOptions = {
    ...graphOptions,
    baseUrl: graphOptions?.baseUrl ?? config.siteUrl,
  };

  const normalizedValidation = normalizeValidation(validation);

  const [store] = useState(createSchemaStore);

  const collector: SchemaCollector = {
    config,
    builder: createSeoGraphBuilder(options),
    graphOptions: options,
    store,
    registry:
      normalizedValidation !== false
        ? (normalizedValidation.registry ?? schemaRegistry ?? defaultRegistry)
        : (schemaRegistry ?? defaultRegistry),
    metadata,
    validation: normalizedValidation,
    onValidation,
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
  register: (node: SeoNode) => void,
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

  register(node as SeoNode);

  return null;
};

/**
 * Generic Schema.org component.
 *
 * Supports generated Schema.org definitions and custom types.
 */
export const Schema = ({ type, id, data, properties }: SchemaProps) => {
  const register = useSchemaRegistration(useSchemaCollector());

  const node: Record<string, unknown> = {
    ...data,
    ...properties,
    "@type": type,
  };

  if (id !== undefined) {
    node["@id"] = id;
  }

  register(node as SeoNode);

  return null;
};

/**
 * Registers one or more Schema.org nodes into the central graph.
 *
 * This component never renders its own script element.
 */
export const SeoJsonLd = ({ data, id, nonce }: SeoJsonLdProps) => {
  const collector = useSchemaCollector();
  const register = useSchemaRegistration(collector);

  if (nonce) {
    if (collector.nonce && collector.nonce !== nonce) {
      throw new Error(
        "Conflicting CSP nonces were provided to SeoProvider and SeoJsonLd.",
      );
    }

    collector.nonce = nonce;
  }

  if (Array.isArray(data)) {
    data.forEach(register);
    return null;
  }

  const value = data as SeoGraph | SeoNode;

  if (
    typeof value === "object" &&
    value !== null &&
    "@graph" in value &&
    Array.isArray(value["@graph"])
  ) {
    value["@graph"].forEach(register);
    return null;
  }

  if (typeof value !== "object" || value === null || !("@type" in value)) {
    throw new Error("SeoJsonLd requires a Schema.org node or graph.");
  }

  const node: SeoNode = {
    ...value,
    ...(id !== undefined ? { "@id": id } : {}),
  } as SeoNode;

  register(node);

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
  const register = useSchemaRegistration(useSchemaCollector());

  if (props.graph !== undefined) {
    props.graph["@graph"].forEach(register);
    return null;
  }

  props.nodes.forEach(register);

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
  const register = useSchemaRegistration(useSchemaCollector());

  register({
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
    const register = useSchemaRegistration(useSchemaCollector());

    return registerSchema(register, type, props);
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
  const register = useSchemaRegistration(collector);

  return {
    config: collector.config,

    registerNode: register,
  };
};
