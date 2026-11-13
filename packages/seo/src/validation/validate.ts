import { createSeoNode, validateSeoGraph } from "../core";

import type { SeoGraph, SeoNode } from "../core";

import { createDefaultSchemaRegistry, validateSchemaNode } from "../schema";

import type { SchemaRegistry } from "../schema";

import type { ResolvedSeoMetadata, SeoPageMetadata } from "../metadata/types";

import type {
  SeoCustomValidator,
  SeoRichResultProfile,
  SeoValidationContext,
  SeoValidationIssue,
  SeoValidationMode,
  SeoValidationOptions,
  SeoValidationReport,
  SeoValidationSource,
  SeoValidationSummary,
  SeoValidationInput,
} from "./types";

const defaultRegistry = createDefaultSchemaRegistry();

const SCHEMA_DOCS = "https://schema.org/";

const GOOGLE_DOCS =
  "https://developers.google.com/search/docs/appearance/structured-data";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getTypes = (node: SeoNode): string[] => {
  const value = node["@type"];

  return (Array.isArray(value) ? value : [value]).filter(
    (type): type is string =>
      typeof type === "string" && type.trim().length > 0,
  );
};

const getProperty = (node: SeoNode, property: string): unknown =>
  node[property];

const hasValue = (value: unknown): boolean => {
  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return true;
};

const getNodes = (graph?: SeoGraph): SeoNode[] => graph?.["@graph"] ?? [];

const createIssue = (
  source: SeoValidationSource,
  code: string,
  message: string,
  severity: SeoValidationIssue["severity"] = "warning",
  details: Partial<
    Pick<
      SeoValidationIssue,
      "path" | "nodeId" | "property" | "suggestion" | "docsUrl"
    >
  > = {},
): SeoValidationIssue => ({
  source,
  code,
  message,
  severity,
  ...details,
});

const normalizeMode = (mode: SeoValidationMode): SeoValidationMode => mode;

const normalizeSeverity = (
  severity: SeoValidationIssue["severity"],
  mode: SeoValidationMode,
): SeoValidationIssue["severity"] => {
  if (mode === "strict" && severity === "warning") {
    return "error";
  }

  return severity;
};

const createSummary = (
  issues: readonly SeoValidationIssue[],
): SeoValidationSummary => {
  const summary = {
    errors: 0,
    warnings: 0,
    infos: 0,
    total: issues.length,
  };

  for (const issue of issues) {
    switch (issue.severity) {
      case "error":
        summary.errors += 1;
        break;

      case "warning":
        summary.warnings += 1;
        break;

      case "info":
        summary.infos += 1;
        break;
    }
  }

  return summary;
};

const createReport = (
  mode: SeoValidationMode,
  issues: SeoValidationIssue[],
): SeoValidationReport => {
  const normalizedIssues = issues.map((issue) => ({
    ...issue,
    severity: normalizeSeverity(issue.severity, mode),
  }));

  const summary = createSummary(normalizedIssues);

  return {
    valid: summary.errors === 0,
    mode,
    issues: normalizedIssues,
    summary,
  };
};

// ---------------------------------------------------------------------------
// Graph validation
// ---------------------------------------------------------------------------

