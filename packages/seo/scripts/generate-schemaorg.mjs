import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SCRIPT_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const PACKAGE_DIRECTORY = resolve(SCRIPT_DIRECTORY, "..");

const SCHEMA_VERSION = "30.1";
const SOURCE_URL = `https://raw.githubusercontent.com/schemaorg/schemaorg/main/data/releases/${SCHEMA_VERSION}/schemaorg-current-https.jsonld`;

const SOURCE_DIRECTORY = resolve(SCRIPT_DIRECTORY, "schemaorg");
const SOURCE_FILE = resolve(SOURCE_DIRECTORY, "source.jsonld");

const GENERATED_DIRECTORY = resolve(PACKAGE_DIRECTORY, "src/schema/generated");
const GENERATED_FILE = resolve(GENERATED_DIRECTORY, "schemaorg.ts");
const MANIFEST_FILE = resolve(GENERATED_DIRECTORY, "manifest.json");

const SCHEMA_PREFIX = "https://schema.org/";
const CHECK_MODE = process.argv.includes("--check");

const PREFIXES = {
  schema: SCHEMA_PREFIX,
  rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  rdfs: "http://www.w3.org/2000/01/rdf-schema#",
  owl: "http://www.w3.org/2002/07/owl#",
  xsd: "http://www.w3.org/2001/XMLSchema#",
};

const RDF_CLASS = `${PREFIXES.rdfs}Class`;
const OWL_CLASS = `${PREFIXES.owl}Class`;
const RDF_PROPERTY = `${PREFIXES.rdf}Property`;
const SCHEMA_ENUMERATION = `${SCHEMA_PREFIX}Enumeration`;

const toArray = (value) => {
  if (value === undefined || value === null) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
};

const unique = (values) => [...new Set(values.filter(Boolean))];

const compareStrings = (a, b) => a.localeCompare(b, "en");

const sha256 = (value) => createHash("sha256").update(value).digest("hex");

const normalizeUri = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  return value.replace(/^http:\/\/schema\.org\//, SCHEMA_PREFIX);
};

const getLocalName = (uri) => {
  const normalized = normalizeUri(uri);

  if (typeof normalized !== "string") {
    return "";
  }

  const separator = Math.max(
    normalized.lastIndexOf("/"),
    normalized.lastIndexOf("#"),
  );

  return normalized.slice(separator + 1);
};

const createContextResolver = (document) => {
  const prefixes = new Map(Object.entries(PREFIXES));
  const terms = new Map();
  const contexts = [];

  let vocabulary = "";

  const collectContexts = (context) => {
    if (Array.isArray(context)) {
      for (const entry of context) {
        collectContexts(entry);
      }

      return;
    }

    if (context && typeof context === "object") {
      contexts.push(context);
    }
  };

  collectContexts(document["@context"]);

  const expandDefinition = (value) => {
    if (typeof value !== "string" || value.startsWith("@")) {
      return value;
    }

    const separator = value.indexOf(":");

    if (separator !== -1) {
      const prefix = value.slice(0, separator);
      const suffix = value.slice(separator + 1);

      if (prefixes.has(prefix)) {
        return `${prefixes.get(prefix)}${suffix}`;
      }

      return normalizeUri(value);
    }

    return vocabulary ? `${vocabulary}${value}` : value;
  };

  for (const context of contexts) {
    if (typeof context["@vocab"] === "string") {
      vocabulary = expandDefinition(context["@vocab"]);
    }

    for (const [key, definition] of Object.entries(context)) {
      if (key.startsWith("@")) {
        continue;
      }

      if (typeof definition === "string") {
        if (definition.endsWith("/") || definition.endsWith("#")) {
          prefixes.set(key, definition);
        } else {
          terms.set(key, definition);
        }

        continue;
      }

      if (!definition || typeof definition !== "object") {
        continue;
      }

      if (
        definition["@prefix"] === true &&
        typeof definition["@id"] === "string"
      ) {
        prefixes.set(key, expandDefinition(definition["@id"]));
        continue;
      }

      if (typeof definition["@id"] === "string") {
        terms.set(key, definition["@id"]);
      }
    }
  }

  const expand = (value) => {
    if (typeof value !== "string" || value.startsWith("@")) {
      return value;
    }

    if (terms.has(value)) {
      return normalizeUri(expandDefinition(terms.get(value)));
    }

    return normalizeUri(expandDefinition(value));
  };

  const expandKey = (key) => {
    if (key.startsWith("@")) {
      return key;
    }

    return expand(key);
  };

  return {
    expand,
    expandKey,
  };
};

