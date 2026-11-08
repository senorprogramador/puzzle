import { mkdtemp, readFile, rm } from "node:fs/promises";

import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { configureTheme } from "./configure-theme";

describe("configureTheme", () => {
  let cwd: string;

  beforeEach(async () => {
    cwd = await mkdtemp(path.join(os.tmpdir(), "puzzle-theme-"));
  });

  afterEach(async () => {
    await rm(cwd, {
      recursive: true,
      force: true,
    });
  });

  it("configures Next.js", async () => {
    await configureTheme(cwd, "next");

    const providers = await readFile(
      path.join(cwd, "src/app/providers.tsx"),
      "utf8",
    );

    const layout = await readFile(path.join(cwd, "src/app/layout.tsx"), "utf8");

    const page = await readFile(path.join(cwd, "src/app/page.tsx"), "utf8");

    expect(providers).toContain('"use client"');
    expect(providers).toContain("@puzzle-ui/theme");
    expect(providers).toContain('theme="system"');

    expect(layout).toContain("<Providers>");
    expect(page).toContain("@puzzle-ui/ui");
  });

  it("configures TanStack Start", async () => {
    await configureTheme(cwd, "tanstack");

    const root = await readFile(
      path.join(cwd, "src/routes/__root.tsx"),
      "utf8",
    );

    const page = await readFile(path.join(cwd, "src/routes/index.tsx"), "utf8");

    expect(root).toContain("@puzzle-ui/theme");
    expect(root).toContain('<Theme theme="system">');
    expect(root).toContain("<Outlet />");
    expect(page).toContain("@puzzle-ui/ui");
  });

  it("configures Basic React", async () => {
    await configureTheme(cwd, "react");

    const main = await readFile(path.join(cwd, "src/main.tsx"), "utf8");

    const app = await readFile(path.join(cwd, "src/App.tsx"), "utf8");

    expect(main).toContain("@puzzle-ui/theme");
    expect(main).toContain('<Theme theme="system">');
    expect(app).toContain("@puzzle-ui/ui");
  });
});
