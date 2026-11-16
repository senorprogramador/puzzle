import { randomBytes } from "node:crypto";

import type { AuthDatabase, FullStackFramework, PackageManager } from "../types";

export type InfrastructureOptions = {
  framework: FullStackFramework;
  database: AuthDatabase;
  projectName: string;
  packageManager: PackageManager;
};

/**
 * Compatibility date for generated Cloudflare Workers configuration.
 */
export const CLOUDFLARE_COMPATIBILITY_DATE = "2026-11-01";

/**
 * Placeholder D1 database ID. Local development does not use it; replace it
 * with the ID from `wrangler d1 create` before deploying.
 */
export const PREVIEW_D1_DATABASE_ID = "00000000-0000-0000-0000-000000000000";

const appOrigins: Record<FullStackFramework, string> = {
  next: "http://localhost:3000",
  tanstack: "http://localhost:3000",
  "react-router": "http://localhost:5173",
};

const toIdentifier = (projectName: string) =>
  projectName
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "puzzle-app";

const getD1DatabaseName = (projectName: string) =>
  `${toIdentifier(projectName)}-db`;

const databaseEnvironment = ({ database, projectName }: InfrastructureOptions) => {
  if (database === "mongodb") {
    return `
# MongoDB connection. Start the local replica set with: docker compose up -d
# Auth uses transactions, which require a replica set.
MONGODB_URI="mongodb://localhost:27017/?directConnection=true"
MONGODB_DATABASE="${toIdentifier(projectName).replace(/-/g, "_")}"
`;
  }

  if (database === "d1") {
    return `
# Cloudflare D1. The app reads D1 through the \`DB\` binding in wrangler.jsonc;
# these values mirror that binding for reference. Local development uses a
# local D1 database in .wrangler/state with the preview ID. Before deploying,
# run \`wrangler d1 create ${getD1DatabaseName(projectName)}\` and copy the
# database ID into wrangler.jsonc and below.
# 32 random bytes as 64 hex characters. Peppers password hashes. Store it as a
# Worker secret (wrangler secret put AUTH_PASSWORD_PEPPER_HEX), never in D1.
# Changing it makes every existing password stop verifying.
AUTH_PASSWORD_PEPPER_HEX="${randomBytes(32).toString("hex")}"

D1_DATABASE_NAME="${getD1DatabaseName(projectName)}"
D1_DATABASE_ID="${PREVIEW_D1_DATABASE_ID}"
`;
  }

  return `
# Add the connection settings for your database here, then return its
# storage adapter from the generated auth database module.
DATABASE_URL="preview://replace-with-your-database-url"
`;
};

const createEnvironmentFile = (options: InfrastructureOptions) => `# Server-only settings for Puzzle Auth. Never commit this file.
# Generated secrets are unique to this project; use new values in production.

# The exact origin users open, without a trailing slash. Used for CSRF checks.
APP_ORIGIN="${appOrigins[options.framework]}"

# 32 random bytes as 64 hex characters. Encrypts authenticator (MFA) secrets.
AUTH_ENCRYPTION_KEY_HEX="${randomBytes(32).toString("hex")}"

# Keys the rate-limit counters. At least 32 random characters.
AUTH_RATE_LIMIT_SECRET="${randomBytes(48).toString("base64url")}"

# Production only: a client IP header your host always overwrites${
  options.database === "d1" ? ",\n# for example cf-connecting-ip on Cloudflare" : ""
}.
# TRUSTED_CLIENT_IP_HEADER="x-real-ip"
${databaseEnvironment(options)}`;

const mongoDockerCompose = `services:
  mongodb:
    image: mongo:8
    # Auth needs transactions, which require a replica set.
    command: ["--replSet", "rs0", "--bind_ip_all"]
    ports:
      - "27017:27017"
    volumes:
      - mongodb-data:/data/db
    healthcheck:
      test:
        - CMD
        - mongosh
        - --quiet
        - --eval
        - "try { rs.status().ok } catch (error) { rs.initiate({ _id: 'rs0', members: [{ _id: 0, host: 'localhost:27017' }] }).ok }"
      interval: 5s
      timeout: 10s
      retries: 12
      start_period: 5s

volumes:
  mongodb-data:
`;