const validateGraph = (
  graph: SeoGraph,
  options: SeoValidationOptions,
  registry: SchemaRegistry,
): SeoValidationIssue[] => {
  const issues: SeoValidationIssue[] = [];

  if (!Array.isArray(graph["@graph"])) {
    return [
      createIssue(
        "graph",
        "invalid-graph",
        "SEO graph must contain an @graph array.",
        "error",
      ),
    ];
  }

  const result = validateSeoGraph(graph, {
    baseUrl: options.baseUrl,
    strictReferences: options.mode === "strict",
    allowedExternalReferences: options.allowExternalReferences ?? true,
  });

  for (const issue of result.issues) {
    issues.push(
      createIssue("graph", issue.code, issue.message, issue.severity, {
        path: issue.path,
        nodeId: issue.nodeId,
        property: issue.property,
        suggestion:
          issue.code === "unresolved-reference"
            ? "Register the referenced node or verify its @id."
            : undefined,
      }),
    );
  }

  for (let index = 0; index < graph["@graph"].length; index += 1) {
    const node = graph["@graph"][index];

    if (!isObject(node)) {
      continue;
    }

    const nodeId = typeof node["@id"] === "string" ? node["@id"] : undefined;

    const result = validateSchemaNode(node, registry, {
      strict: options.mode === "strict",
      allowUnknownProperties: options.mode !== "strict",
      validateRequiredProperties: options.validateRequiredProperties ?? false,
    });

    for (const issue of result.issues) {
      issues.push(
        createIssue("schema", issue.code, issue.message, issue.severity, {
          path: issue.path
            ? `@graph[${index}]${issue.path.replace("$", "")}`
            : `@graph[${index}]`,
          nodeId,
          property: issue.property,
          suggestion:
            issue.code === "unknown-property"
              ? "Check the Schema.org property name or extend the registry."
              : issue.code === "unknown-type"
                ? "Use a registered Schema.org type or add a custom definition."
                : undefined,
          docsUrl: SCHEMA_DOCS,
        }),
      );
    }
  }

  return issues;
};

// ---------------------------------------------------------------------------
// Semantic validation
// ---------------------------------------------------------------------------

const validateDate = (value: unknown): boolean => {
  if (typeof value !== "string") {
    return false;
  }

  return value.trim().length > 0 && !Number.isNaN(Date.parse(value));
};