const getValues = (node, resolver, property) => {
  const expectedKey = resolver.expandKey(property);

  for (const [key, value] of Object.entries(node)) {
    if (resolver.expandKey(key) === expectedKey) {
      return toArray(value);
    }
  }

  return [];
};

const getIds = (values, resolver) =>
  unique(
    values
      .map((value) => {
        if (typeof value === "string") {
          return normalizeUri(resolver.expand(value));
        }

        if (value && typeof value === "object") {
          if (typeof value["@id"] === "string") {
            return normalizeUri(resolver.expand(value["@id"]));
          }
        }

        return undefined;
      })
      .filter((value) => typeof value === "string"),
  );

const getText = (values) => {
  for (const value of values) {
    if (typeof value === "string") {
      return value;
    }

    if (value && typeof value === "object") {
      if (typeof value["@value"] === "string") {
        return value["@value"];
      }
    }
  }

  return undefined;
};

const getDescription = (node, resolver) =>
  getText([
    ...getValues(node, resolver, "rdfs:comment"),
    ...getValues(node, resolver, "schema:description"),
  ]);

const getNodeId = (node, resolver) => {
  if (typeof node["@id"] === "string") {
    return normalizeUri(resolver.expand(node["@id"]));
  }

  return getIds(getValues(node, resolver, "@id"), resolver)[0];
};

const getNodeTypes = (node, resolver) =>
  getIds(getValues(node, resolver, "@type"), resolver);

const getGraph = (document) => {
  if (Array.isArray(document["@graph"])) {
    return document["@graph"];
  }

  throw new Error("Schema.org source does not contain a valid @graph array.");
};

