import type {
  SeoGraph,
  SeoGraphBuilder,
  SeoGraphBuilderOptions,
  SeoGraphSerializationOptions,
  SeoGraphValidationOptions,
  SeoNode,
  SeoNodeOptions,
  SeoValidationIssue,
  SeoValidationResult,
} from "./types";

const DEFAULT_CONTEXT = "https://schema.org";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isNode = (value: unknown): value is SeoNode =>
  isObject(value) &&
  (typeof value["@type"] === "string" ||
    (Array.isArray(value["@type"]) &&
      value["@type"].every((item) => typeof item === "string")));

const normalizeType = (type: string): string => {
  const value = type.trim();

  if (!value) {
    throw new Error("SEO node type cannot be empty.");
  }

  if (/^[A-Za-z][A-Za-z0-9]*$/.test(value)) {
    return `https://schema.org/${value}`;
  }

  return value.replace(/^http:\/\/schema\.org\//, "https://schema.org/");
};

const compareStrings = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

const slugify = (value: string): string =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);

const canonicalize = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }

  if (!isObject(value)) {
    return value;
  }

  const result: Record<string, unknown> = {};

  const preferredOrder = ["@context", "@id", "@type"];

  const keys = Object.keys(value).sort((a, b) => {
    const ai = preferredOrder.indexOf(a);
    const bi = preferredOrder.indexOf(b);

    if (ai !== -1 || bi !== -1) {
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    }

    return compareStrings(a, b);
  });

  for (const key of keys) {
    result[key] = canonicalize(value[key]);
  }

  return result;
};

const stableStringify = (value: unknown): string =>
  JSON.stringify(canonicalize(value));

const hashString = (value: string): string => {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(36);
};

const normalizeBaseUrl = (baseUrl?: string): string | undefined => {
  if (!baseUrl) {
    return undefined;
  }

  const url = new URL(baseUrl);

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("SEO baseUrl must use HTTP or HTTPS.");
  }

  url.hash = "";

  return url.toString().replace(/\/$/, "");
};

/**
 * Converts an absolute, relative or fragment identifier
 * into a canonical identifier.
 *
 * Relative identifiers require a base URL.
 */
export const normalizeSeoId = (id: string, baseUrl?: string): string => {
  const value = id.trim();

  if (!value) {
    throw new Error("SEO node ID cannot be empty.");
  }

  if (/^[a-z][a-z\d+.-]*:/i.test(value)) {
    try {
      const url = new URL(value);

      if (url.protocol === "http:" && url.hostname === "schema.org") {
        url.protocol = "https:";
      }

      return url.toString();
    } catch {
      throw new Error(`Invalid SEO node ID: ${value}`);
    }
  }

  const base = normalizeBaseUrl(baseUrl);

  if (!base) {
    if (value.startsWith("#")) {
      return value;
    }

    throw new Error(`Relative SEO node ID "${value}" requires a baseUrl.`);
  }

  try {
    return new URL(value, `${base}/`).toString();
  } catch {
    throw new Error(`Invalid SEO node ID: ${value}`);
  }
};

const createAutomaticId = (node: SeoNode, options: SeoNodeOptions): string => {
  const baseUrl = normalizeBaseUrl(options.baseUrl);

  const types = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];

  const type = types[0] ?? "Thing";
  const typeSlug = slugify(type.split("/").pop() ?? "thing");

  const identityProperties = [
    "url",
    "mainEntityOfPage",
    "name",
    "headline",
    "title",
  ];

  let identity: string | undefined;

  for (const property of identityProperties) {
    const value = node[property];

    if (typeof value === "string" && value.trim()) {
      identity = value;
      break;
    }

    if (isObject(value) && typeof value["@id"] === "string") {
      identity = value["@id"];
      break;
    }
  }

  const identitySlug = identity
    ? slugify(identity)
    : hashString(stableStringify(node));

  const fragment = `${typeSlug}-${identitySlug || hashString(stableStringify(node))}`;

  return baseUrl ? `${baseUrl}/#${fragment}` : `#${fragment}`;
};

/**
 * Removes values that cannot be represented safely in JSON-LD.
 *
 * Internal Puzzle properties beginning with __puzzle are excluded.
 * User-defined Schema.org properties remain untouched.
 */
const cleanValue = (value: unknown): unknown => {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (
    typeof value === "undefined" ||
    typeof value === "function" ||
    typeof value === "symbol" ||
    typeof value === "bigint"
  ) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value.map(cleanValue).filter((item) => item !== undefined);
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (!isObject(value)) {
    return undefined;
  }

  const result: Record<string, unknown> = {};

  for (const [key, nestedValue] of Object.entries(value)) {
    if (key.startsWith("__puzzle")) {
      continue;
    }

    const cleaned = cleanValue(nestedValue);

    if (cleaned !== undefined) {
      result[key] = cleaned;
    }
  }

  return result;
};

