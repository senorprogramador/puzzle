import type { SeoGraph, SeoNode } from "../core/types";

import { validateSeoGraph } from "../core";

import type { SeoGraphInspection } from "./types";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getTypes = (node: SeoNode): string[] => {
  const value = node["@type"];
  const types = Array.isArray(value) ? value : [value];

  return types
    .filter(
      (type): type is string => typeof type === "string" && type.length > 0,
    )
    .map((type) => type.split("/").pop() ?? type)
    .sort();
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

  if (
    typeof value["@id"] === "string" &&
    Object.keys(value).every((key) => key === "@id")
  ) {
    references.add(value["@id"]);
    return;
  }

  for (const nestedValue of Object.values(value)) {
    collectReferences(nestedValue, references);
  }
};

export const inspectSeoGraph = (
  graph: SeoGraph,
  options: {
    baseUrl?: string;
  } = {},
): SeoGraphInspection => {
  const nodes = Array.isArray(graph["@graph"]) ? graph["@graph"] : [];

  const typeCounts: Record<string, number> = {};
  const references = new Set<string>();

  const inspectedNodes = nodes.map((node) => {
    const types = getTypes(node);

    for (const type of types) {
      typeCounts[type] = (typeCounts[type] ?? 0) + 1;
    }

    collectReferences(node, references);

    return {
      id: typeof node["@id"] === "string" ? node["@id"] : undefined,
      types,
      properties: Object.keys(node)
        .filter((property) => !property.startsWith("__puzzle"))
        .sort(),
    };
  });

  const graphIds = new Set(
    nodes
      .map((node) => node["@id"])
      .filter((id): id is string => typeof id === "string"),
  );

  const unresolvedReferences = [...references]
    .filter((reference) => {
      if (graphIds.has(reference)) {
        return false;
      }

      // Only local references are considered unresolved.
      if (reference.startsWith("#")) {
        return true;
      }

      if (!options.baseUrl) {
        return false;
      }

      try {
        const target = new URL(reference);
        const base = new URL(options.baseUrl);

        return target.origin === base.origin;
      } catch {
        return false;
      }
    })
    .sort();

  const validation = validateSeoGraph(graph, {
    baseUrl: options.baseUrl,
    strictReferences: true,
    allowedExternalReferences: true,
  });

  return {
    nodeCount: nodes.length,
    typeCounts,
    nodes: inspectedNodes,
    references: [...references].sort(),
    unresolvedReferences,
    valid: validation.valid,
  };
};
