import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";

import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { configureAuth, type ConfigureAuthOptions } from "./configure-auth";

describe("configureAuth", () => {
  let cwd: string;

  const read = (relativePath: string) =>
    readFile(path.join(cwd, relativePath), "utf8");

  const configure = (options: Partial<ConfigureAuthOptions>) =>
    configureAuth(cwd, {
      framework: "next",
      projectName: "my-app",
      packageManager: "bun",
      ...options,
    });

  beforeEach(async () => {
    cwd = await mkdtemp(path.join(os.tmpdir(), "puzzle-auth-"));

    await writeFile(
      path.join(cwd, "package.json"),
      JSON.stringify({
        name: "my-app",
        scripts: { dev: "dev", start: "react-router-serve" },
      }),
      "utf8",
    );
  });

  afterEach(async () => {
    await rm(cwd, {
      recursive: true,
      force: true,
    });
  });

  it("configures Next.js with MongoDB", async () => {
    await configure({ framework: "next", database: "mongodb" });

    const database = await read("src/lib/auth/database.ts");
    const password = await read("src/lib/auth/password.ts");
    const route = await read("src/app/api/auth/[...auth]/route.ts");
    const dashboard = await read("src/app/dashboard/page.tsx");
    const env = await read(".env");
    const compose = await read("docker-compose.yml");

    expect(database).toContain("MongoStorageAdapter");
    expect(password).toContain("@node-rs/argon2");
    expect(route).toContain("handleAuthRequest");
    expect(dashboard).toContain("getSignedInUser");
    expect(dashboard).toContain('redirect("/sign-in")');

    expect(await read("src/app/sign-in/page.tsx")).toContain(
      'mode="sign-in"',
    );
    expect(await read("src/app/sign-up/page.tsx")).toContain(
      'mode="sign-up"',
    );

    const appPassword = env.match(/^MONGODB_APP_PASSWORD="([0-9a-f]{64})"$/m)?.[1];
    const rootPassword = env.match(/^MONGODB_ROOT_PASSWORD="([0-9a-f]{64})"$/m)?.[1];

    expect(appPassword).toBeDefined();
    expect(rootPassword).toBeDefined();
    expect(rootPassword).not.toBe(appPassword);
    expect(env).toContain('MONGODB_DATABASE="my_app"');
    expect(env).toContain('MONGODB_APP_USERNAME="my_app_app"');
    expect(env).toContain(
      `MONGODB_URI="mongodb://my_app_app:${appPassword}@localhost:27017/my_app?authSource=my_app&directConnection=true"`,
    );
    expect(env).toMatch(/AUTH_ENCRYPTION_KEY_HEX="[0-9a-f]{64}"/);
    expect(env).toContain('APP_ORIGIN="http://localhost:3000"');
    expect(compose).toContain("--replSet");
    expect(compose).toContain("--keyFile");
    expect(compose).toContain('"127.0.0.1:27017:27017"');
    expect(compose).toContain(
      "MONGO_INITDB_ROOT_PASSWORD: ${MONGODB_ROOT_PASSWORD:?",
    );
    expect(compose).toContain(
      "MONGODB_APP_PASSWORD: ${MONGODB_APP_PASSWORD:?",
    );
    expect(await read("docker/mongodb/create-app-user.js")).toContain(
      'roles: [{ role: "readWrite", db: databaseName }]',
    );

    await expect(read("wrangler.jsonc")).rejects.toMatchObject({
      code: "ENOENT",
    });
  });

  it("configures Next.js with Cloudflare D1", async () => {
    await configure({ framework: "next", database: "d1" });

    const database = await read("src/lib/auth/database.ts");
    const wrangler = await read("wrangler.jsonc");
    const packageJson = JSON.parse(await read("package.json")) as {
      scripts: Record<string, string>;
    };

    expect(database).toContain("getCloudflareContext");
    expect(database).toContain("D1StorageAdapter");
    expect(await read("src/lib/auth/password.ts")).toContain(
      "new Pbkdf2PasswordHasher({ pepper })",
    );
    expect(await read(".env")).toMatch(
      /^AUTH_PASSWORD_PEPPER_HEX="[a-f0-9]{64}"$/m,
    );
    expect(wrangler).toContain('"binding": "DB"');
    expect(wrangler).toContain('"database_name": "my-app-db"');
    expect(await read("open-next.config.ts")).toContain(
      "defineCloudflareConfig",
    );
    expect(await read(".env")).toContain('D1_DATABASE_NAME="my-app-db"');
    expect(await read(".gitignore")).toContain(".open-next");
    expect(packageJson.scripts["cf-typegen"]).toBeDefined();
    expect(packageJson.scripts.deploy).toContain("opennextjs-cloudflare");
  });

  it("configures TanStack Start with Cloudflare D1", async () => {
    await configure({ framework: "tanstack", database: "d1" });

    const database = await read("src/lib/auth/database.ts");
    const dashboard = await read("src/routes/dashboard.tsx");

    expect(database).toContain('from "cloudflare:workers"');
    expect(await read("src/routes/api/auth/$.ts")).toContain(
      "handleAuthRequest",
    );
    expect(dashboard).toContain("createServerFn");
    expect(dashboard).toContain('redirect({ to: "/sign-in" })');
    expect(await read("wrangler.jsonc")).toContain(
      "@tanstack/react-start/server-entry",
    );
  });

  it("configures React Router with MongoDB", async () => {
    await configure({ framework: "react-router", database: "mongodb" });

    expect(await read("app/lib/auth/database.server.ts")).toContain(
      "MongoStorageAdapter",
    );
    expect(await read("app/routes/api.auth.ts")).toContain(
      "handleAuthRequest",
    );
    expect(await read("app/routes/dashboard.tsx")).toContain(
      "getSignedInUser",
    );
    expect(await read(".env")).toContain(
      'APP_ORIGIN="http://localhost:5173"',
    );
  });

  it("replaces the Node.js server scripts for React Router on D1", async () => {
    await configure({ framework: "react-router", database: "d1" });

    const packageJson = JSON.parse(await read("package.json")) as {
      scripts: Record<string, string>;
    };

    expect(await read("workers/app.ts")).toContain("createRequestHandler");
    expect(await read("wrangler.jsonc")).toContain('"main": "./workers/app.ts"');
    expect(packageJson.scripts.start).toBeUndefined();
    expect(packageJson.scripts.deploy).toContain("wrangler deploy");
  });

  it("leaves a documented adapter placeholder for a custom database", async () => {
    await configure({ framework: "next", database: "custom" });

    expect(await read("src/lib/auth/database.ts")).toContain("TODO");
    expect(await read(".env")).toContain("DATABASE_URL=");

    await expect(read("docker-compose.yml")).rejects.toMatchObject({
      code: "ENOENT",
    });
  });

  it("does not duplicate ignore patterns that already cover .env", async () => {
    await writeFile(path.join(cwd, ".gitignore"), ".env*\n", "utf8");

    await configure({ framework: "next", database: "mongodb" });

    expect(await read(".gitignore")).toBe(".env*\n");
  });

  it("keeps server modules out of client-facing templates", async () => {
    await configure({ framework: "next", database: "mongodb" });

    for (const file of [
      "src/app/sign-in/page.tsx",
      "src/app/sign-up/page.tsx",
      "src/components/sign-out-button.tsx",
    ]) {
      const source = await read(file);

      expect(source).not.toContain("@puzzle-ui/fullstack/auth/server");
      expect(source).not.toContain("lib/auth");
    }
  });

  it("configures a basic React application without server modules", async () => {
    await configure({ framework: "react" });

    expect(await read("src/auth/sign-in.tsx")).toContain('mode="sign-in"');
    expect(await read("src/auth/sign-up.tsx")).toContain('mode="sign-up"');

    await expect(read(".env")).rejects.toMatchObject({ code: "ENOENT" });
    await expect(read("src/lib/auth/services.ts")).rejects.toMatchObject({
      code: "ENOENT",
    });
  });
});
