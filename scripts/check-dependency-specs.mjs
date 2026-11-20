import { readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const rootManifest = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
const manifestPaths = new Set(["package.json"]);

for (const workspace of rootManifest.workspaces ?? []) {
  if (workspace.endsWith("/*")) {
    const directory = workspace.slice(0, -2);
    for (const entry of await readdir(join(root, directory), { withFileTypes: true })) {
      if (entry.isDirectory()) manifestPaths.add(join(directory, entry.name, "package.json"));
    }
  } else {
    manifestPaths.add(join(workspace, "package.json"));
  }
}

const failures = [];
const dependencySections = [
  "dependencies",
  "devDependencies",
  "optionalDependencies",
  "peerDependencies",
];

for (const manifestPath of manifestPaths) {
  const absolutePath = join(root, manifestPath);
  const manifest = JSON.parse(await readFile(absolutePath, "utf8"));
  for (const section of dependencySections) {
    for (const [name, version] of Object.entries(manifest[section] ?? {})) {
      if (version === "latest") {
        failures.push(`${manifestPath}: ${section}.${name} uses "latest"`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error(`Floating dependency versions are not allowed:\n${failures.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(`Checked ${manifestPaths.size} workspace manifests; no "latest" dependency specs.`);
}