const normalizeNodeId = (node: SeoNode, options: SeoNodeOptions): string => {
  // An explicit options.id takes precedence over the node's @id.
  const explicitId = options.id ?? node["@id"];

  if (typeof explicitId === "string") {
    return normalizeSeoId(explicitId, options.baseUrl);
  }

  return createAutomaticId(node, options);
};

/**
 * Creates a normalized, JSON-compatible SEO node.
 *
 * Explicit IDs always override generated IDs.
 * The original input is never mutated.
 */
export const createSeoNode = (
  input: SeoNode,
  options: SeoNodeOptions = {},
): SeoNode => {
  if (!isNode(input)) {
    throw new Error("SEO node must contain a valid @type.");
  }

  const cleaned = cleanValue(input);

  if (!isObject(cleaned)) {
    throw new Error("Unable to normalize SEO node.");
  }

  const type = Array.isArray(cleaned["@type"])
    ? cleaned["@type"].map((item) => normalizeType(String(item)))
    : normalizeType(String(cleaned["@type"]));

  const node: SeoNode = {
    ...cleaned,
    "@id": normalizeNodeId(input, options),
    "@type": type,
  };

  return node;
};

const cloneNode = (node: SeoNode): SeoNode => {
  const cloned = cleanValue(node);

  if (!isObject(cloned) || !isNode(cloned)) {
    throw new Error("Invalid SEO node.");
  }

  return cloned as SeoNode;
};

interface MergeContext {
  strategy: NonNullable<SeoGraphBuilderOptions["conflictStrategy"]>;
  issues: SeoValidationIssue[];
  nodeId: string;
}

const isEmptyValue = (value: unknown): boolean =>
  value === undefined ||
  value === null ||
  value === "" ||
  (Array.isArray(value) && value.length === 0);

const mergeArrays = (left: unknown[], right: unknown[]): unknown[] => {
  const values = new Map<string, unknown>();

  for (const value of [...left, ...right]) {
    values.set(stableStringify(value), value);
  }

  return [...values.entries()]
    .sort(([a], [b]) => compareStrings(a, b))
    .map(([, value]) => value);
};

const mergeValues = (
  left: unknown,
  right: unknown,
  context: MergeContext,
  path: string,
): unknown => {
  if (isEmptyValue(left)) return right;
  if (isEmptyValue(right)) return left;

  if (path === "@type") {
    const types = new Set([
      ...(Array.isArray(left) ? left : [left]),
      ...(Array.isArray(right) ? right : [right]),
    ]);

    const sorted = [...types].sort((a, b) =>
      compareStrings(String(a), String(b)),
    );

    return sorted.length === 1 ? sorted[0] : sorted;
  }

  if (stableStringify(left) === stableStringify(right)) {
    return left;
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    return mergeArrays(left, right);
  }

  if (isObject(left) && isObject(right)) {
    const result: Record<string, unknown> = {
      ...left,
    };

    for (const [key, value] of Object.entries(right)) {
      if (!(key in result)) {
        result[key] = value;
        continue;
      }

      result[key] = mergeValues(
        result[key],
        value,
        context,
        path ? `${path}.${key}` : key,
      );
    }

    return result;
  }

  const severity = context.strategy === "error" ? "error" : "warning";

  context.issues.push({
    code: "graph-property-conflict",
    severity,
    message: `Conflicting values found at ${path}.`,
    nodeId: context.nodeId,
    property: path,
  });

  switch (context.strategy) {
    case "first":
      return left;

    case "last":
      return right;

    case "error":
      // Keep the deterministic existing value while reporting an error.
      return compareStrings(stableStringify(left), stableStringify(right)) <= 0
        ? left
        : right;

    case "deterministic":
    default:
      return compareStrings(stableStringify(left), stableStringify(right)) <= 0
        ? left
        : right;
  }
};

/**
 * Merges two nodes with the same @id.
 *
 * Complementary values are combined.
 * Arrays are deduplicated.
 * Scalar conflicts are reported.
 */
export const mergeSeoNodes = (
  left: SeoNode,
  right: SeoNode,
  options: {
    conflictStrategy?: SeoGraphBuilderOptions["conflictStrategy"];
  } = {},
): {
  node: SeoNode;
  issues: SeoValidationIssue[];
} => {
  const normalizedLeft = createSeoNode(left);
  const normalizedRight = createSeoNode(right);

  const leftId = normalizedLeft["@id"];
  const rightId = normalizedRight["@id"];

  if (!leftId || leftId !== rightId) {
    throw new Error("Only SEO nodes with identical @id values can be merged.");
  }

  const issues: SeoValidationIssue[] = [];

  const context: MergeContext = {
    strategy: options.conflictStrategy ?? "deterministic",
    issues,
    nodeId: String(leftId),
  };

  const node = mergeValues(
    cloneNode(normalizedLeft),
    cloneNode(normalizedRight),
    context,
    "",
  ) as SeoNode;

  return {
    node,
    issues,
  };
};