const createSchemaDefinitions = (document) => {
  const resolver = createContextResolver(document);
  const graph = getGraph(document);

  const classes = new Map();
  const properties = [];
  const nodesById = new Map();

  for (const node of graph) {
    if (!node || typeof node !== "object") {
      continue;
    }

    const id = getNodeId(node, resolver);

    if (!id) {
      continue;
    }

    const nodeTypes = getNodeTypes(node, resolver);

    nodesById.set(id, {
      node,
      nodeTypes,
    });

    if (nodeTypes.includes(RDF_CLASS) || nodeTypes.includes(OWL_CLASS)) {
      classes.set(id, node);
    }

    if (nodeTypes.includes(RDF_PROPERTY)) {
      properties.push({
        id,
        node,
      });
    }
  }

  const parentsByClass = new Map();

  for (const [id, node] of classes) {
    const parents = getIds(
      getValues(node, resolver, "rdfs:subClassOf"),
      resolver,
    );

    parentsByClass.set(id, parents);
  }

  const isEnumerationClass = (type, visited = new Set()) => {
    if (type === SCHEMA_ENUMERATION) {
      return true;
    }

    if (visited.has(type)) {
      return false;
    }

    visited.add(type);

    for (const parent of parentsByClass.get(type) ?? []) {
      if (isEnumerationClass(parent, visited)) {
        return true;
      }
    }

    return false;
  };

  const propertiesByDomain = new Map();

  for (const { id, node } of properties) {
    const domainTypes = getIds(
      getValues(node, resolver, "schema:domainIncludes"),
      resolver,
    ).sort(compareStrings);

    const rangeTypes = getIds(
      getValues(node, resolver, "schema:rangeIncludes"),
      resolver,
    ).sort(compareStrings);

    const inverseOf = getIds(
      getValues(node, resolver, "schema:inverseOf"),
      resolver,
    )[0];

    const supersededBy = getIds(
      getValues(node, resolver, "schema:supersededBy"),
      resolver,
    )[0];

    const description = getDescription(node, resolver);

    const property = {
      name: getLocalName(id),
      type:
        rangeTypes.length === 1
          ? rangeTypes[0]
          : rangeTypes.length > 1
            ? rangeTypes
            : `${SCHEMA_PREFIX}Thing`,
      ...(description ? { description } : {}),
      ...(rangeTypes.length > 0
        ? {
            expectedTypes: rangeTypes,
            rangeTypes,
          }
        : {}),
      ...(domainTypes.length > 0 ? { domainTypes } : {}),
      ...(inverseOf ? { inverseOf } : {}),
      ...(supersededBy ? { supersededBy } : {}),
    };

    for (const domainType of domainTypes) {
      const existing = propertiesByDomain.get(domainType) ?? [];

      existing.push(property);
      propertiesByDomain.set(domainType, existing);
    }
  }

  const definitions = [];

  for (const [id, node] of classes) {
    const name = getLocalName(id);

    if (!name) {
      continue;
    }

    const parentTypes = (parentsByClass.get(id) ?? [])
      .slice()
      .sort(compareStrings);

    const nodeProperties = (propertiesByDomain.get(id) ?? [])
      .slice()
      .sort((a, b) => compareStrings(a.name, b.name));

    const description = getDescription(node, resolver);

    const enumerationValues = [];

    if (isEnumerationClass(id)) {
      for (const [valueId, value] of nodesById) {
        if (valueId === id || classes.has(valueId)) {
          continue;
        }

        if (!value.nodeTypes.includes(id)) {
          continue;
        }

        const valueName = getLocalName(valueId);

        if (!valueName) {
          continue;
        }

        const valueDescription = getDescription(value.node, resolver);

        enumerationValues.push({
          name: valueName,
          type: valueId,
          ...(valueDescription ? { description: valueDescription } : {}),
        });
      }

      enumerationValues.sort((a, b) => compareStrings(a.name, b.name));
    }

    definitions.push({
      name,
      type: id,
      source: "generated",
      ...(description ? { description } : {}),
      ...(parentTypes.length > 0 ? { parentTypes } : {}),
      ...(nodeProperties.length > 0 ? { properties: nodeProperties } : {}),
      ...(enumerationValues.length > 0 ? { enumerationValues } : {}),
    });
  }

  definitions.sort((a, b) => compareStrings(a.name, b.name));

  const knownTypes = new Set(classes.keys());

  const unknownParentTypes = unique(
    definitions.flatMap((definition) =>
      (definition.parentTypes ?? []).filter(
        (parent) => parent.startsWith(SCHEMA_PREFIX) && !knownTypes.has(parent),
      ),
    ),
  ).sort(compareStrings);

  return {
    definitions,
    diagnostics: {
      unknownParentTypes,
    },
  };
};

const createGeneratedSource = (definitions, sourceHash) => {
  const serialized = JSON.stringify(definitions, null, 2);

  return [
    "/*",
    " * This file is generated. Do not edit manually.",
    ` * Schema.org version: ${SCHEMA_VERSION}`,
    ` * Source SHA-256: ${sourceHash}`,
    " */",
    "",
    'import type { SchemaDefinition } from "../types";',
    "",
    `export const SCHEMAORG_VERSION = "${SCHEMA_VERSION}";`,
    `export const SCHEMAORG_SOURCE_HASH = "${sourceHash}";`,
    "",
    "export const generatedSchemaDefinitions =",
    `${serialized} satisfies readonly SchemaDefinition[];`,
    "",
  ].join("\n");
};

