import { access, readFile, readdir } from "node:fs/promises";
import { basename, dirname, relative, resolve, sep } from "node:path";
import {
  API,
  SignatureKind,
  SymbolFlags,
} from "typescript/unstable/sync";

const repositoryRoot = resolve(process.argv[2] ?? "");
const requestedPackage = process.argv[3] || undefined;
const packageEntries = [
  { packageName: "@puzzle-ui/ui", directory: "packages/ui" },
  { packageName: "@puzzle-ui/pieces", directory: "packages/pieces" },
  { packageName: "@puzzle-ui/hooks", directory: "packages/hooks" },
  { packageName: "@puzzle-ui/icons", directory: "packages/icons" },
  { packageName: "@puzzle-ui/theme", directory: "packages/theme" },
];
const selectedPackages = requestedPackage
  ? packageEntries.filter((entry) => entry.packageName === requestedPackage)
  : packageEntries;
if (requestedPackage && selectedPackages.length === 0) {
  throw new Error(`Unsupported package "${requestedPackage}".`);
}

const listMdxFiles = async (directory) => {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error instanceof Error && error.code === "ENOENT") return [];
    throw error;
  }
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) return listMdxFiles(path);
      return entry.isFile() && entry.name.endsWith(".mdx") ? [path] : [];
    }),
  );
  return nested.flat();
};

const toRelativePath = (path) =>
  relative(repositoryRoot, path).split(sep).join("/");

const toKebabCase = (value) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();

const getKind = (name, sourcePath) => {
  if (/^use[A-Z]/.test(name)) return "hook";
  if (name.endsWith("Provider")) return "provider";
  if (sourcePath.includes(`${sep}components${sep}`) || /^[A-Z]/.test(name)) {
    return "component";
  }
  return "utility";
};

const hasRelatedTest = async (sourcePath) => {
  const directory = dirname(sourcePath);
  const filename = basename(sourcePath).replace(/\.[^.]+$/, "");
  for (const suffix of [".test.ts", ".test.tsx", ".unit.test.ts", ".unit.test.tsx"]) {
    try {
      await access(resolve(directory, `${filename}${suffix}`));
      return true;
    } catch (error) {
      if (!(error instanceof Error && error.code === "ENOENT")) throw error;
    }
  }
  return false;
};

const documentationFiles = await listMdxFiles(
  resolve(repositoryRoot, "apps/site/content/docs"),
);
const api = new API();
const projectConfigs = selectedPackages.map((entry) =>
  resolve(repositoryRoot, entry.directory, "tsconfig.json"),
);
const snapshot = api.updateSnapshot({ openProjects: projectConfigs });
const candidates = [];

try {
  for (const [index, entry] of selectedPackages.entries()) {
    const packageRoot = resolve(repositoryRoot, entry.directory);
    const manifest = JSON.parse(
      await readFile(resolve(packageRoot, "package.json"), "utf8"),
    );
    if (manifest.name !== entry.packageName) {
      throw new Error(
        `Expected ${entry.packageName} in ${entry.directory}/package.json.`,
      );
    }
    const projectConfig = projectConfigs[index];
    if (!projectConfig) throw new Error(`No project config for ${entry.packageName}.`);
    const project = snapshot.getProject(projectConfig);
    if (!project) {
      throw new Error(`TypeScript could not load project ${projectConfig}.`);
    }
    const entryPath = resolve(packageRoot, "src/index.ts");
    const sourceFile = project.program.getSourceFile(entryPath);
    if (!sourceFile) throw new Error(`TypeScript could not load ${entryPath}.`);
    const moduleSymbol = project.checker.getSymbolAtLocation(sourceFile);
    if (!moduleSymbol) throw new Error(`No exports found in ${entryPath}.`);
    for (const exported of project.checker.getExportsOfModule(moduleSymbol)) {
      const symbol =
        exported.flags & SymbolFlags.Alias
          ? project.checker.getAliasedSymbol(exported)
          : exported;
      const declarationHandle =
        symbol.valueDeclaration ?? symbol.declarations[0];
      const declaration = declarationHandle?.resolve(project);
      if (!declaration) continue;
      const source = declaration.getSourceFile();
      const sourcePath = resolve(source.fileName);
      if (!sourcePath.startsWith(`${packageRoot}${sep}`)) continue;
      if (/(\.test|\.spec|\.stories)\.[cm]?tsx?$/.test(sourcePath)) continue;
      const name = symbol.name;
      if (!name || name === "default" || name.startsWith("_")) continue;
      const symbolType = project.checker.getTypeOfSymbol(symbol);
      const signatures = project.checker.getSignaturesOfType(
        symbolType,
        SignatureKind.Call,
      );
      if (signatures.length === 0) continue;

      const parameterType = project.checker.getParameterType(signatures[0], 0);
      const props = parameterType
        ? project.checker.getPropertiesOfType(parameterType)
        : [];
      const packageSourceFiles = new Set([toRelativePath(sourcePath)]);
      const propNames = [];
      for (const prop of props) {
        const propDeclarations = prop.declarations
          .map((handle) => handle.resolve(project))
          .filter(Boolean);
        const packageDeclaration = propDeclarations.find((node) =>
          resolve(node.getSourceFile().fileName).startsWith(`${packageRoot}${sep}`),
        );
        if (packageDeclaration) {
          propNames.push(prop.name);
          packageSourceFiles.add(
            toRelativePath(resolve(packageDeclaration.getSourceFile().fileName)),
          );
        }
      }

      const sourceText = source.getText();
      const docsMatch = documentationFiles.some((path) =>
        basename(path, ".mdx").includes(toKebabCase(name)),
      );
      const kind = getKind(name, sourcePath);
      const factors = {
        apiComplexity: Math.min(propNames.length, 20),
        composition: Math.min(
          propNames.filter((prop) =>
            /^(variant|size|orientation|placement|asChild|render)/i.test(prop),
          ).length,
          4,
        ),
        interactivity: Math.min(
          propNames.filter((prop) =>
            /^(on[A-Z]|value$|checked$|open$|disabled$)/.test(prop),
          ).length,
          4,
        ),
        accessibility:
          /\baria-[a-z-]+|\brole=|onKeyDown|onKeyUp/.test(sourceText) ? 1 : 0,
        documentation: docsMatch ? 1 : 0,
      };
      const hasTests = await hasRelatedTest(sourcePath);
      const relevanceScore = Math.min(
        100,
        10 +
          factors.apiComplexity * 2 +
          factors.composition * 5 +
          factors.interactivity * 4 +
          factors.accessibility * 8 +
          factors.documentation * 15 +
          (hasTests ? 5 : 0),
      );
      candidates.push({
        name,
        packageName: entry.packageName,
        kind,
        description: symbol.getDocumentationComment(project.checker).trim(),
        sourceFiles: [...packageSourceFiles].sort(),
        propNames: [...new Set(propNames)].sort(),
        relevanceScore,
        factors,
      });
    }
  }
} finally {
  snapshot.dispose();
  api.close();
}

const uniqueCandidates = [
  ...new Map(
    candidates.map((candidate) => [
      `${candidate.packageName}:${candidate.name}`,
      candidate,
    ]),
  ).values(),
].sort(
  (left, right) =>
    right.relevanceScore - left.relevanceScore ||
    left.packageName.localeCompare(right.packageName) ||
    left.name.localeCompare(right.name),
);

console.log(JSON.stringify(uniqueCandidates));
