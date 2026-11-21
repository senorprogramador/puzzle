import assert from "node:assert/strict";
import { access, cp, mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Glob } from "bun";
import { items } from "../src/components/layout/sidebar/index";

const site = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const root = resolve(site, "../..");
const docs = join(site, "content/docs");
const work = await mkdtemp(join(site, ".tutorial-check-"));
const routes = new Map<string, string>();
const navigation = new Set<string>();
const frameworkGuides = new Set(["/docs/tutorials/auth-tanstack-start", "/docs/tutorials/auth-nextjs"]);
let frameworkExamples = 0;

const visit = (nodes: typeof items) => {
  for (const item of nodes) {
    if (item.href) navigation.add(item.href);
    if (item.children) visit(item.children);
  }
};
visit(items);

const run = async (command: string[], environment?: Record<string, string>) => {
  const child = Bun.spawn(command, {
    cwd: work,
    env: { ...process.env, ...environment },
    stdin: "ignore",
    stdout: "inherit",
    stderr: "inherit",
  });
  assert.equal(await child.exited, 0, `Command failed: ${command[0]} ${command[1]}`);
};

try {
  for await (const name of new Glob("**/*.mdx").scan(docs)) {
    const route = `/docs/${name.replace(/\.mdx$/, "").replace(/(^|\/)index$/, "")}`;
    routes.set(route, await readFile(join(docs, name), "utf8"));
  }
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  let count = 0;
  for (const [route, content] of routes) {
    if (route !== "/docs/tutorials" && !route.startsWith("/docs/tutorials/")) continue;
    assert.ok(navigation.has(route), `${route} missing from navigation`);
    const title = content.match(/^title: (.+)$/m)?.[1];
    const description = content.match(/^description: (.+)$/m)?.[1];
    assert.ok(title && description, `${route} needs frontmatter`);
    assert.ok(!titles.has(title) && !descriptions.has(description), `${route} has duplicate metadata`);
    titles.add(title);
    descriptions.add(description);
    if (route !== "/docs/tutorials") {
      assert.deepEqual([...content.matchAll(/^## (.+)$/gm)].map((match) => match[1]), [
        "What you will build", "Prerequisites", "Installation", "Configuration",
        "Step-by-step implementation", "Complete working example", "Testing and verification",
        "Common mistakes and troubleshooting", "Next steps",
      ], `${route} must follow the common tutorial structure`);
    }
    for (const [otherRoute, otherContent] of routes) {
      if (otherRoute === route) continue;
      assert.notEqual(otherContent.match(/^title: (.+)$/m)?.[1], title, `${route} title is not unique`);
      assert.notEqual(otherContent.match(/^description: (.+)$/m)?.[1], description, `${route} description is not unique`);
    }
    for (const link of content.matchAll(/\]\((\/docs\/[^)\s]+)\)/g)) {
      const [path, anchor] = link[1]!.split("#");
      const target = routes.get(path!);
      assert.ok(target, `${route} links to missing ${path}`);
      if (anchor) {
        const headings = [...target.matchAll(/^#{1,6}\s+(.+)$/gm)].map((match) =>
          match[1]!.toLowerCase().replace(/[`*]/g, "")
            .replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s/g, "-"),
        );
        assert.ok(headings.includes(anchor), `${route} links to missing anchor ${link[1]}`);
      }
    }
    const fences = [...content.matchAll(/^```(tsx?)\b([^\n]*)\n([\s\S]*?)^```/gm)];
    if (frameworkGuides.has(route)) {
      // Framework apps need Next.js/TanStack Start and native dependencies that
      // this check does not install; they are verified as complete apps instead.
      const names = new Set<string>();
      for (const fence of content.matchAll(/^```json\s+title="([^"]+\.json)"\n([\s\S]*?)^```/gm)) {
        JSON.parse(fence[2]!);
        names.add(fence[1]!);
      }
      for (const fence of fences) {
        const name = fence[2]!.match(/title="([^"]+)"/)?.[1];
        assert.ok(name, `${route} has an unnamed TypeScript example`);
        assert.ok(!name.startsWith("/") && !name.split("/").includes(".."),
          `${route} example paths must be application-relative: ${name}`);
        assert.ok(!names.has(name), `${route} has a duplicate example path ${name}`);
        names.add(name);
      }
      frameworkExamples += fences.length;
      continue;
    }
    for (const fence of content.matchAll(/^```json\s+title="([^"]+\.json)"\n([\s\S]*?)^```/gm)) {
      const name = fence[1]!;
      const target = resolve(work, name);
      assert.ok(relative(work, target).startsWith(`${route.split("/").at(-1)}/`),
        `Configuration path must remain in its tutorial directory: ${name}`);
      assert.ok(!await Bun.file(target).exists(), `Duplicate configuration path ${name}`);
      JSON.parse(fence[2]!);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, fence[2]!);
    }
    for (const fence of fences) {
      const name = fence[2]!.match(/title="([^"]+)"/)?.[1];
      assert.ok(name, `${route} has an unnamed TypeScript example`);
      const target = resolve(work, name);
      assert.ok(relative(work, target).startsWith(`${route.split("/").at(-1)}/`),
        `Example path must remain in its tutorial directory: ${name}`);
      assert.ok(!await Bun.file(target).exists(), `Duplicate example path ${name}`);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, fence[3]!);
      count++;
    }
  }
  assert.equal(titles.size, 7, "All seven tutorial pages must be checked");

  const dependencies = new Map<string, string>([
    ["react", site], ["react-dom", site], ["@types", site],
  ]);
  const nodeModules = join(work, "node_modules");
  for (const name of ["seo", "auth", "session", "storage", "storage-d1", "media",
    "storage-mongodb", "fullstack", "theme", "ui", "core", "hooks", "icons"]) {
    const directory = join(root, "packages", name);
    const manifest: {
      name: string;
      dependencies?: Record<string, string>;
      exports: Record<string, {
        types?: string;
        import?: string | { default?: string; types?: string };
      } | string>;
    } = JSON.parse(await readFile(join(directory, "package.json"), "utf8"));
    for (const [subpath, entry] of Object.entries(manifest.exports)) {
      const target = typeof entry === "string" ? entry :
        typeof entry.import === "string" ? entry.import : entry.import?.default;
      if (!target || !target.endsWith(".js")) continue;
      const specifier = manifest.name + (subpath === "." ? "" : subpath.slice(1));
      const file = resolve(directory, target);
      assert.ok(await Bun.file(file).exists(), `Build packages before checking ${specifier}`);
      const declaration = typeof entry !== "string"
        ? (typeof entry.import === "object" ? entry.import.types : undefined) ?? entry.types
        : undefined;
      assert.ok(declaration, `No public declaration declared for ${specifier}`);
      const typeFile = resolve(directory, declaration);
      assert.ok(await Bun.file(typeFile).exists(), `Missing public declaration for ${specifier}`);
    }
    const installed = join(nodeModules, manifest.name);
    await mkdir(installed, { recursive: true });
    await cp(join(directory, "dist"), join(installed, "dist"), { recursive: true });
    await cp(join(directory, "package.json"), join(installed, "package.json"));
    for (const dependency of Object.keys(manifest.dependencies ?? {})) {
      if (!dependency.startsWith("@puzzle-ui/") && !dependencies.has(dependency)) {
        dependencies.set(dependency, directory);
      }
    }
  }
  for (const [dependency, from] of dependencies) {
    const installed = join(from, "node_modules", dependency);
    await access(installed);
    const target = join(nodeModules, dependency);
    await mkdir(dirname(target), { recursive: true });
    await symlink(installed, target, "dir");
  }
  const config = {
    compilerOptions: {
      target: "ES2022", module: "ESNext", moduleResolution: "bundler",
      lib: ["ESNext", "DOM", "DOM.Iterable"], jsx: "react-jsx",
      strict: true, noUncheckedIndexedAccess: true, skipLibCheck: true,
      noEmit: true, resolveJsonModule: true, types: ["bun", "node", "react", "react-dom"],
    },
    include: ["**/*.ts", "**/*.tsx"],
  };
  await writeFile(join(work, "tsconfig.json"), JSON.stringify(config, null, 2));
  await run([join(site, "node_modules/.bin/tsc"), "--project", join(work, "tsconfig.json")]);
  await run([process.execPath, "run", "theme/verify.tsx"]);
  await run([process.execPath, "run", "seo/verify.ts"]);
  await run([process.execPath, "build", "./auth/client.tsx", "--target", "browser",
    "--outdir", "./public"]);
  assert.ok(await Bun.file(join(work, "public/client.js")).exists());
  assert.ok(await Bun.file(join(work, "public/client.css")).exists());

  if (process.env.TUTORIAL_MONGODB_URI) {
    await run([process.execPath, "run", "storage/main.ts"], {
      MONGODB_URI: process.env.TUTORIAL_MONGODB_URI,
    });
    await run([process.execPath, "run", "auth/verify.ts"]);
  } else {
    console.log("Database examples not executed: set TUTORIAL_MONGODB_URI to an isolated replica set.");
  }
  if (process.env.TUTORIAL_SITE_URL) {
    const sitemapResponse = await fetch(new URL("/sitemap.xml", process.env.TUTORIAL_SITE_URL));
    const llmsResponse = await fetch(new URL("/llms.txt", process.env.TUTORIAL_SITE_URL));
    assert.equal(sitemapResponse.status, 200);
    assert.equal(llmsResponse.status, 200);
    const sitemap = await sitemapResponse.text();
    const llms = await llmsResponse.text();
    for (const [route, content] of routes) {
      if (route !== "/docs/tutorials" && !route.startsWith("/docs/tutorials/")) continue;
      const response: Response = await fetch(new URL(route, process.env.TUTORIAL_SITE_URL));
      assert.equal(response.status, 200, route);
      const html = await response.text();
      const title = content.match(/^title: (.+)$/m)![1]!;
      const description = content.match(/^description: (.+)$/m)![1]!;
      assert.ok(html.includes(`<title>Puzzle UI | ${title}</title>`), `${route} missing title`);
      assert.ok(html.includes(`name="description" content="${description}"`), `${route} missing description`);
      assert.equal((html.match(/<title>/g) ?? []).length, 1, route);
      assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1, route);
      assert.ok(html.includes(`href="https://puzzle-ui.com${route}"`), route);
      const scripts = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
      assert.equal(scripts.length, 1, `${route} needs one JSON-LD graph`);
      const graph: { "@graph": { "@id"?: string; "@type": string | string[] }[] } =
        JSON.parse(scripts[0]![1]!);
      for (const type of ["WebPage", "TechArticle", "BreadcrumbList"]) {
        assert.ok(graph["@graph"].some((node) => {
          const types = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
          return types.some((value) => value === type || value === `https://schema.org/${type}`);
        }), `${route} missing ${type}`);
      }
      assert.ok(sitemap.includes(`https://puzzle-ui.com${route}`), `${route} missing from sitemap`);
      assert.ok(llms.includes(`https://puzzle-ui.com${route}`), `${route} missing from llms.txt`);
    }
    console.log("Built tutorial HTTP routes, metadata, structured data, sitemap and llms.txt verified.");
  }
  console.log(`Verified ${count} TypeScript examples, seven tutorial routes, metadata, navigation, and reference links.`);
  console.log(`Checked ${frameworkExamples} framework guide examples for structure only; verify them in a TanStack Start or Next.js app.`);
} finally {
  await rm(work, { recursive: true, force: true });
}