const createManifest = (sourceHash, definitions, diagnostics) => {
  const generatedProperties = definitions.reduce(
    (total, definition) => total + (definition.properties?.length ?? 0),
    0,
  );

  const generatedEnumerationValues = definitions.reduce(
    (total, definition) => total + (definition.enumerationValues?.length ?? 0),
    0,
  );

  return `${JSON.stringify(
    {
      source: "Schema.org",
      version: SCHEMA_VERSION,
      sourceUrl: SOURCE_URL,
      sourceSha256: sourceHash,
      generatedTypes: definitions.length,
      generatedProperties,
      generatedEnumerationValues,
      diagnostics,
    },
    null,
    2,
  )}\n`;
};

const fetchSource = async () => {
  // Prefer the pinned local source. This keeps generation and checks
  // reproducible and allows CI checks to run without network access.
  try {
    return await readFile(SOURCE_FILE, "utf8");
  } catch {
    console.log(`Downloading Schema.org ${SCHEMA_VERSION}...`);

    const response = await fetch(SOURCE_URL);

    if (!response.ok) {
      throw new Error(
        `Failed to download Schema.org: ${response.status} ${response.statusText}`,
      );
    }

    const content = await response.text();

    try {
      JSON.parse(content);
    } catch {
      throw new Error("Downloaded Schema.org source is not valid JSON.");
    }

    if (!CHECK_MODE) {
      await mkdir(SOURCE_DIRECTORY, { recursive: true });
      await writeFile(SOURCE_FILE, content, "utf8");
    }

    return content;
  }
};

const compareFile = async (path, expected) => {
  try {
    const actual = await readFile(path, "utf8");

    if (actual === expected) {
      return true;
    }

    console.error(`Out of date: ${path}`);
    return false;
  } catch {
    console.error(`Missing generated file: ${path}`);
    return false;
  }
};

const writeGeneratedFile = async (path, content) => {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content, "utf8");
};

const main = async () => {
  console.log(
    `${CHECK_MODE ? "Checking" : "Generating"} Schema.org ${SCHEMA_VERSION}...`,
  );

  const content = await fetchSource();
  const document = JSON.parse(content);
  const sourceHash = sha256(content);

  const { definitions, diagnostics } = createSchemaDefinitions(document);

  if (definitions.length === 0) {
    throw new Error(
      "No Schema.org type definitions were found. Check the source format and JSON-LD context.",
    );
  }

  const generatedSource = createGeneratedSource(definitions, sourceHash);

  const manifest = createManifest(sourceHash, definitions, diagnostics);

  if (CHECK_MODE) {
    const sourceMatches = await compareFile(GENERATED_FILE, generatedSource);

    const manifestMatches = await compareFile(MANIFEST_FILE, manifest);

    if (!sourceMatches || !manifestMatches) {
      console.error(
        "Schema.org generated files are out of date. Run `bun run schema:generate`.",
      );

      process.exitCode = 1;
      return;
    }

    console.log(
      `Schema.org ${SCHEMA_VERSION} is up to date (${definitions.length} types).`,
    );

    if (diagnostics.unknownParentTypes.length > 0) {
      console.warn(
        `Unknown Schema.org parent types: ${diagnostics.unknownParentTypes.length}`,
      );
    }

    return;
  }

  await writeGeneratedFile(GENERATED_FILE, generatedSource);
  await writeGeneratedFile(MANIFEST_FILE, manifest);

  console.log(`Generated ${definitions.length} Schema.org types.`);
  console.log(
    `Generated ${manifest ? JSON.parse(manifest).generatedEnumerationValues : 0} enumeration values.`,
  );

  if (diagnostics.unknownParentTypes.length > 0) {
    console.warn(
      `Unknown Schema.org parent types: ${diagnostics.unknownParentTypes.length}`,
    );

    for (const type of diagnostics.unknownParentTypes) {
      console.warn(`  - ${type}`);
    }
  }

  console.log(`Source: ${SOURCE_FILE}`);
  console.log(`Definitions: ${GENERATED_FILE}`);
  console.log(`Manifest: ${MANIFEST_FILE}`);
};

export { createSchemaDefinitions };

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