const validateSemanticNode = (
  node: SeoNode,
  index: number,
): SeoValidationIssue[] => {
  const issues: SeoValidationIssue[] = [];

  const types = getTypes(node);

  const nodeId = typeof node["@id"] === "string" ? node["@id"] : undefined;

  const path = `@graph[${index}]`;

  const add = (
    code: string,
    message: string,
    property: string,
    suggestion: string,
  ) => {
    issues.push(
      createIssue("semantic", code, message, "warning", {
        path: `${path}.${property}`,
        nodeId,
        property,
        suggestion,
        docsUrl: SCHEMA_DOCS,
      }),
    );
  };

  // Article

  if (
    types.some((type) =>
      ["Article", "NewsArticle", "BlogPosting", "TechArticle"].includes(
        type.split("/").pop() ?? type,
      ),
    )
  ) {
    if (!hasValue(node.headline)) {
      add(
        "article-missing-headline",
        "Article nodes should provide a headline.",
        "headline",
        "Add a descriptive headline.",
      );
    }

    if (hasValue(node.datePublished) && !validateDate(node.datePublished)) {
      add(
        "invalid-publication-date",
        "Article datePublished is not a valid date.",
        "datePublished",
        "Use a valid ISO 8601 date or datetime.",
      );
    }

    if (hasValue(node.dateModified) && !validateDate(node.dateModified)) {
      add(
        "invalid-modification-date",
        "Article dateModified is not a valid date.",
        "dateModified",
        "Use a valid ISO 8601 date or datetime.",
      );
    }

    if (
      hasValue(node.datePublished) &&
      hasValue(node.dateModified) &&
      validateDate(node.datePublished) &&
      validateDate(node.dateModified) &&
      Date.parse(String(node.dateModified)) <
        Date.parse(String(node.datePublished))
    ) {
      add(
        "modification-before-publication",
        "Article dateModified is earlier than datePublished.",
        "dateModified",
        "Verify the publication and modification dates.",
      );
    }
  }

  // Product

  if (
    types.includes("Product") ||
    types.includes("https://schema.org/Product")
  ) {
    if (!hasValue(node.name)) {
      add(
        "product-missing-name",
        "Product nodes should provide a name.",
        "name",
        "Add the product's visible name.",
      );
    }

    if (
      hasValue(node.offers) &&
      !Array.isArray(node.offers) &&
      !isObject(node.offers)
    ) {
      add(
        "invalid-product-offers",
        "Product offers must be an Offer node or an array of Offer nodes.",
        "offers",
        "Provide an Offer object or an array of Offer objects.",
      );
    }
  }

  // Offer

  if (types.includes("Offer") || types.includes("https://schema.org/Offer")) {
    if (hasValue(node.price)) {
      const price = Number(node.price);

      if (!Number.isFinite(price) || price < 0) {
        add(
          "invalid-offer-price",
          "Offer price must be a non-negative finite number.",
          "price",
          "Provide a valid numeric price.",
        );
      }
    }

    if (hasValue(node.price) && !hasValue(node.priceCurrency)) {
      add(
        "offer-missing-currency",
        "Offers with a price should specify priceCurrency.",
        "priceCurrency",
        "Provide an ISO 4217 currency code, such as EUR or USD.",
      );
    }

    if (
      hasValue(node.priceCurrency) &&
      !/^[A-Z]{3}$/.test(String(node.priceCurrency))
    ) {
      add(
        "invalid-price-currency",
        "Offer priceCurrency should use an ISO 4217 currency code.",
        "priceCurrency",
        "Use a three-letter uppercase currency code.",
      );
    }
  }

  // BreadcrumbList

  if (
    types.includes("BreadcrumbList") ||
    types.includes("https://schema.org/BreadcrumbList")
  ) {
    const elements = node.itemListElement;

    if (!Array.isArray(elements) || elements.length === 0) {
      add(
        "breadcrumb-missing-items",
        "BreadcrumbList should contain itemListElement entries.",
        "itemListElement",
        "Add at least one ListItem.",
      );
    } else {
      const positions = new Set<number>();

      elements.forEach((item, itemIndex) => {
        if (!isObject(item)) {
          add(
            "invalid-breadcrumb-item",
            "Breadcrumb entries should be ListItem objects.",
            `itemListElement[${itemIndex}]`,
            "Provide a ListItem with position, name and item.",
          );

          return;
        }

        const position = Number(item.position);

        if (
          !Number.isInteger(position) ||
          position < 1 ||
          positions.has(position)
        ) {
          add(
            "invalid-breadcrumb-position",
            "Breadcrumb positions must be unique positive integers.",
            `itemListElement[${itemIndex}].position`,
            "Use sequential positions starting at 1.",
          );
        } else {
          positions.add(position);
        }

        if (!hasValue(item.name)) {
          add(
            "breadcrumb-missing-name",
            "Breadcrumb ListItem should provide a name.",
            `itemListElement[${itemIndex}].name`,
            "Provide the visible breadcrumb label.",
          );
        }

        if (!hasValue(item.item) && itemIndex !== elements.length - 1) {
          add(
            "breadcrumb-missing-item",
            "Breadcrumb ListItem should provide an item URL.",
            `itemListElement[${itemIndex}].item`,
            "Provide the destination URL.",
          );
        }
      });
    }
  }

  return issues;
};

// ---------------------------------------------------------------------------
// Rich Results profiles
// ---------------------------------------------------------------------------

interface RichResultRule {
  type: string;
  required: readonly string[];
}

const richResultRules: Record<SeoRichResultProfile, RichResultRule> = {
  article: {
    type: "Article",
    required: ["headline", "image", "datePublished"],
  },

  product: {
    type: "Product",
    required: ["name"],
  },

  breadcrumb: {
    type: "BreadcrumbList",
    required: ["itemListElement"],
  },

  event: {
    type: "Event",
    required: ["name", "startDate", "location"],
  },

  recipe: {
    type: "Recipe",
    required: ["name", "image", "recipeIngredient", "recipeInstructions"],
  },

  "job-posting": {
    type: "JobPosting",
    required: ["title", "description", "datePosted", "hiringOrganization"],
  },

  "local-business": {
    type: "LocalBusiness",
    required: ["name", "address"],
  },

  "software-application": {
    type: "SoftwareApplication",
    required: ["name", "offers", "applicationCategory"],
  },
};

