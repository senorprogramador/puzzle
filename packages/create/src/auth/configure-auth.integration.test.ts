import { mkdtemp, readFile, rm } from "node:fs/promises";

import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { configureAuth } from "./configure-auth";

describe("configureAuth", () => {
  let cwd: string;

  beforeEach(async () => {
    cwd = await mkdtemp(path.join(os.tmpdir(), "puzzle-auth-"));
  });

  afterEach(async () => {
    await rm(cwd, {
      recursive: true,
      force: true,
    });
  });

  it("configures Next.js authentication", async () => {
    await configureAuth(cwd, "next");

    const providers = await readFile(
      path.join(cwd, "src/app/providers.tsx"),
      "utf8",
    );

    const signIn = await readFile(
      path.join(cwd, "src/app/sign-in/page.tsx"),
      "utf8",
    );

    const signUp = await readFile(
      path.join(cwd, "src/app/sign-up/page.tsx"),
      "utf8",
    );

    const route = await readFile(
      path.join(cwd, "src/app/api/auth/[...auth]/route.ts"),
      "utf8",
    );

    const server = await readFile(
      path.join(cwd, "src/lib/auth/server.ts"),
      "utf8",
    );

    const bootstrap = await readFile(
      path.join(cwd, "src/lib/auth/bootstrap.ts"),
      "utf8",
    );

    expect(providers).toContain("@puzzle-ui/theme");
    expect(providers).toContain("@puzzle-ui/fullstack/auth/client");
    expect(providers).toContain("<AuthProvider");

    expect(signIn).toContain('mode="sign-in"');
    expect(signUp).toContain('mode="sign-up"');

    expect(route).toContain("createNextAuthHandler");
    expect(route).toContain("getAuthServer");
    expect(route).toContain("createAuthUnavailableResponse");
    expect(route).toContain("await initializePuzzleAuth()");

    expect(server).toContain("configureAuthServer");
    expect(server).toContain("getAuthServer");

    expect(bootstrap).toContain("initializePuzzleAuth");
    expect(bootstrap).toContain("TODO");
  });

  it("configures TanStack Start authentication", async () => {
    await configureAuth(cwd, "tanstack");

    const root = await readFile(
      path.join(cwd, "src/routes/__root.tsx"),
      "utf8",
    );

    const signIn = await readFile(
      path.join(cwd, "src/routes/sign-in.tsx"),
      "utf8",
    );

    const signUp = await readFile(
      path.join(cwd, "src/routes/sign-up.tsx"),
      "utf8",
    );

    const route = await readFile(
      path.join(cwd, "src/routes/api/auth/$.ts"),
      "utf8",
    );

    const bootstrap = await readFile(
      path.join(cwd, "src/lib/auth/bootstrap.ts"),
      "utf8",
    );

    expect(root).toContain("@puzzle-ui/theme");
    expect(root).toContain("@puzzle-ui/fullstack/auth/client");
    expect(root).toContain("<AuthProvider");

    expect(signIn).toContain('mode="sign-in"');
    expect(signUp).toContain('mode="sign-up"');

    expect(route).toContain("createTanStackAuthHandler");
    expect(route).toContain("getAuthServer");
    expect(route).toContain("server:");
    expect(route).toContain("handlers:");
    expect(route).toContain("await initializePuzzleAuth()");

    expect(bootstrap).toContain("initializePuzzleAuth");
    expect(bootstrap).toContain("TODO");
  });

  it("configures a basic React application", async () => {
    await configureAuth(cwd, "react");

    const main = await readFile(path.join(cwd, "src/main.tsx"), "utf8");

    const signIn = await readFile(
      path.join(cwd, "src/auth/sign-in.tsx"),
      "utf8",
    );

    const signUp = await readFile(
      path.join(cwd, "src/auth/sign-up.tsx"),
      "utf8",
    );

    expect(main).toContain("@puzzle-ui/fullstack/auth/client");
    expect(main).toContain("<AuthProvider");

    expect(signIn).toContain('mode="sign-in"');
    expect(signUp).toContain('mode="sign-up"');
  });

  it("does not generate a server module for a browser-only React app", async () => {
    await configureAuth(cwd, "react");

    await expect(
      readFile(path.join(cwd, "src/lib/auth/server.ts"), "utf8"),
    ).rejects.toMatchObject({
      code: "ENOENT",
    });
  });

  it("does not put server imports in client-facing templates", async () => {
    await configureAuth(cwd, "next");

    const providers = await readFile(
      path.join(cwd, "src/app/providers.tsx"),
      "utf8",
    );

    const signIn = await readFile(
      path.join(cwd, "src/app/sign-in/page.tsx"),
      "utf8",
    );

    expect(providers).not.toContain("@puzzle-ui/fullstack/auth/server");
    expect(signIn).not.toContain("@puzzle-ui/fullstack/auth/server");
  });
});
