import { access, readFile, rm } from "node:fs/promises";
import path from "node:path";

import { afterAll, describe, expect, inject, it } from "vitest";

import { createProject } from "../src/create-project";
import { fontConfigPaths } from "../src/theme/templates";
import type { Framework } from "../src/types";
import { HttpClient } from "./http";
import {
  getScaffolds,
  selectScaffolds,
  toProjectOptions,
  type Scaffold,
} from "./matrix";
import type { Server } from "./process";
import { run } from "./process";
import {
  buildProject,
  createLocalPackageRunner,
  readEnvironment,
  startMongo,
  startProject,
  stopMongo,
  useMongoPort,
} from "./project";

type PackageJson = {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

const PORT_BASE: Record<Framework, number> = {
  react: 4310,
  tanstack: 4330,
  next: 4350,
  "react-router": 4370,
};

// MongoDB host ports mirror the server ports, e.g. 4352 -> 27152.
const MONGO_PORT_OFFSET = 27_100 - 4_300;

const FONT_STYLESHEET_PATH = "/fonts/puzzle-fonts.css";

/**
 * Returns the paths of the font files a generated stylesheet references,
 * resolved against the stylesheet URL.
 */
const getFontPaths = (css: string) => [
  ...new Set(
    [...css.matchAll(/url\("?([^")]+\.woff2)"?\)/g)].map(
      ([, url]) =>
        new URL(url!, `http://localhost${FONT_STYLESHEET_PATH}`).pathname,
    ),
  ),
];

const exists = (file: string) =>
  access(file).then(
    () => true,
    () => false,
  );

const hasDependency = (packageJson: PackageJson, name: string) =>
  Boolean(
    packageJson.dependencies?.[name] ?? packageJson.devDependencies?.[name],
  );

const expectRedirectTo = (response: Response, pathname: string) => {
  expect(
    response.status,
    `expected a redirect to ${pathname}`,
  ).toBeGreaterThanOrEqual(300);
  expect(response.status).toBeLessThan(400);
  expect(
    new URL(response.headers.get("location") ?? "", "http://localhost")
      .pathname,
  ).toBe(pathname);
};

/**
 * Scaffolds every option combination for a framework with the create CLI,
 * then installs, builds, typechecks and serves each project and exercises it
 * over HTTP. Projects and databases are removed afterwards.
 */
export const describeScaffolds = (framework: Framework) => {
  const scaffolds = selectScaffolds(getScaffolds(framework));

  describe.skipIf(scaffolds.length === 0)(`create ${framework}`, () => {
    scaffolds.forEach((scaffold, index) => describeScaffold(scaffold, index));
  });
};