const profileMatches = (
  node: SeoNode,
  profile: SeoRichResultProfile,
): boolean => {
  const types = getTypes(node);

  const expected = richResultRules[profile].type;

  return types.some((type) => (type.split("/").pop() ?? type) === expected);
};

const validateRichResults = (
  nodes: readonly SeoNode[],
  profiles: readonly SeoRichResultProfile[],
): SeoValidationIssue[] => {
  const issues: SeoValidationIssue[] = [];

  for (const profile of profiles) {
    const rule = richResultRules[profile];

    const matchingNodes = nodes.filter((node) => profileMatches(node, profile));

    if (matchingNodes.length === 0) {
      continue;
    }

    matchingNodes.forEach((node, index) => {
      const nodeId = typeof node["@id"] === "string" ? node["@id"] : undefined;

      for (const property of rule.required) {
        if (hasValue(node[property])) {
          continue;
        }

        issues.push(
          createIssue(
            "rich-results",
            `rich-results-missing-${property}`,
            `${rule.type} is missing the recommended Rich Results property "${property}".`,
            "warning",
            {
              nodeId,
              property,
              path: `@graph[${index}].${property}`,
              suggestion: `Add the ${property} property to improve eligibility for ${profile} rich results.`,
              docsUrl: GOOGLE_DOCS,
            },
          ),
        );
      }

      if (profile === "product") {
        const hasOffer =
          hasValue(node.offers) ||
          hasValue(node.aggregateRating) ||
          hasValue(node.review);

        if (!hasOffer) {
          issues.push(
            createIssue(
              "rich-results",
              "product-missing-rich-result-data",
              "Product should provide offers, aggregateRating or review data.",
              "warning",
              {
                nodeId,
                path: `@graph[${index}]`,
                suggestion:
                  "Add valid offer information, aggregate ratings or reviews.",
                docsUrl: GOOGLE_DOCS,
              },
            ),
          );
        }
      }
    });
  }

  return issues;
};

// ---------------------------------------------------------------------------
// Metadata validation
// ---------------------------------------------------------------------------

const isSafeHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value);

    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
};

