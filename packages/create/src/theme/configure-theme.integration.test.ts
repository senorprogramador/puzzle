import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";

import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { configureTheme } from "./configure-theme";

describe("configureTheme", () => {
  let cwd: string;

  const read = (relativePath: string) =>
    readFile(path.join(cwd, relativePath), "utf8");

  const readJson = async (relativePath: string) =>
    JSON.parse(await read(relativePath)) as Record<string, unknown>;

  beforeEach(async () => {
    cwd = await mkdtemp(path.join(os.tmpdir(), "puzzle-theme-"));

    await writeFile(
      path.join(cwd, "package.json"),
      JSON.stringify({ name: "app", scripts: { dev: "dev" } }),
      "utf8",
    );
  });

  afterEach(async () => {
    await rm(cwd, {
      recursive: true,
      force: true,
    });
  });

  it("maps Next.js Link and Image in the theme", async () => {
    await configureTheme(cwd, { framework: "next" });

    const providers = await read("src/app/providers.tsx");
    const layout = await read("src/app/layout.tsx");
    const page = await read("src/app/page.tsx");

    expect(providers).toContain('"use client"');
    expect(providers).toContain('import Link from "next/link"');
    expect(providers).toContain('import Image from "next/image"');
    expect(providers).toContain("link: Link");
    expect(providers).toContain("image: Image");
    expect(providers).toContain("components={themeComponents}");
    expect(providers).not.toContain("<AuthProvider");
    expect(providers).toContain('import fonts from "../puzzle-fonts.json";');
    expect(providers).toContain("fonts={fonts}");
    expect(providers).toContain('fontSource="local"');
    expect(await readJson("src/puzzle-fonts.json")).toMatchObject({
      heading: { family: "Geist" },
      body: { family: "Geist" },
    });
    expect((await readJson("package.json")).scripts).toEqual({
      dev: "dev",
      "fonts:download":
        "puzzle-theme fonts download --config src/puzzle-fonts.json --subsets latin,latin-ext",
    });

    expect(layout).toContain("<Providers>");
    expect(page).toContain("@puzzle-ui/ui");
    expect(page).toContain("https://puzzle-ui.com/docs/ui");
    expect(page).not.toContain("/dashboard");
  });

  it("adds auth providers and links when auth is enabled", async () => {
    await configureTheme(cwd, {
      framework: "next",
      auth: true,
      database: "mongodb",
    });

    const providers = await read("src/app/providers.tsx");
    const page = await read("src/app/page.tsx");

    expect(providers).toContain("<AuthProvider");
    expect(page).toContain('"/sign-in"');
    expect(page).toContain('"/dashboard"');
    expect(page).toContain("https://puzzle-ui.com/docs/auth");
    expect(page).toContain("https://puzzle-ui.com/docs/storage");
  });

  it("maps the TanStack Router Link in the theme", async () => {
    await writeFile(
      path.join(cwd, "tsconfig.json"),
      `{
  "compilerOptions": {
    /* Bundler mode */
    "moduleResolution": "bundler"
  }
}
`,
      "utf8",
    );

    await configureTheme(cwd, { framework: "tanstack" });

    const root = await read("src/routes/__root.tsx");

    expect(root).toContain("@tanstack/react-router");
    expect(root).toContain('link: { component: Link, hrefProp: "to" as const }');
    expect(root).toContain("components={themeComponents}");
    expect(root).toContain("<Outlet />");
    expect(root).toContain("notFoundComponent:");
    expect(root).toContain("Page not found");
    expect(root).toContain('import fonts from "../puzzle-fonts.json";');
    expect(root).toContain('fontSource="local"');
    expect(await read("src/puzzle-fonts.json")).toContain('"Geist"');
    expect(await read("tsconfig.json")).toContain(`{
  "compilerOptions": {
    "resolveJsonModule": true,
    /* Bundler mode */`);
    expect(await read("src/routes/index.tsx")).toContain("@puzzle-ui/ui");
  });

  it("maps the React Router Link and replaces the welcome screen", async () => {
    await mkdir(path.join(cwd, "app/welcome"), { recursive: true });
    await writeFile(path.join(cwd, "app/welcome/welcome.tsx"), "", "utf8");

    await configureTheme(cwd, {
      framework: "react-router",
      auth: true,
      database: "d1",
    });

    const root = await read("app/root.tsx");
    const routes = await read("app/routes.ts");

    expect(root).toContain('from "react-router"');
    expect(root).toContain('link: { component: Link, hrefProp: "to" as const }');
    expect(root).toContain("<AuthProvider");
    expect(root).toContain('import fonts from "./puzzle-fonts.json";');
    expect(root).toContain('fontSource="local"');
    expect(await read("app/puzzle-fonts.json")).toContain('"Geist"');
    expect((await readJson("package.json")).scripts).toMatchObject({
      "fonts:download":
        "puzzle-theme fonts download --config app/puzzle-fonts.json --subsets latin,latin-ext",
    });
    expect(routes).toContain('route("dashboard", "routes/dashboard.tsx")');
    expect(routes).toContain('route("api/auth/*", "routes/api.auth.ts")');
    expect(await read("app/routes/home.tsx")).toContain("@puzzle-ui/ui");

    await expect(stat(path.join(cwd, "app/welcome"))).rejects.toMatchObject({
      code: "ENOENT",
    });
  });

  it("configures Basic React", async () => {
    await configureTheme(cwd, { framework: "react" });

    const main = await read("src/main.tsx");
    const app = await read("src/App.tsx");

    expect(main).toContain("@puzzle-ui/theme");
    expect(main).toContain('import fonts from "./puzzle-fonts.json";');
    expect(main).toContain(
      '<Theme theme="system" fonts={fonts} fontSource="local">',
    );
    expect(await read("src/puzzle-fonts.json")).toContain('"Geist"');
    expect(app).toContain("@puzzle-ui/ui");
    expect(app).toContain("https://puzzle-ui.com/docs/getting-started");
  });
});