const isReference = (value: unknown): value is { "@id": string } =>
  isObject(value) &&
  typeof value["@id"] === "string" &&
  Object.keys(value).every((key) => key === "@id");

const createReference = (id: string): { "@id": string } => ({
  "@id": id,
});

interface BuilderState {
  nodes: Map<string, SeoNode>;
  issues: SeoValidationIssue[];
  options: SeoGraphBuilderOptions;
}

/**
 * Resolves inline nodes recursively.
 *
 * Nested objects with @type become independent graph nodes.
 * Their original position is replaced by an @id reference.
 */
const resolveInlineValue = (value: unknown, state: BuilderState): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => resolveInlineValue(item, state));
  }

  if (!isObject(value)) {
    return value;
  }

  if (isNode(value)) {
    const nestedNode = createSeoNode(value as SeoNode, {
      baseUrl: state.options.baseUrl,
      context: state.options.context,
    });

    const resolved = resolveNode(nestedNode, state);

    addNodeToState(resolved, state);

    return createReference(String(resolved["@id"]));
  }

  if (isReference(value)) {
    return {
      "@id": normalizeSeoId(value["@id"], state.options.baseUrl),
    };
  }

  const result: Record<string, unknown> = {};

  for (const [key, nestedValue] of Object.entries(value)) {
    result[key] = resolveInlineValue(nestedValue, state);
  }

  return result;
};

const resolveNode = (node: SeoNode, state: BuilderState): SeoNode => {
  const result = cloneNode(node);

  for (const [key, value] of Object.entries(result)) {
    if (key === "@id" || key === "@type" || key === "@context") {
      continue;
    }

    result[key] = resolveInlineValue(value, state);
  }

  return result;
};

const addNodeToState = (node: SeoNode, state: BuilderState): void => {
  const id = String(node["@id"]);

  const existing = state.nodes.get(id);

  if (!existing) {
    state.nodes.set(id, node);
    return;
  }

  const merged = mergeSeoNodes(existing, node, {
    conflictStrategy: state.options.conflictStrategy,
  });

  state.nodes.set(id, merged.node);
  state.issues.push(...merged.issues);
};

const collectReferences = (value: unknown, references: Set<string>): void => {
  if (Array.isArray(value)) {
    for (const item of value) {
      collectReferences(item, references);
    }

    return;
  }

  if (!isObject(value)) {
    return;
  }

  if (isReference(value)) {
    references.add(value["@id"]);
    return;
  }

  for (const nestedValue of Object.values(value)) {
    collectReferences(nestedValue, references);
  }
};

const isLocalReference = (id: string, baseUrl?: string): boolean => {
  if (id.startsWith("#")) {
    return true;
  }

  if (!baseUrl) {
    return false;
  }

  try {
    const reference = new URL(id);
    const base = new URL(baseUrl);

    return reference.origin === base.origin;
  } catch {
    return false;
  }
};

const validateReferences = (
  graph: SeoGraph,
  options: SeoGraphValidationOptions = {},
): SeoValidationIssue[] => {
  const ids = new Set(graph["@graph"].map((node) => String(node["@id"])));

  const references = new Set<string>();

  for (const node of graph["@graph"]) {
    collectReferences(node, references);
  }

  const issues: SeoValidationIssue[] = [];

  for (const reference of references) {
    if (ids.has(reference)) {
      continue;
    }

    if (
      options.allowedExternalReferences !== false &&
      !isLocalReference(reference, options.baseUrl)
    ) {
      continue;
    }

    issues.push({
      code: "unresolved-reference",
      severity: options.strictReferences ? "error" : "warning",
      message: `Unable to resolve SEO reference: ${reference}`,
      nodeId: reference,
    });
  }

  return issues;
};

/**
 * Builds a complete JSON-LD graph from a collection of nodes.
 *
 * Each builder instance owns its own state. No global state is used.
 */