const validateMetadata = (
  metadata: SeoPageMetadata | ResolvedSeoMetadata,
): SeoValidationIssue[] => {
  const issues: SeoValidationIssue[] = [];

  const add = (
    code: string,
    message: string,
    property: string,
    suggestion: string,
    severity: SeoValidationIssue["severity"] = "warning",
  ) => {
    issues.push(
      createIssue("metadata", code, message, severity, {
        path: property,
        property,
        suggestion,
      }),
    );
  };

  // Title

  if (!hasValue(metadata.title)) {
    add(
      "missing-title",
      "SEO title is missing.",
      "title",
      "Provide a descriptive page title.",
    );
  } else {
    const title = String(metadata.title);

    if (title.length > 60) {
      add(
        "title-too-long",
        "SEO title exceeds the recommended 60 characters.",
        "title",
        "Consider shortening the title.",
        "info",
      );
    }

    if (title.length < 15) {
      add(
        "title-too-short",
        "SEO title is unusually short.",
        "title",
        "Consider providing a more descriptive title.",
        "info",
      );
    }
  }

  // Description

  if (!hasValue(metadata.description)) {
    add(
      "missing-description",
      "SEO meta description is missing.",
      "description",
      "Provide a concise description of the page.",
    );
  } else {
    const description = String(metadata.description);

    if (description.length > 160) {
      add(
        "description-too-long",
        "SEO description exceeds the recommended 160 characters.",
        "description",
        "Consider shortening the description.",
        "info",
      );
    }

    if (description.length < 50) {
      add(
        "description-too-short",
        "SEO description is unusually short.",
        "description",
        "Consider providing more descriptive content.",
        "info",
      );
    }
  }

  // Canonical

  if (hasValue(metadata.canonical)) {
    if (!isSafeHttpUrl(String(metadata.canonical))) {
      add(
        "invalid-canonical",
        "Canonical URL must be an absolute HTTP(S) URL without credentials.",
        "canonical",
        "Provide a valid canonical URL.",
        "error",
      );
    }
  }

  // Locale

  if (hasValue(metadata.locale)) {
    try {
      Intl.getCanonicalLocales(String(metadata.locale));
    } catch {
      add(
        "invalid-metadata-locale",
        "Metadata locale is invalid.",
        "locale",
        "Use a valid BCP 47 locale such as en, nl or nl-NL.",
        "error",
      );
    }
  }

  // Open Graph

  const openGraph = metadata.openGraph;

  if (openGraph) {
    if (hasValue(openGraph.url) && !isSafeHttpUrl(String(openGraph.url))) {
      add(
        "invalid-og-url",
        "Open Graph URL must be an absolute HTTP(S) URL.",
        "openGraph.url",
        "Provide a valid Open Graph URL.",
        "error",
      );
    }

    if (!hasValue(openGraph.title)) {
      add(
        "missing-og-title",
        "Open Graph title is missing.",
        "openGraph.title",
        "Provide an Open Graph title.",
      );
    }

    if (!hasValue(openGraph.description)) {
      add(
        "missing-og-description",
        "Open Graph description is missing.",
        "openGraph.description",
        "Provide an Open Graph description.",
      );
    }

    for (const [index, image] of (openGraph.images ?? []).entries()) {
      if (!isSafeHttpUrl(String(image.url))) {
        add(
          "invalid-og-image-url",
          "Open Graph image URL must be an absolute HTTP(S) URL.",
          `openGraph.images[${index}].url`,
          "Provide an absolute image URL.",
          "error",
        );
      }

      if (!hasValue(image.alt)) {
        add(
          "missing-og-image-alt",
          "Open Graph image should have alternative text.",
          `openGraph.images[${index}].alt`,
          "Provide descriptive image alternative text.",
          "info",
        );
      }

      if (
        image.width !== undefined &&
        (!Number.isInteger(image.width) || image.width <= 0)
      ) {
        add(
          "invalid-og-image-width",
          "Open Graph image width must be a positive integer.",
          `openGraph.images[${index}].width`,
          "Provide a positive integer width.",
          "error",
        );
      }

      if (
        image.height !== undefined &&
        (!Number.isInteger(image.height) || image.height <= 0)
      ) {
        add(
          "invalid-og-image-height",
          "Open Graph image height must be a positive integer.",
          `openGraph.images[${index}].height`,
          "Provide a positive integer height.",
          "error",
        );
      }
    }
  }

  // Twitter

  if (
    metadata.twitter?.images &&
    metadata.twitter.images.some((image) => !isSafeHttpUrl(image))
  ) {
    add(
      "invalid-twitter-image-url",
      "Twitter image URLs must be absolute HTTP(S) URLs.",
      "twitter.images",
      "Provide valid absolute image URLs.",
      "error",
    );
  }

  // Hreflang

  const alternates = metadata.alternates?.alternates ?? [];

  const seenLocales = new Set<string>();

  for (const [index, alternate] of alternates.entries()) {
    const locale = alternate.locale.toLowerCase();

    if (seenLocales.has(locale)) {
      add(
        "duplicate-hreflang",
        `Duplicate hreflang locale: ${alternate.locale}.`,
        `alternates.alternates[${index}].locale`,
        "Each hreflang locale should appear only once.",
        "error",
      );
    }

    seenLocales.add(locale);

    if (!isSafeHttpUrl(String(alternate.url))) {
      add(
        "invalid-hreflang-url",
        "Hreflang URL must be an absolute HTTP(S) URL.",
        `alternates.alternates[${index}].url`,
        "Provide a valid absolute URL.",
        "error",
      );
    }
  }

  // Article metadata

  for (const property of ["publishedTime", "modifiedTime"] as const) {
    const value = metadata[property];

    if (hasValue(value) && !validateDate(value)) {
      add(
        `invalid-${property}`,
        `${property} must be a valid date or datetime.`,
        property,
        "Use an ISO 8601 date or datetime.",
        "error",
      );
    }
  }

  // Robots

  const robots = metadata.robots;

  if (robots) {
    for (const property of ["maxSnippet", "maxVideoPreview"] as const) {
      const value = robots[property];

      if (value !== undefined && (!Number.isInteger(value) || value < -1)) {
        add(
          `invalid-robots-${property}`,
          `robots.${property} must be an integer greater than or equal to -1.`,
          `robots.${property}`,
          "Use -1 or a non-negative integer.",
          "error",
        );
      }
    }
  }

  return issues;
};

