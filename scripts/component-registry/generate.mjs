import {
  access,
  mkdir,
  readFile,
  readdir,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const METADATA_PATH = "scripts/component-registry/metadata.json";
const SCHEMA_PATH = "docs/ai/registry/schema.json";
const OUTPUT_ROOT = "docs/ai/registry/generated";
const PACKAGE_ORDER = ["@puzzle-ui/pieces", "@puzzle-ui/ui"];

const toPosix = (value) => value.split(path.sep).join("/");
const repoPath = (absolutePath) => toPosix(path.relative(ROOT, absolutePath));
const absolutePath = (relativePath) => {
  const resolved = path.resolve(ROOT, relativePath);
  if (resolved !== ROOT && !resolved.startsWith(`${ROOT}${path.sep}`)) {
    throw new Error(`Path escapes the repository: ${relativePath}`);
  }
  return resolved;
};

const readJson = async (relativePath) =>
  JSON.parse(await readFile(absolutePath(relativePath), "utf8"));

const exists = async (relativePath) => {
  try {
    await access(absolutePath(relativePath));
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
};

const isFile = async (relativePath) => {
  try {
    return (await stat(absolutePath(relativePath))).isFile();
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
};

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
}

function splitExportSpecifiers(specifiers) {
  return specifiers
    .split(",")
    .map((specifier) => specifier.trim())
    .filter(Boolean)
    .filter((specifier) => !specifier.startsWith("type "))
    .map((specifier) => {
      const [sourceName, exportedName] = specifier
        .split(/\s+as\s+/)
        .map((part) => part.trim());
      return {
        sourceName,
        exportedName: exportedName ?? sourceName,
      };
    });
}

async function resolveModule(basePath) {
  const candidates = path.extname(basePath)
    ? [basePath]
    : [
        `${basePath}.ts`,
        `${basePath}.tsx`,
        `${basePath}.mts`,
        `${basePath}.cts`,
        path.join(basePath, "index.ts"),
        path.join(basePath, "index.tsx"),
        path.join(basePath, "index.mts"),
      ];

  for (const candidate of candidates) {
    if (await isFile(repoPath(candidate))) return candidate;
  }
  return null;
}

function getExportTarget(value) {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return null;
  for (const key of ["types", "import", "default", "require"]) {
    const target = getExportTarget(value[key]);
    if (target) return target;
  }
  return null;
}

async function resolveModuleSpecifier(specifier, fromFile, workspaces) {
  if (specifier.startsWith(".")) {
    return resolveModule(path.resolve(path.dirname(fromFile), specifier));
  }

  const workspace = [...workspaces].find(
    ([name]) => specifier === name || specifier.startsWith(`${name}/`),
  );
  if (!workspace) return null;

  const [packageName, workspaceData] = workspace;
  const subpath = specifier.slice(packageName.length);
  const exportKey = subpath ? `.${subpath}` : ".";
  const exportTarget = getExportTarget(
    workspaceData.manifest.exports?.[exportKey],
  );
  const candidates = [];
  if (exportTarget) {
    let sourcePath = exportTarget.replace(/^\.\//, "");
    sourcePath = sourcePath.replace(/^dist\//, "src/");
    sourcePath = sourcePath
      .replace(/\.d\.ts$/, ".ts")
      .replace(/\.(?:js|cjs|mjs)$/, ".ts");
    candidates.push(
      path.join(ROOT, workspaceData.directory, sourcePath),
    );
  }
  if (!subpath) {
    candidates.push(path.join(ROOT, workspaceData.directory, "src/index.ts"));
  }
  for (const candidate of candidates) {
    const resolved = await resolveModule(candidate);
    if (resolved) return resolved;
  }
  return null;
}

function pushExport(exports, record, file) {
  const existing = exports.find((item) => item.name === record.name);
  if (existing) {
    if (
      existing.originName !== record.originName ||
      existing.source !== record.source
    ) {
      throw new Error(
        `Conflicting export "${record.name}" in ${repoPath(file)}: ` +
          `${repoPath(existing.source)} and ${repoPath(record.source)}`,
      );
    }
    return;
  }
  exports.push(record);
}

async function collectModuleExports(file, workspaces, stack = new Set()) {
  if (stack.has(file)) return [];
  const nextStack = new Set(stack).add(file);
  const source = stripComments(await readFile(file, "utf8"));
  const exports = [];

  const localValues = new Map();
  const imports = new Map();
  const localValuePattern =
    /\b(export\s+)?(?:declare\s+)?(?:const|let|var|function|class|enum)\s+([A-Za-z_$][\w$]*)/g;
  for (const match of source.matchAll(localValuePattern)) {
    const name = match[2];
    localValues.set(name, {
      name,
      originName: name,
      source: file,
      aliasSource: null,
      exported: Boolean(match[1]),
    });
  }

  const importPattern =
    /\bimport\s+(?:type\s+)?\{([\s\S]*?)\}\s+from\s+(['"])([^'"]+)\2\s*;?/g;
  for (const match of source.matchAll(importPattern)) {
    for (const specifier of splitExportSpecifiers(match[1])) {
      imports.set(specifier.exportedName, {
        sourceName: specifier.sourceName,
        moduleSpecifier: match[3],
      });
    }
  }

  const starPattern = /\bexport\s+\*\s+from\s+(['"])([^'"]+)\1\s*;?/g;
  for (const match of source.matchAll(starPattern)) {
    const resolved = await resolveModuleSpecifier(match[2], file, workspaces);
    if (!resolved) {
      throw new Error(`Cannot resolve ${match[2]} from ${repoPath(file)}`);
    }
    const childExports = await collectModuleExports(
      resolved,
      workspaces,
      nextStack,
    );
    for (const child of childExports) pushExport(exports, child, file);
  }

  const namedPattern =
    /\bexport\s+(type\s+)?\{([\s\S]*?)\}\s*(?:from\s*(['"])([^'"]+)\3)?\s*;?/g;
  for (const match of source.matchAll(namedPattern)) {
    if (match[1]) continue;
    const moduleSpecifier = match[4];
    let childExports = [];
    if (moduleSpecifier) {
      const resolved = await resolveModuleSpecifier(
        moduleSpecifier,
        file,
        workspaces,
      );
      if (!resolved) {
        throw new Error(`Cannot resolve ${moduleSpecifier} from ${repoPath(file)}`);
      }
      childExports = await collectModuleExports(
        resolved,
        workspaces,
        nextStack,
      );
    }

    for (const { sourceName, exportedName } of splitExportSpecifiers(match[2])) {
      let target;
      if (moduleSpecifier) {
        target = childExports.find((item) => item.name === sourceName);
      } else {
        target = localValues.get(sourceName);
        const imported = imports.get(sourceName);
        if (!target && imported) {
          const resolved = await resolveModuleSpecifier(
            imported.moduleSpecifier,
            file,
            workspaces,
          );
          if (!resolved) {
            throw new Error(
              `Cannot resolve ${imported.moduleSpecifier} from ${repoPath(file)}`,
            );
          }
          const importedExports = await collectModuleExports(
            resolved,
            workspaces,
            nextStack,
          );
          target = importedExports.find(
            (item) => item.name === imported.sourceName,
          );
        }
      }
      if (!target) {
        throw new Error(
          `Cannot resolve value export "${sourceName}" from ${repoPath(file)}`,
        );
      }
      pushExport(
        exports,
        {
          name: exportedName,
          originName: target.originName,
          source: target.source,
          aliasSource:
            exportedName === target.originName
              ? target.aliasSource
              : file,
        },
        file,
      );
    }
  }

  for (const value of localValues.values()) {
    if (value.exported) pushExport(exports, value, file);
  }
  return exports;
}

function readBalancedObject(source, start) {
  let depth = 0;
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (lineComment) {
      if (char === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (char === "*" && next === "/") {
        blockComment = false;
        index += 1;
      }
      continue;
    }
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }
    if (char === "/" && next === "/") {
      lineComment = true;
      index += 1;
    } else if (char === "/" && next === "*") {
      blockComment = true;
      index += 1;
    } else if (char === '"' || char === "'" || char === "`") {
      quote = char;
    } else if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }
  throw new Error("Unterminated object in component catalog");
}

function readBalancedArray(source, start) {
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
    } else if (char === "[") {
      depth += 1;
    } else if (char === "]") {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }
  throw new Error("Unterminated component catalog array");
}

function objectStringProperty(objectSource, propertyName) {
  const propertyPattern = new RegExp(`\\b${propertyName}\\s*:\\s*`);
  const match = propertyPattern.exec(objectSource);
  if (!match) return null;
  let index = match.index + match[0].length;
  const quote = objectSource[index];
  if (quote !== '"' && quote !== "'" && quote !== "`") return null;
  index += 1;
  let value = "";
  let escaped = false;

  while (index < objectSource.length) {
    const char = objectSource[index];
    if (escaped) {
      value += char === "n" ? "\n" : char;
      escaped = false;
    } else if (char === "\\") {
      escaped = true;
    } else if (char === quote) {
      return value;
    } else {
      value += char;
    }
    index += 1;
  }
  return null;
}

async function readUiCatalog() {
  const source = await readFile(
    absolutePath("apps/site/src/components/component-catalog.ts"),
    "utf8",
  );
  const declaration = /\bcomponents\b[^=]*=\s*\[/m.exec(source);
  if (!declaration) throw new Error("Cannot locate the UI component catalog array");
  const arrayStart = source.indexOf("[", declaration.index);
  const arraySource = readBalancedArray(source, arrayStart);
  const entries = [];
  const starts = /\{\s*name\s*:/g;
  for (const match of arraySource.matchAll(starts)) {
    const objectSource = readBalancedObject(arraySource, match.index);
    const name = objectStringProperty(objectSource, "name");
    const href = objectStringProperty(objectSource, "href");
    const description = objectStringProperty(objectSource, "description");
    if (!name || !href || !description) {
      throw new Error(
        `Invalid component catalog item near offset ${match.index}`,
      );
    }
    const documentation = `${href.replace(/^\/docs\//, "apps/site/content/docs/")}.mdx`;
    entries.push({ name, href, description, documentation });
  }
  if (!entries.length) throw new Error("No entries found in the UI component catalog");
  return entries;
}

const normalizeName = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

function findUiCatalogEntry(name, source, catalog, parentFamily) {
  const parent = parentFamily
    ? catalog.find(
        (item) => normalizeName(item.name) === normalizeName(parentFamily),
      )
    : null;
  if (parent) return { item: parent, direct: false };
  const exact = catalog.find(
    (item) => normalizeName(item.name) === normalizeName(name),
  );
  if (exact) return { item: exact, direct: true };

  const marker = "/src/components/";
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) return null;
  const sourcePath = toPosix(source.slice(markerIndex + marker.length))
    .replace(/\.(?:tsx?|mts?)$/, "")
    .replace(/\/index$/, "");
  const candidates = catalog
    .map((item) => {
      const route = item.href.replace(/^\/docs\/ui\//, "");
      const matches =
        sourcePath === route ||
        sourcePath.startsWith(`${route}/`) ||
        sourcePath.startsWith(`${route}.`);
      return matches ? { item, route, length: route.length } : null;
    })
    .filter(Boolean)
    .sort((left, right) => right.length - left.length);
  if (!candidates.length) return null;
  return { item: candidates[0].item, direct: false };
}

function parseFrontmatterDescription(document) {
  const frontmatter = document.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatter) return null;
  const match = frontmatter[1].match(/^description:\s*(.*?)\s*$/m);
  if (!match) return null;
  let value = match[1].trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  return value.replace(/\\(["'\\])/g, "$1");
}

function parseMaturity(document) {
  const match = document.match(
    /(?:^|\n)\s*(?:\*\*)?(?:maturity|stability|status)(?:\*\*)?\s*[:|-]\s*(stable|beta|experimental)\b/i,
  );
  return match?.[1]?.toLowerCase();
}

function findBalancedTypeBody(source, openIndex) {
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
    } else if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(openIndex + 1, index);
    }
  }
  return null;
}

function parseTypeDeclarations(source) {
  const declarations = [];
  const pattern =
    /\b(?:export\s+)?(?:interface\s+([A-Za-z_$][\w$]*)\s*(?:extends[^{]+)?|type\s+([A-Za-z_$][\w$]*)\s*=\s*)\{/g;
  for (const match of source.matchAll(pattern)) {
    const openIndex = match.index + match[0].lastIndexOf("{");
    const body = findBalancedTypeBody(source, openIndex);
    if (body !== null) {
      declarations.push({
        name: match[1] ?? match[2],
        body,
        start: match.index,
      });
    }
  }
  return declarations;
}

function parseProperties(body) {
  const properties = [];
  let braceDepth = 0;
  let quote = null;
  let escaped = false;
  for (const line of body.split(/\r?\n/)) {
    if (braceDepth === 0) {
      const match = line.match(
        /^\s*(?:readonly\s+)?([A-Za-z_$][\w$]*)(\?)?\s*:\s*([^;]+?)\s*;?\s*$/,
      );
      if (match) {
        properties.push({
          name: match[1],
          optional: Boolean(match[2]),
          type: match[3].trim(),
        });
      }
    }
    for (const char of line) {
      if (quote) {
        if (escaped) escaped = false;
        else if (char === "\\") escaped = true;
        else if (char === quote) quote = null;
      } else if (char === '"' || char === "'" || char === "`") {
        quote = char;
      } else if (char === "{") {
        braceDepth += 1;
      } else if (char === "}") {
        braceDepth -= 1;
      }
    }
  }
  return properties;
}

function parseStringUnionTypes(source) {
  const results = [];
  const pattern =
    /\b(?:export\s+)?type\s+([A-Za-z_$][\w$]*(?:Variant|Layout|Preset|Size|Tone))\s*=\s*([^;]+);/g;
  for (const match of source.matchAll(pattern)) {
    if (!match[2].includes("|")) continue;
    const values = [...match[2].matchAll(/(['"])([^'"]+)\1/g)].map(
      (value) => value[2],
    );
    if (values.length > 1) {
      results.push({ name: match[1], values });
    }
  }
  return results;
}

async function inspectProps(sourcePath, componentName) {
  const directory = path.dirname(absolutePath(sourcePath));
  const sourceBase = path.basename(sourcePath).replace(/\.[^.]+$/, "");
  const candidates = new Set([
    sourcePath,
    repoPath(path.join(directory, `${sourceBase}.types.ts`)),
    repoPath(path.join(directory, "types.ts")),
    repoPath(path.join(directory, "index.types.ts")),
  ]);
  for (const name of await readdir(directory)) {
    if (name.endsWith(".types.ts")) {
      candidates.add(repoPath(path.join(directory, name)));
    }
  }

  const declarations = [];
  const unions = [];
  for (const candidate of candidates) {
    if (!(await isFile(candidate))) continue;
    const source = stripComments(await readFile(absolutePath(candidate), "utf8"));
    const currentDeclarations = parseTypeDeclarations(source);
    declarations.push(
      ...currentDeclarations.map((declaration) => ({
        ...declaration,
        source: candidate,
        sourceText: source,
      })),
    );
    unions.push(
      ...parseStringUnionTypes(source).map((union) => ({
        ...union,
        source: candidate,
        sourceText: source,
      })),
    );
  }

  const exactProps = declarations.find(
    (declaration) => declaration.name === `${componentName}Props`,
  );
  const fallbackProps =
    exactProps ??
    (declarations.filter((declaration) => /Props$/.test(declaration.name))
      .length === 1
      ? declarations.find((declaration) => /Props$/.test(declaration.name))
      : null);
  const properties = fallbackProps ? parseProperties(fallbackProps.body) : [];
  const requiredProps = properties
    .filter((property) => !property.optional)
    .map((property) => property.name);
  const contentRequirements = [];
  const dataRequirements = [];
  const mediaRequirements = [];
  const interactiveBehavior = [];

  for (const property of properties) {
    const label = `${property.name} (${property.optional ? "optional" : "required"})`;
    const normalizedType = property.type.replace(/\s+/g, " ");
    const isMedia =
      /(?:image|media|video|poster|avatar|logo)/i.test(property.name) ||
      /\b(?:Image|Media|Video|ImageSource|MediaSource)\w*\b/.test(
        normalizedType,
      );
    const isCollection =
      /(?:\[\]|Array\s*<|ReadonlyArray\s*<|Record\s*<|Map\s*<)/.test(
        normalizedType,
      );
    const isContent =
      /(?:title|description|label|subtitle|caption|heading|content|children|body|eyebrow)/i.test(
        property.name,
      ) &&
      /(?:string|number|ReactNode|ReactElement|JSX\.Element)/.test(
        normalizedType,
      );
    const isCallback =
      /^on[A-Z]/.test(property.name) &&
      (normalizedType.includes("=>") || normalizedType.includes("Function"));

    if (isMedia) mediaRequirements.push(label);
    else if (isCollection) dataRequirements.push(label);
    else if (isContent) contentRequirements.push(label);
    if (isCallback) interactiveBehavior.push(property.name);
  }

  const variants = [];
  for (const union of unions) {
    const matchingProperties = properties.filter((property) =>
      new RegExp(`\\b${union.name}\\b`).test(property.type),
    );
    for (const property of matchingProperties) {
      for (const name of union.values) {
        variants.push({
          name,
          kind: "prop",
          source: union.source,
          prop: property.name,
          typeName: union.name,
        });
      }
    }
  }

  return {
    ...(requiredProps.length ? { requiredProps } : {}),
    ...(contentRequirements.length ? { contentRequirements } : {}),
    ...(dataRequirements.length ? { dataRequirements } : {}),
    ...(mediaRequirements.length ? { mediaRequirements } : {}),
    ...(interactiveBehavior.length
      ? { interactiveBehavior: [...new Set(interactiveBehavior)].sort() }
      : {}),
    ...(variants.length ? { variants } : {}),
  };
}

function sortUnique(values) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function stableComponentOrder(left, right) {
  return (
    left.category.localeCompare(right.category) ||
    (left.subcategory ?? "").localeCompare(right.subcategory ?? "") ||
    left.name.localeCompare(right.name)
  );
}

async function buildPublicExports(
  packageName,
  packageMetadata,
  manifest,
  workspaces,
) {
  const manifestEntrypoints = Object.keys(manifest.exports ?? {}).sort();
  const configuredEntrypoints = Object.keys(packageMetadata.entryPoints).sort();
  if (JSON.stringify(manifestEntrypoints) !== JSON.stringify(configuredEntrypoints)) {
    throw new Error(
      `${packageName}: metadata entry points do not match package.json exports.\n` +
        `Manifest: ${manifestEntrypoints.join(", ")}\n` +
        `Metadata: ${configuredEntrypoints.join(", ")}`,
    );
  }

  const recordsByName = new Map();
  for (const entryPoint of configuredEntrypoints) {
    const source = path.join(
      ROOT,
      packageMetadata.directory,
      packageMetadata.entryPoints[entryPoint],
    );
    if (!(await isFile(repoPath(source)))) {
      throw new Error(
        `${packageName}: missing entry source ${repoPath(source)} for ${entryPoint}`,
      );
    }
    const exports = await collectModuleExports(source, workspaces);
    for (const record of exports) {
      const sourceWorkspace = [...workspaces].find(([, workspace]) =>
        record.source.startsWith(
          `${path.join(ROOT, workspace.directory)}${path.sep}`,
        ),
      );
      if (!sourceWorkspace) {
        throw new Error(
          `${packageName}: public export ${record.name} resolves outside a workspace`,
        );
      }
      if (
        sourceWorkspace[0] !== packageName &&
        !Object.hasOwn(
          {
            ...manifest.dependencies,
            ...manifest.peerDependencies,
          },
          sourceWorkspace[0],
        )
      ) {
        throw new Error(
          `${packageName}: public export ${record.name} re-exports undeclared workspace dependency ${sourceWorkspace[0]}`,
        );
      }
      const occurrences = recordsByName.get(record.name) ?? [];
      occurrences.push({
        ...record,
        entryPoint,
        sourcePackage: sourceWorkspace[0],
      });
      recordsByName.set(record.name, occurrences);
    }
  }

  const aliasMap = packageMetadata.aliases ?? {};
  const nonComponents = new Set(packageMetadata.nonComponentExports ?? []);
  for (const [alias, target] of Object.entries(aliasMap)) {
    const records = recordsByName.get(alias);
    if (!records?.length) {
      throw new Error(`${packageName}: alias ${alias} is not publicly exported`);
    }
    if (!records.some((record) => record.originName === target)) {
      throw new Error(
        `${packageName}: ${alias} no longer aliases the declared ${target}`,
      );
    }
  }
  for (const name of nonComponents) {
    if (!recordsByName.has(name)) {
      throw new Error(`${packageName}: excluded value export ${name} is missing`);
    }
  }

  const canonicalExports = new Map();
  for (const [name, records] of recordsByName) {
    if (aliasMap[name] || nonComponents.has(name)) continue;
    const rootRecord =
      records.find((record) => record.entryPoint === ".") ??
      [...records].sort((left, right) =>
        left.entryPoint.localeCompare(right.entryPoint),
      )[0];
    canonicalExports.set(name, {
      name,
      source: rootRecord.source,
      sourcePackage: rootRecord.sourcePackage,
      entryPoints: sortUnique(records.map((record) => record.entryPoint)),
    });
  }

  const classifiedNames = new Set([
    ...canonicalExports.keys(),
    ...Object.keys(aliasMap),
    ...nonComponents,
  ]);
  const actualNames = new Set(recordsByName.keys());
  if (
    classifiedNames.size !== actualNames.size ||
    [...actualNames].some((name) => !classifiedNames.has(name))
  ) {
    throw new Error(
      `${packageName}: public exports are not fully classified; inspect package entry points.`,
    );
  }

  for (const [alias, target] of Object.entries(aliasMap)) {
    if (!canonicalExports.has(target)) {
      throw new Error(
        `${packageName}: alias ${alias} targets non-canonical export ${target}`,
      );
    }
  }

  const aliasesByTarget = new Map();
  for (const [name, target] of Object.entries(aliasMap)) {
    const targetAliases = aliasesByTarget.get(target) ?? [];
    targetAliases.push({
      name,
      canonicalExport: target,
      entryPoints: sortUnique(
        recordsByName.get(name).map((record) => record.entryPoint),
      ),
      source: repoPath(
        recordsByName.get(name)[0].aliasSource ??
          recordsByName.get(name)[0].source,
      ),
    });
    aliasesByTarget.set(target, targetAliases);
  }

  return {
    components: canonicalExports,
    recordsByName,
    aliasesByTarget,
    exportCount: recordsByName.size,
    excludedCount: nonComponents.size,
  };
}

async function resolvePiecesDocumentation(name, source, metadata) {
  const override = metadata.documentationOverrides?.[name];
  if (override) return override;

  const base = "packages/pieces/src/components/";
  if (!source.startsWith(path.join(ROOT, base))) {
    throw new Error(`Pieces source is outside the component tree: ${repoPath(source)}`);
  }
  const relative = toPosix(path.relative(path.join(ROOT, base), source));
  const segments = relative.split("/");
  const family = segments[0];
  let slug;

  if (family === "hero") {
    slug = "hero";
  } else if (
    ["dashboard", "navigation", "project", "feedback", "settings", "activity", "onboarding"].includes(
      family,
    )
  ) {
    slug = family;
  } else if (segments.length > 2) {
    slug = segments[1];
  } else {
    slug = family;
  }

  const candidate = `apps/site/content/docs/pieces/components/${slug}.mdx`;
  if (!(await isFile(candidate))) {
    throw new Error(
      `No Pieces documentation mapping for ${name} (${repoPath(source)}); ` +
        `add a verified documentation override.`,
    );
  }
  return candidate;
}

async function makePiecesComponent(component, packageMetadata) {
  const source = repoPath(component.source);
  const documentation = await resolvePiecesDocumentation(
    component.name,
    component.source,
    packageMetadata,
  );
  const document = await readFile(absolutePath(documentation), "utf8");
  const description = parseFrontmatterDescription(document);
  if (!description) {
    throw new Error(`Pieces documentation has no description: ${documentation}`);
  }
  const sourceRelative = toPosix(
    path.relative(
      path.join(ROOT, "packages/pieces/src/components"),
      component.source,
    ),
  );
  const [category, nested] = sourceRelative.split("/");
  const categoryMetadata = packageMetadata.categoryMetadata[category];
  if (!categoryMetadata) {
    throw new Error(`Unknown Pieces category "${category}" for ${component.name}`);
  }
  const overrideKind = packageMetadata.compositionOverrides?.[component.name];
  const compositionKind = overrideKind ?? categoryMetadata.composition;
  const details = await inspectProps(source, component.name);
  const item = {
    name: component.name,
    package: "@puzzle-ui/pieces",
    entryPoints: component.entryPoints,
    category,
    subcategory: nested
      ? path.basename(path.dirname(component.source)).toLowerCase()
      : category,
    description,
    documentation,
    source,
    useCases: categoryMetadata.useCases,
    ...(categoryMetadata.pageTypes
      ? { pageTypes: categoryMetadata.pageTypes }
      : {}),
    ...(categoryMetadata.capabilities?.length
      ? { capabilities: categoryMetadata.capabilities }
      : {}),
    composition: {
      kind: compositionKind,
      family: nested ? path.basename(path.dirname(component.source)) : category,
    },
    ...(parseMaturity(document) ? { maturity: parseMaturity(document) } : {}),
    ...details,
  };
  return item;
}

function clampDescription(description) {
  if (description.length <= 280) return description;
  return `${description.slice(0, 277).trimEnd()}...`;
}

async function makeUiComponent(
  component,
  packageMetadata,
  catalog,
  packageName,
) {
  const source = repoPath(component.source);
  const parentFamily = packageMetadata.compoundFamilies?.[component.name];
  const catalogMatch = findUiCatalogEntry(
    component.name,
    component.source,
    catalog,
    parentFamily,
  );
  const businessDescription = packageMetadata.businessDescriptions?.[component.name];
  if (!catalogMatch && !businessDescription) {
    throw new Error(
      `No UI documentation metadata for ${component.name} (${source}); ` +
        `add a verified catalog or description entry.`,
    );
  }

  const catalogItem = catalogMatch?.item;
  const business = Boolean(businessDescription);
  const category =
    (catalogItem?.href.match(/^\/docs\/ui\/([^/]+)/)?.[1]) ??
    packageMetadata.categoryOverrides?.business;
  const categoryMetadata = packageMetadata.categoryMetadata[category];
  if (!categoryMetadata) {
    throw new Error(`Unknown UI category "${category}" for ${component.name}`);
  }

  const documentation =
    catalogItem?.documentation ?? "apps/site/content/docs/ui/index.mdx";
  const baseDescription = businessDescription ?? catalogItem.description;
  const direct = catalogMatch?.direct ?? false;
  const description =
    direct || business
      ? baseDescription
      : `A composable part of ${parentFamily ?? catalogItem.name}. ${baseDescription}`;
  const docsText = await readFile(absolutePath(documentation), "utf8");
  const details = await inspectProps(component.source, component.name);
  const dependencies =
    component.sourcePackage && component.sourcePackage !== packageName
      ? [{ package: component.sourcePackage, export: component.name }]
      : [];
  const sourceCategory = component.source
    .toString()
    .split(`${path.sep}components${path.sep}`)[1]
    ?.split(path.sep)[0];
  const subcategory =
    catalogItem?.href.split("/").at(-1) ??
    (sourceCategory === "business" ? "business" : category);
  const compoundRoots = new Set(Object.values(packageMetadata.compoundFamilies ?? {}));
  let compositionKind = "primitive";
  let family = catalogItem?.name ?? subcategory;
  if (parentFamily) {
    compositionKind = "compound-part";
    family = parentFamily;
  } else if (compoundRoots.has(component.name)) {
    compositionKind = "compound-root";
    family = component.name;
  } else if (category === "utilities") {
    compositionKind = "utility";
  }

  return {
    name: component.name,
    package: "@puzzle-ui/ui",
    entryPoints: component.entryPoints,
    category,
    subcategory,
    description: clampDescription(description),
    documentation,
    source,
    useCases: categoryMetadata.useCases,
    ...(categoryMetadata.pageTypes
      ? { pageTypes: categoryMetadata.pageTypes }
      : {}),
    ...(categoryMetadata.capabilities?.length
      ? { capabilities: categoryMetadata.capabilities }
      : {}),
    composition: {
      kind: compositionKind,
      family,
    },
    ...(dependencies.length ? { dependencies } : {}),
    ...(parseMaturity(docsText) ? { maturity: parseMaturity(docsText) } : {}),
    ...details,
  };
}

function validateSchemaValue(value, definition, schema, location) {
  if (definition.$ref) {
    const target = definition.$ref
      .slice(2)
      .split("/")
      .reduce(
        (current, key) => current[key.replace(/~1/g, "/").replace(/~0/g, "~")],
        schema,
      );
    if (!target) throw new Error(`${location}: unresolved schema reference ${definition.$ref}`);
    validateSchemaValue(value, target, schema, location);
    return;
  }

  if (definition.type === "object") {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
      throw new Error(`${location}: expected an object`);
    }
  } else if (definition.type === "array" && !Array.isArray(value)) {
    throw new Error(`${location}: expected an array`);
  } else if (definition.type === "string" && typeof value !== "string") {
    throw new Error(`${location}: expected a string`);
  }
  if (definition.const !== undefined && value !== definition.const) {
    throw new Error(`${location}: expected ${JSON.stringify(definition.const)}`);
  }
  if (definition.enum && !definition.enum.includes(value)) {
    throw new Error(`${location}: invalid value ${JSON.stringify(value)}`);
  }
  if (typeof value === "string") {
    if (definition.minLength !== undefined && value.length < definition.minLength) {
      throw new Error(`${location}: string is shorter than ${definition.minLength}`);
    }
    if (definition.maxLength !== undefined && value.length > definition.maxLength) {
      throw new Error(`${location}: string is longer than ${definition.maxLength}`);
    }
    if (definition.pattern && !new RegExp(definition.pattern).test(value)) {
      throw new Error(`${location}: string does not match ${definition.pattern}`);
    }
  }
  if (Array.isArray(value)) {
    if (definition.minItems !== undefined && value.length < definition.minItems) {
      throw new Error(`${location}: expected at least ${definition.minItems} items`);
    }
    if (definition.uniqueItems) {
      const serialized = value.map((item) => JSON.stringify(item));
      if (new Set(serialized).size !== serialized.length) {
        throw new Error(`${location}: duplicate array items`);
      }
    }
    if (definition.items) {
      value.forEach((item, index) =>
        validateSchemaValue(item, definition.items, schema, `${location}[${index}]`),
      );
    }
  }
  if (definition.type === "object" && value !== null) {
    for (const key of definition.required ?? []) {
      if (!Object.hasOwn(value, key)) {
        throw new Error(`${location}: missing required property ${key}`);
      }
    }
    for (const [key, propertySchema] of Object.entries(definition.properties ?? {})) {
      if (Object.hasOwn(value, key)) {
        validateSchemaValue(value[key], propertySchema, schema, `${location}.${key}`);
      }
    }
    if (definition.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!Object.hasOwn(definition.properties ?? {}, key)) {
          throw new Error(`${location}: unexpected property ${key}`);
        }
      }
    }
  }
}

function validateComponent(item, schema, packageNames) {
  validateSchemaValue(item, schema.$defs.component, schema, `${item.package}/${item.name}`);
  if (!packageNames.has(item.package)) {
    throw new Error(`Invalid package reference ${item.package}`);
  }
}

async function buildRegistries() {
  const metadata = await readJson(METADATA_PATH);
  const schema = await readJson(SCHEMA_PATH);
  const rootManifest = await readJson("package.json");
  if (metadata.schemaVersion !== schema.properties.schemaVersion.const) {
    throw new Error("Registry metadata and schema versions do not match");
  }

  const workspaceManifests = new Map();
  for (const workspacePattern of rootManifest.workspaces ?? []) {
    const [parent, childPattern] = workspacePattern.split("/");
    if (!parent || !childPattern?.includes("*")) continue;
    const entries = await readdir(absolutePath(parent), { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const manifestPath = `${parent}/${entry.name}/package.json`;
      if (!(await exists(manifestPath))) continue;
      const manifest = await readJson(manifestPath);
      workspaceManifests.set(manifest.name, {
        directory: `${parent}/${entry.name}`,
        manifest,
      });
    }
  }

  const uiCatalog = await readUiCatalog();
  const registries = [];
  const aggregate = [];
  const categoryFiles = [];
  const globalNames = new Set();
  const packageExportStats = {};

  for (const packageName of PACKAGE_ORDER) {
    const packageMetadata = metadata.packages[packageName];
    const workspace = workspaceManifests.get(packageName);
    if (!packageMetadata || !workspace) {
      throw new Error(`Registry package is not a workspace: ${packageName}`);
    }
    if (workspace.directory !== packageMetadata.directory) {
      throw new Error(
        `${packageName}: metadata directory ${packageMetadata.directory} ` +
          `does not match workspace ${workspace.directory}`,
      );
    }
    const exports = await buildPublicExports(
      packageName,
      packageMetadata,
      workspace.manifest,
      workspaceManifests,
    );
    const packageComponentNames = new Set(exports.components.keys());
    const items = [];
    for (const component of exports.components.values()) {
      const item =
        packageName === "@puzzle-ui/pieces"
          ? await makePiecesComponent(component, packageMetadata)
          : await makeUiComponent(
              component,
              packageMetadata,
              uiCatalog,
              packageName,
            );
      const aliases = exports.aliasesByTarget.get(component.name) ?? [];
      item.aliases = aliases
        .map((alias) => ({
          ...alias,
          documentation: item.documentation,
        }))
        .sort((left, right) => left.name.localeCompare(right.name));
      validateComponent(item, schema, new Set(workspaceManifests.keys()));
      for (const alias of item.aliases) {
        if (!(await isFile(alias.source))) {
          throw new Error(
            `${item.package}/${item.name}: missing alias source ${alias.source}`,
          );
        }
        if (
          alias.documentation &&
          !(await isFile(alias.documentation))
        ) {
          throw new Error(
            `${item.package}/${item.name}: missing alias documentation ${alias.documentation}`,
          );
        }
      }
      for (const dependency of item.dependencies ?? []) {
        const targetWorkspace = workspaceManifests.get(dependency.package);
        if (!targetWorkspace) {
          throw new Error(
            `${item.package}/${item.name}: unknown dependency package ${dependency.package}`,
          );
        }
        const declaredDependencies = {
          ...workspace.manifest.dependencies,
          ...workspace.manifest.peerDependencies,
        };
        if (!Object.hasOwn(declaredDependencies, dependency.package)) {
          throw new Error(
            `${item.package}/${item.name}: undeclared dependency ${dependency.package}`,
          );
        }
      }
      for (const variant of item.variants ?? []) {
        if (!(await isFile(variant.source))) {
          throw new Error(
            `${item.package}/${item.name}: missing variant source ${variant.source}`,
          );
        }
        const variantSource = await readFile(absolutePath(variant.source), "utf8");
        if (
          variant.kind === "prop" &&
          !new RegExp(`['"]${variant.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}['"]`).test(
            variantSource,
          )
        ) {
          throw new Error(
            `${item.package}/${item.name}: invalid variant "${variant.name}" in ${variant.source}`,
          );
        }
        if (
          variant.kind === "component" &&
          !packageComponentNames.has(variant.name)
        ) {
          throw new Error(
            `${item.package}/${item.name}: unknown component variant ${variant.name}`,
          );
        }
      }
      if (!(await isFile(item.source))) {
        throw new Error(`${item.package}/${item.name}: missing source ${item.source}`);
      }
      if (!(await isFile(item.documentation))) {
        throw new Error(
          `${item.package}/${item.name}: missing documentation ${item.documentation}`,
        );
      }
      const globalKey = `${item.package}:${item.name}`;
      if (globalNames.has(globalKey)) {
        throw new Error(`Duplicate component identity ${globalKey}`);
      }
      globalNames.add(globalKey);
      items.push(item);
    }

    items.sort(stableComponentOrder);
    const registry = {
      schemaVersion: 1,
      packages: [packageName],
      components: items,
    };
    registries.push(registry);
    aggregate.push(...items);
    packageExportStats[packageName] = {
      components: items.length,
      aliases: [...exports.aliasesByTarget.values()].reduce(
        (total, entries) => total + entries.length,
        0,
      ),
      excludedValueExports: exports.excludedCount,
      publicValueExports: exports.exportCount,
    };

    const categoryNames = sortUnique(items.map((item) => item.category));
    for (const category of categoryNames) {
      categoryFiles.push({
        path: `${OUTPUT_ROOT}/categories/${packageName.split("/").at(-1)}/${category}.json`,
        data: {
          schemaVersion: 1,
          packages: [packageName],
          components: items.filter((item) => item.category === category),
        },
      });
    }
  }

  aggregate.sort(
    (left, right) =>
      PACKAGE_ORDER.indexOf(left.package) - PACKAGE_ORDER.indexOf(right.package) ||
      stableComponentOrder(left, right),
  );
  const outputs = [
    ...registries.map((registry) => ({
      path: `${OUTPUT_ROOT}/${registry.packages[0].split("/").at(-1)}.json`,
      data: registry,
    })),
    {
      path: `${OUTPUT_ROOT}/all.json`,
      data: {
        schemaVersion: 1,
        packages: PACKAGE_ORDER,
        components: aggregate,
      },
    },
    ...categoryFiles,
  ];

  for (const output of outputs) {
    validateSchemaValue(output.data, schema, schema, output.path);
  }

  const ids = new Set();
  for (const item of aggregate) {
    const id = `${item.package}:${item.name}`;
    if (ids.has(id)) throw new Error(`Duplicate component identity ${id}`);
    ids.add(id);
  }
  return { outputs, stats: packageExportStats, componentCount: aggregate.length };
}

function serialize(data) {
  return `${JSON.stringify(data, null, 2)}\n`;
}

async function listJsonFiles(directory) {
  if (!(await exists(directory))) return [];
  const files = [];
  for (const entry of await readdir(absolutePath(directory), {
    withFileTypes: true,
  })) {
    const child = `${directory}/${entry.name}`;
    if (entry.isDirectory()) files.push(...(await listJsonFiles(child)));
    else if (entry.isFile() && entry.name.endsWith(".json")) files.push(child);
  }
  return files;
}

async function writeOutputs(outputs) {
  for (const output of outputs) {
    const target = absolutePath(output.path);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, serialize(output.data));
  }
}

async function checkOutputs(outputs) {
  const expectedPaths = new Set(outputs.map((output) => output.path));
  const existingPaths = await listJsonFiles(OUTPUT_ROOT);
  const stale = [];
  for (const output of outputs) {
    const target = output.path;
    if (!(await exists(target))) {
      stale.push(`${target} (missing)`);
      continue;
    }
    const current = await readFile(absolutePath(target), "utf8");
    if (current !== serialize(output.data)) stale.push(`${target} (out of date)`);
  }
  for (const existing of existingPaths) {
    if (!expectedPaths.has(existing)) stale.push(`${existing} (unexpected generated file)`);
  }
  if (stale.length) {
    throw new Error(
      `Component registry is stale:\n${stale.map((item) => `- ${item}`).join("\n")}\n` +
        "Run `bun run registry:generate` and review the generated changes.",
    );
  }
}

async function main() {
  const args = process.argv.slice(2);
  const checkOnly = args.length === 1 && args[0] === "--check";
  if (args.length > 0 && !checkOnly) {
    throw new Error("Usage: node scripts/component-registry/generate.mjs [--check]");
  }
  const { outputs, stats, componentCount } = await buildRegistries();
  if (checkOnly) await checkOutputs(outputs);
  else await writeOutputs(outputs);
  console.log(
    `${checkOnly ? "Validated" : "Generated"} component registry: ` +
      `${componentCount} unique components.`,
  );
  for (const [packageName, packageStats] of Object.entries(stats)) {
    console.log(
      `${packageName}: ${packageStats.components} components, ` +
        `${packageStats.aliases} aliases, ` +
        `${packageStats.excludedValueExports} non-component exports, ` +
        `${packageStats.publicValueExports} public value exports.`,
    );
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
