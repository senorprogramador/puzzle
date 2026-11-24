import { access, readFile, rm, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { Readable } from "node:stream";
import path from "node:path";

import { afterAll, beforeAll, describe, expect, inject, it, vi } from "vitest";
import { chromium } from "playwright";

import { createWebAuthnCredentialFixture } from "../../auth/tests/fixtures/webauthn-cryptographic-fixture.mjs";
import { runCli } from "../src/cli";
import { prepareMongoDB } from "../src/auth/prepare-mongodb";
import { fontConfigPaths } from "../src/theme/templates";
import type { Framework } from "../src/types";
import { HttpClient } from "./http";
import {
  getScaffolds,
  selectScaffolds,
  toProjectConfiguration,
  type Scaffold,
} from "./matrix";
import type { Server } from "./process";
import { run } from "./process";
import {
  buildProject,
  createLocalPackageRunner,
  readEnvironment,
  startDevProject,
  startMongo,
  startProject,
  stopMongo,
  useMongoPort,
} from "./project";

type PackageJson = {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  overrides?: Record<string, string>;
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
    const configPath = path.join(root, `${scaffold.id}.config.json`);
    let packageJson: PackageJson;
    let server: Server | undefined;
    let mongoStarted = false;
    const composeProject = `puzzle-e2e-${randomUUID()}`;
    const previousComposeProject = process.env.COMPOSE_PROJECT_NAME;
    const previousComposeFile = process.env.COMPOSE_FILE;
    const initialUser = {
      email: `initial-${scaffold.id}@example.com`,
      password: "Initial 'quoted' $password\\ with unicode \u00e9",
    };

    const requireServer = () => {
      if (!server) {
        throw new Error(
          "The production server did not start; see the previous test.",
        );
      }

      return server;
    };

    beforeAll(() => {
      if (scaffold.database === "mongodb") {
        process.env.COMPOSE_PROJECT_NAME = composeProject;
        process.env.COMPOSE_FILE = path.join(directory, "docker-compose.yml");
      }
    });

    afterAll(async () => {
      try {
        await server?.stop();
        if (mongoStarted) await stopMongo(directory);
        if (process.env.PUZZLE_E2E_KEEP !== "1") {
          await rm(directory, { recursive: true, force: true });
        }
        await rm(configPath, { force: true });
      } finally {
        if (scaffold.database === "mongodb") {
          if (previousComposeProject === undefined) delete process.env.COMPOSE_PROJECT_NAME;
          else process.env.COMPOSE_PROJECT_NAME = previousComposeProject;
          if (previousComposeFile === undefined) delete process.env.COMPOSE_FILE;
          else process.env.COMPOSE_FILE = previousComposeFile;
        }
      }
    });

    it("creates and installs the project", async () => {
      const localRunner = createLocalPackageRunner(inject("puzzlePackages"));

      await writeFile(
        configPath,
        JSON.stringify(toProjectConfiguration(scaffold), null, 2),
      );
      await runCli(
        [
          "--config",
          configPath,
          ...(runsAuth ? ["--credentials-stdin"] : []),
        ],
        {
        cwd: root,
        stdin: Readable.from([JSON.stringify(initialUser)]),
        runner: async (command, args, options) => {
          if (scaffold.database === "mongodb" && args.join(" ") === "run db:setup" && !mongoStarted) {
            await useMongoPort(directory, port + MONGO_PORT_OFFSET);
            mongoStarted = true;
          }
          await localRunner(command, args, options);
        },
        },
      );

      packageJson = JSON.parse(
        await readFile(path.join(directory, "package.json"), "utf8"),
      ) as PackageJson;

      expect(packageJson).toMatchObject({ name: scaffold.id });
      expect(hasDependency(packageJson, "@puzzle-ui/ui")).toBe(true);
      expect(hasDependency(packageJson, "@puzzle-ui/theme")).toBe(true);
      expect(packageJson.overrides?.["@puzzle-ui/media"]).toBe(
        `file:${inject("puzzlePackages")["@puzzle-ui/media"]}`,
      );
      expect(packageJson.overrides?.["@puzzle-ui/cms"]).toBe(
        `file:${inject("puzzlePackages")["@puzzle-ui/cms"]}`,
      );
      expect(hasDependency(packageJson, "@puzzle-ui/auth")).toBe(scaffold.auth);
      expect(hasDependency(packageJson, "tailwindcss")).toBe(scaffold.tailwind);
      expect(hasDependency(packageJson, "nitro")).toBe(
        scaffold.framework === "tanstack" && scaffold.database !== "d1",
      );
      expect(hasDependency(packageJson, "wrangler")).toBe(
        scaffold.database === "d1",
      );
      if (scaffold.database === "mongodb") {
        const compose = JSON.parse(
          await run("docker", ["compose", "config", "--format", "json"], { cwd: directory }),
        ) as { name?: string };
        expect(compose.name).toBe(composeProject);
      }
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

    if (scaffold.tailwind) {
      it("compiles Puzzle and default Tailwind responsive and color utilities", async () => {
        let cssPath: string;
        switch (scaffold.framework) {
          case "next":
            cssPath = "src/app/globals.css";
            break;
          case "react-router":
            cssPath = "app/app.css";
            break;
          case "react":
            cssPath = "src/index.css";
            break;
          case "tanstack": {
            const root = await readFile(
              path.join(directory, "src/routes/__root.tsx"),
              "utf8",
            );
            const importedCss = root.match(
              /import\s+(?:[\w{}\s,*]+\s+from\s+)?["'](\.[^"']+\.css)(?:\?url)?["']/,
            )?.[1];
            if (!importedCss) {
              throw new Error("TanStack root stylesheet import not found");
            }
            cssPath = path.resolve(directory, "src/routes", importedCss);
            break;
          }
        }

        const css = await readFile(path.resolve(directory, cssPath), "utf8");
        const theme = css.match(
          /\/\* Puzzle responsive breakpoints \*\/\s*@theme\s*\{[^}]*\}/,
        )?.[0];
        const colors = css.match(
          /\/\* Puzzle semantic colors \*\/\s*@theme inline\s*\{[^}]*\}/,
        )?.[0];
        expect(theme).toBeDefined();
        expect(colors).toBeDefined();
        const output = await run(
          "bun",
          ["-e", `
          import { readFile } from "node:fs/promises";
          import { compile } from "tailwindcss";
          import { BREAKPOINTS, DEFAULT_COLOR_SCHEME } from "@puzzle-ui/theme";
          const defaults = await readFile(new URL(import.meta.resolve("tailwindcss/theme.css")), "utf8");
          const compiler = await compile(defaults + ${JSON.stringify(theme)} + ${JSON.stringify(colors)} + "\\n@tailwind utilities;");
          const roles = Object.keys(DEFAULT_COLOR_SCHEME.light).map((name) => name.replace(/[A-Z]/g, (letter) => "-" + letter.toLowerCase()));
          const classes = [
            ...[...Object.keys(BREAKPOINTS), "md", "lg"].map((name) => name + ":flex"),
            ...roles.map((name) => "bg-puzzle-" + name),
            "text-puzzle-primary-foreground", "border-puzzle-border", "bg-puzzle-primary/50", "bg-red-500",
          ];
          console.log(JSON.stringify({ css: compiler.build(classes), breakpoints: BREAKPOINTS, roles }));
        `],
          { cwd: directory },
        );
        const result = JSON.parse(output) as {
          css: string;
          breakpoints: Record<string, number>;
          roles: string[];
        };
        for (const [name, pixels] of Object.entries(result.breakpoints)) {
          expect(result.css).toMatch(
            new RegExp(`@media \\(width >= ${pixels / 16}rem\\) \\{(?:(?!@media)[\\s\\S])*?\\.${name}\\\\:flex`),
          );
        }
        expect(result.css).toContain(".md\\:flex");
        expect(result.css).toContain(".lg\\:flex");
        for (const role of result.roles) {
          expect(result.css).toContain(
            `.bg-puzzle-${role} {\n  background-color: var(--puzzle-color-${role});`,
          );
        }
        expect(result.css).toContain(".bg-red-500");
        expect(result.css).toContain(".bg-puzzle-primary\\/50");
        expect(result.css).toContain(
          "color: var(--puzzle-color-primary-foreground);",
        );
        expect(result.css).toContain("border-color: var(--puzzle-color-border);");

        if (scaffold.framework === "react" && !scaffold.auth) {
          const browser = await chromium.launch();
          try {
            const page = await browser.newPage();
            await page.setContent(`
              <style>
                ${result.css}
                :root { --puzzle-color-primary: rgb(1, 2, 3); }
                .local { --puzzle-color-primary: rgb(4, 5, 6); }
              </style>
              <div id="root-color" class="bg-puzzle-primary"></div>
              <div class="local"><div id="local-color" class="bg-puzzle-primary"></div></div>
            `);
            const background = (selector: string) =>
              page.locator(selector).evaluate((element) =>
                getComputedStyle(element).backgroundColor,
              );
            expect(await background("#root-color")).toBe("rgb(1, 2, 3)");
            expect(await background("#local-color")).toBe("rgb(4, 5, 6)");
            await page.locator(".local").evaluate((element) =>
              element.style.setProperty("--puzzle-color-primary", "rgb(7, 8, 9)"),
            );
            expect(await background("#local-color")).toBe("rgb(7, 8, 9)");
          } finally {
            await browser.close();
          }
        }
      });
    }

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

      if (scaffold.framework === "react-router" && scaffold.database === "d1") {
        expect(packageJson.dependencies?.["reflect-metadata"]).toBeDefined();
        const worker = await readFile(path.join(directory, "workers/app.ts"), "utf8");
        expect(worker).toContain('import "reflect-metadata";');
      }
    });

    if (scaffold.database === "mongodb") {
      it("starts MongoDB with access control", async () => {
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

      if (scaffold.framework === "tanstack" && !scaffold.tailwind) {
        it("resets a previous scaffold database only after confirmation", async () => {
          const shell = (script: string) => run(
            "docker",
            ["compose", "exec", "-T", "mongodb", "mongosh", "--quiet", "--eval", script],
            { cwd: directory },
          );
          const authenticate = `
            const application = db.getSiblingDB(process.env.MONGODB_DATABASE);
            application.auth(process.env.MONGODB_APP_USERNAME, process.env.MONGODB_APP_PASSWORD);
          `;
          await shell(`${authenticate} application.setup_probe.insertOne({ _id: "old-scaffold" });`);
          const runner = createLocalPackageRunner(inject("puzzlePackages"));
          expect(await prepareMongoDB(directory, runner, async () => false)).toBe(false);
          await shell(`${authenticate} if (!application.setup_probe.findOne({ _id: "old-scaffold" })) quit(1);`);

          const envPath = path.join(directory, ".env");
          const environment = await readFile(envPath, "utf8");
          await writeFile(
            envPath,
            environment.replace(/^MONGODB_ROOT_PASSWORD="[^"]*"$/m, `MONGODB_ROOT_PASSWORD="${"1".repeat(64)}"`),
          );
          const requestReset = vi.fn(async (volumes: string[]) => {
            expect(volumes).toEqual([
              `${composeProject}_mongodb-data`,
              `${composeProject}_mongodb-config`,
            ]);
            return true;
          });
          expect(await prepareMongoDB(directory, runner, requestReset)).toBe(true);
          expect(requestReset).toHaveBeenCalledOnce();
          await startMongo(directory);
          await shell(`${authenticate} if (application.setup_probe.findOne({ _id: "old-scaffold" })) quit(1);`);
          await run("node", ["scripts/create-initial-user.mjs"], {
            cwd: directory,
            input: JSON.stringify(initialUser),
          });
        });

        it("upgrades a userless legacy volume without losing data or resetting passwords", async () => {
          await stopMongo(directory);
          const override = path.join(directory, "docker-compose.legacy.yml");

          await writeFile(
            override,
            `services:
  mongodb:
    entrypoint: ["mongod", "--replSet", "rs0", "--bind_ip_all"]
    healthcheck:
      disable: true
`,
          );
          await run(
            "docker",
            [
              "compose", "-f", "docker-compose.yml",
              "-f", "docker-compose.legacy.yml", "up", "--detach",
            ],
            { cwd: directory },
          );

          const shell = (script: string) =>
            run(
              "docker",
              ["compose", "exec", "-T", "mongodb", "mongosh", "--quiet", "--eval", script],
              { cwd: directory },
            );

          await vi.waitFor(
            () => shell("rs.initiate({ _id: 'rs0', members: [{ _id: 0, host: 'localhost:27017' }] })"),
            { timeout: 30_000, interval: 1_000 },
          );
          await vi.waitFor(
            () => shell(`
              if (!db.hello().isWritablePrimary) quit(1);
              db.getSiblingDB(process.env.MONGODB_DATABASE)
                .setup_probe.insertOne({ _id: "preserved", value: "legacy-data" });
            `),
            { timeout: 30_000, interval: 1_000 },
          );
          await rm(override);
          await startMongo(directory);
          await startMongo(directory);

          const checkData = () => shell(`
            const application = db.getSiblingDB(process.env.MONGODB_DATABASE);
            application.auth(process.env.MONGODB_APP_USERNAME, process.env.MONGODB_APP_PASSWORD);
            if (application.setup_probe.findOne({ _id: "preserved" })?.value !== "legacy-data") quit(1);
          `);

          await checkData();

          await shell(`
            db.getSiblingDB("admin").auth(
              process.env.MONGO_INITDB_ROOT_USERNAME,
              process.env.MONGO_INITDB_ROOT_PASSWORD,
            );
            db.getSiblingDB(process.env.MONGODB_DATABASE)
              .dropUser(process.env.MONGODB_APP_USERNAME);
          `);
          await expect(
            shell('load("/opt/puzzle/mongodb/check.js")'),
          ).rejects.toThrow("application authentication failed");
          await startMongo(directory);
          await checkData();

          const envPath = path.join(directory, ".env");
          const environment = await readFile(envPath, "utf8");

          for (const [key, message] of [
            ["MONGODB_APP_PASSWORD", "application authentication failed"],
            ["MONGODB_ROOT_PASSWORD", "administrator credentials do not match"],
          ]) {
            try {
              await writeFile(
                envPath,
                environment.replace(
                  new RegExp(`^${key}="[^"]*"$`, "m"),
                  `${key}="${"0".repeat(64)}"`,
                ),
              );
              await expect(
                run("bun", ["run", "db:setup"], { cwd: directory }),
              ).rejects.toThrow(message);
              await expect(
                shell('load("/opt/puzzle/mongodb/check.js")'),
              ).rejects.toThrow(/authentication failed/i);
            } finally {
              await writeFile(envPath, environment);
              await startMongo(directory);
            }

            await checkData();
          }

          await run("node", ["scripts/create-initial-user.mjs"], {
            cwd: directory,
            input: JSON.stringify(initialUser),
          });
        });
      }
    }

    it("serves the home route and auth in development", async () => {
      if (scaffold.framework === "tanstack" && scaffold.database === "mongodb") {
        const envPath = path.join(directory, ".env");
        const environment = await readFile(envPath, "utf8");
        await writeFile(
          envPath,
          environment.replace(/^APP_ORIGIN="[^"]*"$/m, `APP_ORIGIN="http://localhost:${port}"`),
        );
      }
      server = await startDevProject(directory, port);

      try {
        const home = await fetch(server.url);

        expect(home.status, server.output()).toBe(200);
        expect(await home.text()).toContain("Puzzle");

        if (fullStackAuth) {
          const { APP_ORIGIN } = await readEnvironment(directory);
          const client = new HttpClient(server.url, APP_ORIGIN!);
          const state = await client.request("/api/auth/state");

          expect(state.status, await state.clone().text()).toBe(
            runsAuth ? 200 : 503,
          );
          expect(await state.json()).toMatchObject(
            runsAuth
              ? { status: "unauthenticated" }
              : { error: { code: "AUTH_NOT_CONFIGURED" } },
          );

          if (runsAuth) {
            const initialSignIn = await client.postJson("/api/auth/sign-in", initialUser);

            expect(initialSignIn.ok, await initialSignIn.clone().text()).toBe(true);
            expect(await (await client.request("/api/auth/state")).json())
              .toMatchObject({ status: "authenticated", user: { email: initialUser.email } });
            expect((await client.postJson("/api/auth/sign-out", {})).ok).toBe(true);

            const email = `dev-${scaffold.id}@example.com`;
            const register = await client.postJson("/api/auth/register", {
              email,
              password: "correct horse battery staple",
            });

            expect(register.ok, await register.clone().text()).toBe(true);
            expect(await (await client.request("/api/auth/state")).json())
              .toMatchObject({ status: "authenticated", user: { email } });
            const dashboard = await client.request("/dashboard");

            expect(dashboard.status).toBe(200);
            expect(await dashboard.text()).toContain(email);
            expect((await client.postJson("/api/auth/sign-out", {})).ok).toBe(true);
            expectRedirectTo(await client.request("/dashboard"), "/sign-in");
            expect(server.output()).not.toContain("Puzzle Auth is unavailable");
          }
        }

        if (scaffold.framework === "tanstack") {
          const missing = await fetch(new URL("/puzzle-missing-page", server.url));

          expect(missing.status).toBe(404);
          expect(await missing.text()).toContain("Page not found");
          expect(server.output()).not.toContain("notFoundComponent option was not configured");
        }
      } finally {
        await server.stop();
        server = undefined;
      }
    });

    it("builds and typechecks", async () => {
      await buildProject(directory, scaffold);
    });

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
      if (scaffold.framework === "tanstack" && scaffold.database === "mongodb") {
        it("enrolls and signs in with a browser passkey", async () => {
          const { url } = requireServer();
          const { APP_ORIGIN } = await readEnvironment(directory);
          const user = {
            email: `browser-passkey-${scaffold.id}@example.com`,
            password: "correct horse battery staple",
          };
          const client = new HttpClient(url, APP_ORIGIN!);
          const registration = await client.postJson("/api/auth/register", user);
          expect(registration.ok, await registration.clone().text()).toBe(true);
          const browser = await chromium.launch();
          try {
            const context = await browser.newContext();
            const page = await context.newPage();
            const cdp = await context.newCDPSession(page);
            await cdp.send("WebAuthn.enable");
            await cdp.send("WebAuthn.addVirtualAuthenticator", {
              options: {
                protocol: "ctap2",
                transport: "internal",
                hasResidentKey: true,
                hasUserVerification: true,
                isUserVerified: true,
              },
            });

            await page.goto(new URL("/sign-in", url).href);
            await page.getByLabel("Email address").fill(user.email);
            await page.locator('input[name="password"]').fill(user.password);
            await page.getByRole("button", { name: "Continue", exact: true }).click();
            await page.getByRole("heading", { name: "Add passkey" }).waitFor();
            expect(new URL(page.url()).pathname).toBe("/sign-in");
            await page.getByLabel("Current password").fill(user.password);
            await page.getByRole("button", { name: "Add passkey" }).click();
            await page.getByText("Save these codes somewhere safe.").waitFor();
            expect(new URL(page.url()).pathname).toBe("/sign-in");
            await page.getByRole("button", { name: "Continue", exact: true }).click();
            await page.waitForURL("**/dashboard");
            await page.getByRole("button", { name: "Sign out" }).click();
            await page.waitForURL("**/");
            await page.goto(new URL("/sign-in", url).href);
            await page.getByRole("button", { name: "Continue with passkey" }).click();
            await page.waitForURL("**/dashboard");
            expect(await page.getByText(user.email).count()).toBeGreaterThan(0);

            await page.getByRole("button", { name: "Sign out" }).click();
            await page.waitForURL("**/");
            await page.goto(new URL("/sign-in", url).href);
            await page.getByLabel("Email address").fill(user.email);
            await page.locator('input[name="password"]').fill(user.password);
            await page.getByRole("button", { name: "Continue", exact: true }).click();
            await page.getByRole("heading", { name: "Verify your identity" }).waitFor();
            await page.getByRole("button", { name: "Continue with passkey" }).click();
            await page.waitForURL("**/dashboard");
          } finally {
            await browser.close();
          }
        });
      }

      it("registers a passkey and signs in with it", async () => {
        const { url } = requireServer();
        const { APP_ORIGIN } = await readEnvironment(directory);
        const origin = APP_ORIGIN!;
        const client = new HttpClient(url, origin);
        const email = `passkey-${scaffold.id}@example.com`;
        const password = "correct horse battery staple";

        const register = await client.postJson("/api/auth/register", {
          email,
          password,
        });
        expect(register.ok, await register.clone().text()).toBe(true);

        const start = await client.postJson("/api/auth/mfa/passkey/enrollment/start", {
          currentPassword: password,
        });
        expect(start.ok, await start.clone().text()).toBe(true);
        const { options } = await start.json() as { options: { challenge: string } };
        const fixture = createWebAuthnCredentialFixture({
          challenge: options.challenge,
          origin,
          rpId: new URL(origin).hostname,
        });
        const finish = await client.postJson("/api/auth/mfa/passkey/enrollment/finish", {
          response: fixture.registrationResponse,
        });
        expect(finish.ok, await finish.clone().text()).toBe(true);
        expect((await finish.json()).recoveryCodes.length).toBeGreaterThan(0);

        expect((await client.postJson("/api/auth/sign-out", {})).ok).toBe(true);
        const signInStart = await client.postJson("/api/auth/mfa/passkey/sign-in/start", {});
        expect(signInStart.ok, await signInStart.clone().text()).toBe(true);
        const signInOptions = await signInStart.json() as { options: { challenge: string } };
        const signInFinish = await client.postJson("/api/auth/mfa/passkey/sign-in/finish", {
          response: fixture.createAuthenticationResponse({
            challenge: signInOptions.options.challenge,
          }),
        });
        expect(signInFinish.ok, await signInFinish.clone().text()).toBe(true);
        expect(await (await client.request("/api/auth/state")).json()).toMatchObject({
          status: "authenticated",
          user: { email },
        });
        expect((await client.request("/dashboard")).status).toBe(200);
      });

      it("preserves the initial user's password and rejects duplicate bootstrap", async () => {
        const { url } = requireServer();
        const { APP_ORIGIN } = await readEnvironment(directory);
        const client = new HttpClient(url, APP_ORIGIN!);

        await expect(run("node", ["scripts/create-initial-user.mjs"], {
          cwd: directory,
          input: JSON.stringify({ ...initialUser, password: "replacement password" }),
        })).rejects.toThrow();

        const signIn = await client.postJson("/api/auth/sign-in", initialUser);

        expect(signIn.ok, await signIn.clone().text()).toBe(true);
        expect((await client.request("/dashboard")).status).toBe(200);
        expect((await client.postJson("/api/auth/sign-out", {})).ok).toBe(true);
        const wrongPassword = await client.postJson("/api/auth/sign-in", {
          ...initialUser,
          password: "replacement password",
        });

        expect(wrongPassword.ok).toBe(false);
      });

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