const describeScaffold = (scaffold: Scaffold, index: number) => {
  const port = PORT_BASE[scaffold.framework] + index;
  const fullStackAuth = scaffold.auth && scaffold.framework !== "react";
  const runsAuth =
    scaffold.database === "mongodb" || scaffold.database === "d1";

  describe(scaffold.id, () => {
    const root = inject("e2eRoot");
    const directory = path.join(root, scaffold.id);
    let packageJson: PackageJson;
    let server: Server | undefined;
    let mongoStarted = false;

    const requireServer = () => {
      if (!server) {
        throw new Error(
          "The production server did not start; see the previous test.",
        );
      }

      return server;
    };

    afterAll(async () => {
      await server?.stop();

      if (mongoStarted) {
        await stopMongo(directory);
      }

      if (process.env.PUZZLE_E2E_KEEP !== "1") {
        await rm(directory, { recursive: true, force: true });
      }
    });

    it("creates and installs the project", async () => {
      await createProject(toProjectOptions(scaffold), {
        cwd: root,
        runner: createLocalPackageRunner(inject("puzzlePackages")),
      });

      packageJson = JSON.parse(
        await readFile(path.join(directory, "package.json"), "utf8"),
      ) as PackageJson;

      expect(packageJson).toMatchObject({ name: scaffold.id });
      expect(hasDependency(packageJson, "@puzzle-ui/ui")).toBe(true);
      expect(hasDependency(packageJson, "@puzzle-ui/theme")).toBe(true);
      expect(hasDependency(packageJson, "@puzzle-ui/auth")).toBe(scaffold.auth);
      expect(hasDependency(packageJson, "tailwindcss")).toBe(scaffold.tailwind);
      expect(hasDependency(packageJson, "nitro")).toBe(
        scaffold.framework === "tanstack" && scaffold.database !== "d1",
      );
      expect(hasDependency(packageJson, "wrangler")).toBe(
        scaffold.database === "d1",
      );
    });

    it("downloads the default local fonts", async () => {
      const fontConfig = JSON.parse(
        await readFile(
          path.join(directory, fontConfigPaths[scaffold.framework]),
          "utf8",
        ),
      ) as Record<"heading" | "body", { family?: string } | undefined>;
      const stylesheet = await readFile(
        path.join(directory, "public", FONT_STYLESHEET_PATH),
        "utf8",
      );
      const fontPaths = getFontPaths(stylesheet);

      expect(packageJson.scripts?.["fonts:download"]).toContain(
        fontConfigPaths[scaffold.framework],
      );
      expect(fontConfig.heading?.family).toBeTruthy();
      expect(fontConfig.body?.family).toBeTruthy();
      expect(stylesheet).toContain("@font-face");
      expect(fontPaths.length).toBeGreaterThan(0);

      for (const fontPath of fontPaths) {
        expect(
          await exists(path.join(directory, "public", fontPath)),
          fontPath,
        ).toBe(true);
      }
    });

    it("writes the infrastructure for the selected options", async () => {
      expect(await exists(path.join(directory, ".env"))).toBe(fullStackAuth);
      expect(await exists(path.join(directory, "docker-compose.yml"))).toBe(
        scaffold.database === "mongodb",
      );
      expect(await exists(path.join(directory, "wrangler.jsonc"))).toBe(
        scaffold.database === "d1",
      );

      if (scaffold.database === "mongodb") {
        const environment = await readEnvironment(directory);

        expect(environment.MONGODB_ROOT_PASSWORD).toMatch(/^[a-f0-9]{64}$/);
        expect(environment.MONGODB_APP_PASSWORD).toMatch(/^[a-f0-9]{64}$/);
        expect(environment.MONGODB_URI).toContain(
          `${environment.MONGODB_APP_USERNAME}:${environment.MONGODB_APP_PASSWORD}@`,
        );
      }
    });

    it("builds and typechecks", async () => {
      await buildProject(directory, scaffold);
    });

    if (scaffold.database === "mongodb") {
      it("starts MongoDB with access control", async () => {
        await useMongoPort(directory, port + MONGO_PORT_OFFSET);
        mongoStarted = true;
        await startMongo(directory);

        await expect(
          run(
            "docker",
            [
              "compose",
              "exec",
              "-T",
              "mongodb",
              "mongosh",
              "--quiet",
              "--eval",
              "db.adminCommand({ listDatabases: 1 })",
            ],
            { cwd: directory },
          ),
        ).rejects.toThrow(/requires authentication/);
      });
    }

    it("serves the production build with local fonts", async () => {
      server = await startProject(directory, scaffold, port);

      const home = await fetch(server.url);
      const html = await home.text();

      expect(home.status, server.output()).toBe(200);
      expect(home.headers.get("content-type")).toContain("text/html");

      // Server-rendered frameworks link the stylesheet in the initial HTML.
      if (scaffold.framework !== "react") {
        expect(html).toContain(FONT_STYLESHEET_PATH);
      }

      const stylesheet = await fetch(new URL(FONT_STYLESHEET_PATH, server.url));
      const fontPaths = getFontPaths(await stylesheet.text());

      expect(stylesheet.status).toBe(200);
      expect(fontPaths.length).toBeGreaterThan(0);

      for (const fontPath of fontPaths) {
        const font = await fetch(new URL(fontPath, server.url));

        expect(font.status, fontPath).toBe(200);
        expect((await font.arrayBuffer()).byteLength).toBeGreaterThan(0);
      }
    });

    if (scaffold.framework === "tanstack" && scaffold.database !== "d1") {
      it("serves fonts with Nitro cache headers", async () => {
        const { url } = requireServer();
        const stylesheet = await fetch(new URL(FONT_STYLESHEET_PATH, url));
        const fontPaths = getFontPaths(await stylesheet.text());
        // Content-hashed files are immutable; the stable preload copy is not.
        const versionedFont = fontPaths.find((fontPath) =>
          /\/font-[0-9a-f]{16}\.woff2$/.test(fontPath),
        );
        const preloadFont = fontPaths.find((fontPath) =>
          /\/puzzle-font-[a-z0-9-]+\.woff2$/.test(fontPath),
        );

        expect(stylesheet.headers.get("cache-control")).toBe(
          "public, max-age=86400, stale-while-revalidate=604800",
        );
        expect(versionedFont).toBeDefined();
        expect(preloadFont).toBeDefined();
        expect(
          (await fetch(new URL(versionedFont!, url))).headers.get(
            "cache-control",
          ),
        ).toBe("public, max-age=31536000, immutable");
        expect(
          (await fetch(new URL(preloadFont!, url))).headers.get(
            "cache-control",
          ),
        ).toBe("public, max-age=86400, stale-while-revalidate=604800");
        expect(
          (await fetch(url)).headers.get("cache-control") ?? "",
        ).not.toContain("immutable");
      });
    }

    if (scaffold.database === "custom") {
      it("reports that Auth needs a storage adapter", async () => {
        const { url } = requireServer();
        const signIn = await fetch(new URL("/sign-in", url));
        const state = await fetch(new URL("/api/auth/state", url));

        expect(signIn.status).toBe(200);
        expect(state.status).toBe(503);
        expect(await state.json()).toMatchObject({
          error: { code: "AUTH_NOT_CONFIGURED" },
        });
      });
    }

    if (runsAuth) {
      it("signs up, keeps a session and protects the dashboard", async () => {
        const { url } = requireServer();
        const { APP_ORIGIN } = await readEnvironment(directory);
        const client = new HttpClient(url, APP_ORIGIN!);
        const email = `e2e-${scaffold.id}@example.com`;
        const password = "correct horse battery staple";

        for (const page of ["/sign-in", "/sign-up"]) {
          expect((await client.request(page)).status, page).toBe(200);
        }

        expect(
          await (await client.request("/api/auth/state")).json(),
        ).toMatchObject({
          status: "unauthenticated",
        });
        expectRedirectTo(await client.request("/dashboard"), "/sign-in");

        const crossSite = await fetch(new URL("/api/auth/register", url), {
          method: "POST",
          headers: {
            "content-type": "application/json",
            origin: "https://evil.example",
          },
          body: JSON.stringify({ email, password }),
        });

        expect(crossSite.status).toBeGreaterThanOrEqual(400);
        expect(crossSite.status).toBeLessThan(500);

        const register = await client.postJson("/api/auth/register", {
          email,
          password,
        });

        expect(register.ok, await register.clone().text()).toBe(true);
        expect(client.cookieNames.length).toBeGreaterThan(0);
        expect(
          await (await client.request("/api/auth/state")).json(),
        ).toMatchObject({
          status: "authenticated",
          user: { email },
        });

        const dashboard = await client.request("/dashboard");

        expect(dashboard.status).toBe(200);
        expect(await dashboard.text()).toContain(email);

        expect((await client.postJson("/api/auth/sign-out", {})).ok).toBe(true);
        expect(
          await (await client.request("/api/auth/state")).json(),
        ).toMatchObject({
          status: "unauthenticated",
        });
        expectRedirectTo(await client.request("/dashboard"), "/sign-in");

        const wrongPassword = await client.postJson("/api/auth/sign-in", {
          email,
          password: "not the right password",
        });

        expect(wrongPassword.ok).toBe(false);

        const signIn = await client.postJson("/api/auth/sign-in", {
          email,
          password,
        });

        expect(signIn.ok, await signIn.clone().text()).toBe(true);
        expect((await client.request("/dashboard")).status).toBe(200);
      });
    }
  });
};
