import { describe, expect, it } from "vitest";

import {
  getCloudflareScripts,
  getGitignoreEntries,
  getInfrastructureFiles,
} from "./infrastructure";

import type { AuthDatabase, FullStackFramework, PackageManager } from "../types";

const frameworks: FullStackFramework[] = ["next", "tanstack", "react-router"];
const databases: AuthDatabase[] = ["mongodb", "d1", "custom"];

describe("getInfrastructureFiles", () => {
  it.each(frameworks.flatMap((framework) =>
    databases.map((database) => ({ framework, database })),
  ))("generates the $database files for $framework", ({ framework, database }) => {
    const files = getInfrastructureFiles({
      framework,
      database,
      projectName: "My Example-App",
      packageManager: "bun",
    });

    expect(files[".env"]).toContain(
      `APP_ORIGIN="${framework === "react-router" ? "http://localhost:5173" : "http://localhost:3000"}"`,
    );
    expect(files[".env"]).toMatch(/AUTH_ENCRYPTION_KEY_HEX="[a-f0-9]{64}"/);
    expect(files[".env"]).toMatch(/AUTH_RATE_LIMIT_SECRET="[^"]+"/);

    if (database === "mongodb") {
      expect(files[".env"]).toContain('MONGODB_DATABASE="my_example_app"');
      expect(files[".env"]).toMatch(/MONGODB_APP_PASSWORD="[a-f0-9]{64}"/);
      expect(files["docker-compose.yml"]).toContain("--replSet");
      expect(files["scripts/setup-mongodb.mjs"]).toContain("docker compose");
      expect(files["scripts/create-initial-user.mjs"]).toContain(
        'from "@puzzle-ui/storage-mongodb"',
      );
      expect(files["wrangler.jsonc"]).toBeUndefined();
    } else {
      expect(files["docker-compose.yml"]).toBeUndefined();
      expect(files["scripts/setup-mongodb.mjs"]).toBeUndefined();
      expect(files["docker/mongodb/check.js"]).toBeUndefined();
      expect(files["scripts/create-initial-user.mjs"] !== undefined).toBe(
        database === "d1",
      );
    }

    if (database === "d1") {
      const wrangler = JSON.parse(files["wrangler.jsonc"]!);
      expect(wrangler.d1_databases[0]).toEqual({
        binding: "DB",
        database_name: "my-example-app-db",
        database_id: "00000000-0000-0000-0000-000000000000",
      });
      expect(files[".env"]).toMatch(/AUTH_PASSWORD_PEPPER_HEX="[a-f0-9]{64}"/);
      expect(files["scripts/create-initial-user.mjs"]).toContain(
        'from "@puzzle-ui/storage-d1"',
      );
      expect(files["wrangler.jsonc"]).toContain(`"main": ${
        framework === "next"
          ? '".open-next/worker.js"'
          : framework === "tanstack"
            ? '"@tanstack/react-start/server-entry"'
            : '"./workers/app.ts"'
      }`);
      expect(files["open-next.config.ts"] !== undefined).toBe(framework === "next");
      expect(files["workers/app.ts"] !== undefined).toBe(framework === "react-router");
      expect(files["app/entry.server.tsx"] !== undefined).toBe(framework === "react-router");
    } else {
      expect(files["wrangler.jsonc"]).toBeUndefined();
      expect(files["open-next.config.ts"]).toBeUndefined();
      expect(files["workers/app.ts"]).toBeUndefined();
    }
  });

  it("creates independent MongoDB credentials and has safe initial-user input handling", () => {
    const options = {
      framework: "next" as const,
      database: "mongodb" as const,
      projectName: "test",
      packageManager: "npm" as const,
    };
    const first = getInfrastructureFiles(options);
    const second = getInfrastructureFiles(options);

    const firstAppPassword = first[".env"]!.match(
      /^MONGODB_APP_PASSWORD="([a-f0-9]{64})"$/m,
    )?.[1];
    const firstRootPassword = first[".env"]!.match(
      /^MONGODB_ROOT_PASSWORD="([a-f0-9]{64})"$/m,
    )?.[1];

    expect(firstAppPassword).toBeDefined();
    expect(firstRootPassword).toBeDefined();
    expect(firstRootPassword).not.toBe(firstAppPassword);
    expect(second[".env"]).not.toBe(first[".env"]);
    expect(first["scripts/create-initial-user.mjs"]).toContain(
      "Credentials arrive over stdin",
    );
    expect(first["scripts/create-initial-user.mjs"]).toContain(
      "JSON.parse(credentials)",
    );
    expect(first["scripts/create-initial-user.mjs"]).not.toContain(
      "process.argv",
    );
  });
});

describe("infrastructure environment entries", () => {
  it.each(databases)("adds the correct ignore entries for %s", (database) => {
    const common = {
      framework: "next" as const,
      database,
      projectName: "example",
      packageManager: "bun" as const,
    };

    expect(getGitignoreEntries(common)).toContain(".env");
    expect(getGitignoreEntries(common)).toEqual(
      database === "d1" ? [".env", ".wrangler", ".dev.vars*", ".open-next"] : [".env"],
    );
  });

  it.each([
    ["next", "bun", "opennextjs-cloudflare build && opennextjs-cloudflare preview"],
    ["tanstack", "pnpm", "pnpm run build && vite preview"],
    ["react-router", "yarn", "yarn run build && vite preview"],
  ] as const)(
    "generates deployment scripts for %s using %s",
    (framework, packageManager, expectedPreview) => {
      const scripts = getCloudflareScripts({
        framework,
        database: "d1",
        projectName: "example",
        packageManager: packageManager as PackageManager,
      });

      expect(scripts.preview).toBe(expectedPreview);
      expect(scripts.deploy).toContain(
        framework === "next" ? "opennextjs-cloudflare" : "wrangler deploy",
      );
      expect(scripts["cf-typegen"]).toBe(
        framework === "next"
          ? "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts"
          : "wrangler types",
      );
    },
  );
});