export const createSeoGraphBuilder = (
  options: SeoGraphBuilderOptions = {},
): SeoGraphBuilder => {
  const state: BuilderState = {
    nodes: new Map(),
    issues: [],
    options: {
      conflictStrategy: "deterministic",
      strictReferences: false,
      ...options,
    },
  };

  const builder: SeoGraphBuilder = {
    add(input) {
      const node = createSeoNode(input, {
        baseUrl: state.options.baseUrl,
        context: state.options.context,
      });

      const resolved = resolveNode(node, state);

      addNodeToState(resolved, state);

      return builder;
    },

    addMany(nodes) {
      for (const node of nodes) {
        builder.add(node);
      }

      return builder;
    },

    build() {
      const nodes = [...state.nodes.values()].sort((a, b) => {
        const left = String(a["@id"]);
        const right = String(b["@id"]);

        return left < right ? -1 : left > right ? 1 : 0;
      });

      const graph: SeoGraph = {
        "@context": state.options.context ?? DEFAULT_CONTEXT,
        "@graph": nodes,
      };

      return graph;
    },

    getIssues() {
      const graph: SeoGraph = {
        "@context": state.options.context ?? DEFAULT_CONTEXT,
        "@graph": [...state.nodes.values()],
      };

      return [
        ...state.issues,
        ...validateReferences(graph, {
          baseUrl: state.options.baseUrl,
          strictReferences: state.options.strictReferences,
          allowedExternalReferences: true,
        }),
      ];
    },
  };

  return builder;
};

/**
 * Convenience function for building a graph in one operation.
 */
export const buildSeoGraph = (
  nodes: readonly SeoNode[],
  options: SeoGraphBuilderOptions = {},
): SeoGraph => {
  return createSeoGraphBuilder(options).addMany(nodes).build();
};

/**
 * Normalizes and validates an existing graph.
 *
 * Inline nodes are extracted and references are normalized.
 */
export const resolveSeoReferences = (
  graph: SeoGraph,
  options: SeoGraphBuilderOptions = {},
): SeoGraph => {
  return createSeoGraphBuilder({
    ...options,
    context: options.context ?? graph["@context"] ?? DEFAULT_CONTEXT,
  })
    .addMany(graph["@graph"])
    .build();
};

/**
 * Validates graph structure, IDs and references.
 */
export const validateSeoGraph = (
  graph: SeoGraph,
  options: SeoGraphValidationOptions = {},
): SeoValidationResult => {
  const issues: SeoValidationIssue[] = [];

  if (!Array.isArray(graph["@graph"])) {
    return {
      valid: false,
      issues: [
        {
          code: "invalid-graph",
          severity: "error",
          message: "SEO graph must contain an @graph array.",
        },
      ],
    };
  }

  const ids = new Set<string>();

  for (let index = 0; index < graph["@graph"].length; index += 1) {
    const node = graph["@graph"][index];

    if (!isNode(node)) {
      issues.push({
        code: "invalid-node",
        severity: "error",
        message: `Invalid SEO node at index ${index}.`,
        path: `@graph[${index}]`,
      });

      continue;
    }

    const id = node["@id"];

    if (typeof id !== "string" || !id.trim()) {
      issues.push({
        code: "missing-node-id",
        severity: "error",
        message: `SEO node at index ${index} has no valid @id.`,
        path: `@graph[${index}].@id`,
      });

      continue;
    }

    if (ids.has(id)) {
      issues.push({
        code: "duplicate-node-id",
        severity: "error",
        message: `Duplicate SEO node ID: ${id}`,
        nodeId: id,
      });
    }

    ids.add(id);

    const types = Array.isArray(node["@type"])
      ? node["@type"]
      : [node["@type"]];

    if (
      types.length === 0 ||
      types.some((type) => typeof type !== "string" || !type.trim())
    ) {
      issues.push({
        code: "invalid-node-type",
        severity: "error",
        message: `SEO node ${id} has an invalid @type.`,
        nodeId: id,
      });
    }
  }

  issues.push(...validateReferences(graph, options));

  return {
    valid: !issues.some((issue) => issue.severity === "error"),
    issues,
  };
};

const escapeJsonForHtml = (value: string): string =>
  value
    .replace(/&/g, "\\u0026")
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");

/**
 * Serializes a graph into deterministic JSON-LD.
 *
 * scriptSafe protects the serialized content when embedded in
 * an HTML script element.
 */
export const serializeSeoGraph = (
  graph: SeoGraph,
  options: SeoGraphSerializationOptions = {},
): {
  value: string;
  errors: SeoValidationIssue[];
} => {
  const validation =
    options.validate === false
      ? { valid: true, issues: [] }
      : validateSeoGraph(graph);

  const cleaned = cleanValue(graph);

  if (!isObject(cleaned)) {
    throw new Error("Unable to serialize SEO graph.");
  }

  const serializable: Record<string, unknown> = {
    ...cleaned,
  };

  if (options.includeContext === false) {
    delete serializable["@context"];
  }

  const value =
    JSON.stringify(
      canonicalize(serializable),
      null,
      options.pretty ? 2 : undefined,
    ) ?? "null";

  const scriptSafe = options.scriptSafe ?? options.safe ?? true;

  return {
    value: scriptSafe ? escapeJsonForHtml(value) : value,
    errors: validation.issues,
  };
};

/**
 * Returns the serialized JSON-LD string directly.
 */
export const stringifySeoGraph = (
  graph: SeoGraph,
  options: SeoGraphSerializationOptions = {},
): string => serializeSeoGraph(graph, options).value;
