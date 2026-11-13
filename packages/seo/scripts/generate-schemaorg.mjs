import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

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

const DEFAULT_PREFIXES = {
  schema: "https://schema.org/",
  rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  rdfs: "http://www.w3.org/2000/01/rdf-schema#",
  owl: "http://www.w3.org/2002/07/owl#",
  xsd: "http://www.w3.org/2001/XMLSchema#",
};

const RDF_CLASS = `${DEFAULT_PREFIXES.rdfs}Class`;
const OWL_CLASS = `${DEFAULT_PREFIXES.owl}Class`;
const RDF_PROPERTY = `${DEFAULT_PREFIXES.rdf}Property`;

const CHECK_MODE = process.argv.includes("--check");

const normalizeUri = (value) =>
  typeof value === "string"
    ? value.replace(/^http:\/\/schema\.org\//, SCHEMA_PREFIX)
    : value;

const toArray = (value) => {
  if (value === undefined || value === null) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
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

const unique = (values) => [...new Set(values.filter(Boolean))];

const compareStrings = (a, b) => a.localeCompare(b, "en");

const sha256 = (value) => createHash("sha256").update(value).digest("hex");

const readJson = async (path) => {
  const content = await readFile(path, "utf8");

  return JSON.parse(content);
};

const fetchSource = async () => {
  if (!CHECK_MODE) {
    try {
      const cached = await readFile(SOURCE_FILE, "utf8");

      return {
        content: cached,
        downloaded: false,
      };
    } catch {
      // Download the pinned release when no cache exists.
    }
  }

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

  return {
    content,
    downloaded: true,
  };
};

const createContextResolver = (document) => {
  const prefixes = new Map(Object.entries(DEFAULT_PREFIXES));

  const terms = new Map();

  let vocabulary = "";

  const contexts = [];

  const collectContexts = (context) => {
    if (Array.isArray(context)) {
      for (const entry of context) {
        collectContexts(entry);
      }

      return;
    }

    if (!context || typeof context !== "object") {
      return;
    }

    contexts.push(context);
  };

  collectContexts(document["@context"]);

  const resolveDefinition = (value) => {
    if (typeof value !== "string") {
      return value;
    }

    if (value.startsWith("@")) {
      return value;
    }

    if (/^[a-z][a-z0-9+.-]*:/i.test(value)) {
      const separator = value.indexOf(":");
      const prefix = value.slice(0, separator);
      const suffix = value.slice(separator + 1);

      if (prefixes.has(prefix)) {
        return `${prefixes.get(prefix)}${suffix}`;
      }

      return value;
    }

    if (vocabulary) {
      return `${vocabulary}${value}`;
    }

    return value;
  };

  for (const context of contexts) {
    if (typeof context["@vocab"] === "string") {
      vocabulary = resolveDefinition(context["@vocab"]);
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

      if (definition["@prefix"] === true) {
        const id = definition["@id"];

        if (typeof id === "string") {
          prefixes.set(key, resolveDefinition(id));
        }

        continue;
      }

      if (typeof definition["@id"] === "string") {
        terms.set(key, definition["@id"]);
      }
    }
  }

  const expand = (value) => {
    if (typeof value !== "string") {
      return value;
    }

    if (value.startsWith("@")) {
      return value;
    }

    if (terms.has(value)) {
      return normalizeUri(resolveDefinition(terms.get(value)));
    }

    return normalizeUri(resolveDefinition(value));
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
  const expandedProperty = resolver.expandKey(property);

  for (const [key, value] of Object.entries(node)) {
    if (resolver.expandKey(key) === expandedProperty) {
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

const getLabel = (node, resolver) =>
  getText([
    ...getValues(node, resolver, "rdfs:label"),
    ...getValues(node, resolver, "schema:name"),
  ]);

const getNodeId = (node, resolver) => {
  const values = getValues(node, resolver, "@id");

  return getIds(values, resolver)[0];
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

  for (const node of graph) {
    if (!node || typeof node !== "object") {
      continue;
    }

    const id = getNodeId(node, resolver);

    if (!id) {
      continue;
    }

    const nodeTypes = getNodeTypes(node, resolver);

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

  const propertiesByDomain = new Map();

  for (const { id, node } of properties) {
    const domains = getIds(
      getValues(node, resolver, "schema:domainIncludes"),
      resolver,
    );

    const expectedTypes = getIds(
      getValues(node, resolver, "schema:rangeIncludes"),
      resolver,
    )
      .map(getLocalName)
      .sort(compareStrings);

    const property = {
      name: getLocalName(id),
      type:
        expectedTypes.length === 1
          ? expectedTypes[0]
          : expectedTypes.length > 1
            ? expectedTypes
            : "Thing",
      ...(getDescription(node, resolver)
        ? { description: getDescription(node, resolver) }
        : {}),
      ...(expectedTypes.length > 0 ? { expectedTypes } : {}),
    };

    for (const domain of domains) {
      const existing = propertiesByDomain.get(domain) ?? [];

      existing.push(property);
      propertiesByDomain.set(domain, existing);
    }
  }

  const definitions = [];

  for (const [id, node] of classes) {
    const name = getLocalName(id);

    if (!name) {
      continue;
    }

    const parentTypes = getIds(
      getValues(node, resolver, "rdfs:subClassOf"),
      resolver,
    )
      .map(getLocalName)
      .filter(Boolean)
      .sort(compareStrings);

    const nodeProperties = (propertiesByDomain.get(id) ?? [])
      .slice()
      .sort((a, b) => compareStrings(a.name, b.name));

    const description = getDescription(node, resolver);

    definitions.push({
      name,
      type: id,
      source: "generated",
      ...(description ? { description } : {}),
      ...(parentTypes.length > 0 ? { parentTypes } : {}),
      ...(nodeProperties.length > 0 ? { properties: nodeProperties } : {}),
    });
  }

  definitions.sort((a, b) => compareStrings(a.name, b.name));

  return definitions;
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
    "export const generatedSchemaDefinitions = ",
    `${serialized} satisfies readonly SchemaDefinition[];`,
    "",
  ].join("\n");
};

const createManifest = (sourceHash, definitions) => {
  const types = definitions.length;

  const properties = definitions.reduce(
    (total, definition) => total + (definition.properties?.length ?? 0),
    0,
  );

  return `${JSON.stringify(
    {
      source: "Schema.org",
      version: SCHEMA_VERSION,
      sourceUrl: SOURCE_URL,
      sourceSha256: sourceHash,
      generatedTypes: types,
      generatedProperties: properties,
    },
    null,
    2,
  )}\n`;
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

  const { content } = await fetchSource();
  const document = JSON.parse(content);

  const sourceHash = sha256(content);
  const definitions = createSchemaDefinitions(document);

  if (definitions.length === 0) {
    throw new Error(
      "No Schema.org type definitions were found. Check the source format and JSON-LD context.",
    );
  }

  const generatedSource = createGeneratedSource(definitions, sourceHash);

  const manifest = createManifest(sourceHash, definitions);

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

    return;
  }

  await writeGeneratedFile(GENERATED_FILE, generatedSource);

  await writeGeneratedFile(MANIFEST_FILE, manifest);

  console.log(`Generated ${definitions.length} Schema.org types.`);

  console.log(`Source: ${SOURCE_FILE}`);
  console.log(`Definitions: ${GENERATED_FILE}`);
  console.log(`Manifest: ${MANIFEST_FILE}`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