const wranglerConfig = ({ framework, projectName }: InfrastructureOptions) => {
  const name = toIdentifier(projectName);

  const config: Record<string, unknown> = {
    $schema: "node_modules/wrangler/config-schema.json",
    name,
    main:
      framework === "next"
        ? ".open-next/worker.js"
        : framework === "tanstack"
          ? "@tanstack/react-start/server-entry"
          : "./workers/app.ts",
    compatibility_date: CLOUDFLARE_COMPATIBILITY_DATE,
    compatibility_flags:
      framework === "next"
        ? ["nodejs_compat", "global_fetch_strictly_public"]
        : ["nodejs_compat"],
    ...(framework === "next"
      ? {
          assets: { directory: ".open-next/assets", binding: "ASSETS" },
          services: [{ binding: "WORKER_SELF_REFERENCE", service: name }],
        }
      : {}),
    observability: { enabled: true },
    d1_databases: [
      {
        binding: "DB",
        database_name: getD1DatabaseName(projectName),
        database_id: PREVIEW_D1_DATABASE_ID,
      },
    ],
  };

  return `${JSON.stringify(config, null, 2)}\n`;
};

const openNextConfig = `import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig();
`;

const reactRouterWorker = `import { createRequestHandler } from "react-router";

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

export default {
  fetch: (request) => requestHandler(request),
} satisfies ExportedHandler<Env>;
`;

// Workers support web streams, not the Node.js streams used by the default entry.
const reactRouterEntryServer = `import type { EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";

const handleRequest = async (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) => {
  let status = responseStatusCode;
  let shellRendered = false;
  const userAgent = request.headers.get("user-agent");

  const body = await renderToReadableStream(
    <ServerRouter context={routerContext} url={request.url} />,
    {
      onError(error: unknown) {
        status = 500;

        if (shellRendered) {
          console.error(error);
        }
      },
    },
  );

  shellRendered = true;

  if ((userAgent && isbot(userAgent)) || routerContext.isSpaMode) {
    await body.allReady;
  }

  responseHeaders.set("Content-Type", "text/html");

  return new Response(body, {
    headers: responseHeaders,
    status,
  });
};

export default handleRequest;
`;

const getInfrastructureFiles = (
  options: InfrastructureOptions,
): Record<string, string> => {
  const files: Record<string, string> = {
    ".env": createEnvironmentFile(options),
  };

  if (options.database === "mongodb") {
    files["docker-compose.yml"] = mongoDockerCompose;
  }

  if (options.database === "d1") {
    files["wrangler.jsonc"] = wranglerConfig(options);

    if (options.framework === "next") {
      files["open-next.config.ts"] = openNextConfig;
    }

    if (options.framework === "react-router") {
      files["workers/app.ts"] = reactRouterWorker;
      files["app/entry.server.tsx"] = reactRouterEntryServer;
    }
  }

  return files;
};

const getGitignoreEntries = ({ database, framework }: InfrastructureOptions) => [
  ".env",
  ...(database === "d1"
    ? [
        ".wrangler",
        ".dev.vars*",
        ...(framework === "next" ? [".open-next"] : []),
      ]
    : []),
];

/**
 * package.json scripts for building and deploying to Cloudflare Workers.
 */
const getCloudflareScripts = ({
  framework,
  packageManager,
}: InfrastructureOptions): Record<string, string> => {
  if (framework === "next") {
    return {
      preview: "opennextjs-cloudflare build && opennextjs-cloudflare preview",
      deploy: "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
      upload: "opennextjs-cloudflare build && opennextjs-cloudflare upload",
      "cf-typegen":
        "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts",
    };
  }

  return {
    preview: `${packageManager} run build && vite preview`,
    deploy: `${packageManager} run build && wrangler deploy`,
    "cf-typegen": "wrangler types",
  };
};

export {
  getCloudflareScripts,
  getGitignoreEntries,
  getInfrastructureFiles,
  getD1DatabaseName,
};