// ---------------------------------------------------------------------------
// Custom validators
// ---------------------------------------------------------------------------

const executeCustomValidators = (
  validators: readonly SeoCustomValidator[],
  context: SeoValidationContext,
): SeoValidationIssue[] => {
  const issues: SeoValidationIssue[] = [];

  for (const validator of validators) {
    try {
      const result = validator(context);

      if (!Array.isArray(result)) {
        continue;
      }

      issues.push(
        ...result.map((issue) => ({
          ...issue,
          source: "custom" as const,
        })),
      );
    } catch (error) {
      issues.push(
        createIssue(
          "custom",
          "custom-validator-failed",
          error instanceof Error
            ? error.message
            : "A custom SEO validator failed.",
          "error",
        ),
      );
    }
  }

  return issues;
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const validateSeo = (
  input: SeoValidationInput,
  options: SeoValidationOptions = {},
): SeoValidationReport => {
  const mode = normalizeMode(options.mode ?? "warn");

  if (mode === "off") {
    return createReport("off", []);
  }

  const registry = options.registry ?? defaultRegistry;

  const graph =
    input.graph ??
    (input.nodes
      ? {
          "@graph": [...input.nodes],
        }
      : undefined);

  const issues: SeoValidationIssue[] = [];

  // Registry diagnostics

  for (const conflict of registry.getConflicts()) {
    issues.push(
      createIssue("registry", conflict.code, conflict.message, "warning", {
        path: conflict.property,
        property: conflict.property,
        suggestion: "Resolve the conflicting Schema.org definitions.",
        docsUrl: SCHEMA_DOCS,
      }),
    );
  }

  // Graph and Schema.org validation

  if (graph) {
    issues.push(
      ...validateGraph(
        graph,
        {
          ...options,
          mode,
        },
        registry,
      ),
    );

    if (Array.isArray(graph["@graph"])) {
      graph["@graph"].forEach((node, index) => {
        if (isObject(node)) {
          issues.push(...validateSemanticNode(node, index));
        }
      });

      if (options.profiles?.length) {
        issues.push(...validateRichResults(getNodes(graph), options.profiles));
      }
    }
  }

  // Metadata validation

  if (input.metadata) {
    issues.push(...validateMetadata(input.metadata));
  }

  // Custom validators

  if (options.validators?.length) {
    const context: SeoValidationContext = {
      graph,
      metadata: input.metadata,
      registry,
      mode,
    };

    issues.push(...executeCustomValidators(options.validators, context));
  }

  return createReport(mode, issues);
};

export const validateSeoMetadata = (
  metadata: SeoPageMetadata | ResolvedSeoMetadata,
  options: Pick<SeoValidationOptions, "mode"> = {},
): SeoValidationReport => {
  return validateSeo(
    {
      metadata,
    },
    options,
  );
};

/**
 * A standalone node receives its @id when it is added to a graph, so assign the
 * same generated ID here instead of reporting it as missing. Invalid nodes are
 * left untouched so their issues are still reported.
 */
const withNodeId = (node: SeoNode, options: SeoValidationOptions): SeoNode => {
  if (typeof node["@id"] === "string") {
    return node;
  }

  try {
    return {
      ...node,
      "@id": createSeoNode(node, { baseUrl: options.baseUrl })["@id"],
    };
  } catch {
    return node;
  }
};

export const validateSeoNode = (
  node: SeoNode,
  options: SeoValidationOptions = {},
): SeoValidationReport => {
  return validateSeo(
    {
      nodes: [withNodeId(node, options)],
    },
    options,
  );
};
