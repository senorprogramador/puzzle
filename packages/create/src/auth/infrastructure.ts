import { randomBytes } from "node:crypto";

import type { AuthDatabase, FullStackFramework, PackageManager } from "../types";
import { getInitialUserTemplate } from "./initial-user-template";

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

const getMongoDatabaseName = (projectName: string) =>
  toIdentifier(projectName).replace(/-/g, "_");

// Hex keeps generated passwords safe to embed in a connection string.
const createDatabasePassword = () => randomBytes(32).toString("hex");

const databaseEnvironment = ({ database, projectName, packageManager }: InfrastructureOptions) => {
  if (database === "mongodb") {
    const databaseName = getMongoDatabaseName(projectName);
    const appUsername = `${databaseName}_app`;
    const appPassword = createDatabasePassword();

    return `
# MongoDB. docker compose reads these values from this file. Start the
# replica set with: ${packageManager} run db:setup
# Auth uses transactions, which require a replica set.
# Setup also creates missing users on an older local volume without users.
# Existing passwords and data are never reset. To change a password,
# update the user in MongoDB as well as here.

# Administrator, used only by Docker for setup and health checks.
MONGODB_ROOT_USERNAME="root"
MONGODB_ROOT_PASSWORD="${createDatabasePassword()}"

# Application user with read/write access to MONGODB_DATABASE only.
MONGODB_DATABASE="${databaseName}"
MONGODB_APP_USERNAME="${appUsername}"
MONGODB_APP_PASSWORD="${appPassword}"
MONGODB_URI="mongodb://${appUsername}:${appPassword}@localhost:27017/${databaseName}?authSource=${databaseName}&directConnection=true"
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

// Credentials are interpolated from .env, which docker compose reads automatically.
const mongoDockerCompose = `services:
  mongodb:
    image: mongo:8
    restart: unless-stopped
    # Auth needs transactions, which require a replica set. A replica set with
    # access control needs a keyfile; one is generated on first start and kept
    # in the mongodb-config volume.
    entrypoint:
      - bash
      - -c
      - |
        set -euo pipefail
        keyfile=/data/configdb/replica-set.key
        if [ ! -s "$$keyfile" ]; then
          head -c 756 /dev/urandom | base64 -w 0 > "$$keyfile"
        fi
        chown mongodb:mongodb "$$keyfile"
        chmod 400 "$$keyfile"
        exec docker-entrypoint.sh mongod --replSet rs0 --keyFile "$$keyfile" --bind_ip_all
    environment:
      MONGO_INITDB_ROOT_USERNAME: \${MONGODB_ROOT_USERNAME:?Set MONGODB_ROOT_USERNAME in .env}
      MONGO_INITDB_ROOT_PASSWORD: \${MONGODB_ROOT_PASSWORD:?Set MONGODB_ROOT_PASSWORD in .env}
      MONGODB_DATABASE: \${MONGODB_DATABASE:?Set MONGODB_DATABASE in .env}
      MONGODB_APP_USERNAME: \${MONGODB_APP_USERNAME:?Set MONGODB_APP_USERNAME in .env}
      MONGODB_APP_PASSWORD: \${MONGODB_APP_PASSWORD:?Set MONGODB_APP_PASSWORD in .env}
    # Only reachable from this machine. Do not publish MongoDB publicly.
    ports:
      - "127.0.0.1:27017:27017"
    volumes:
      - mongodb-data:/data/db
      - mongodb-config:/data/configdb
      - ./docker/mongodb/create-app-user.js:/docker-entrypoint-initdb.d/create-app-user.js:ro
      - ./docker/mongodb/check.js:/opt/puzzle/mongodb/check.js:ro
    healthcheck:
      test:
        - CMD
        - mongosh
        - --quiet
        - --file
        - /opt/puzzle/mongodb/check.js
      interval: 5s
      timeout: 10s
      retries: 12
      start_period: 10s

volumes:
  mongodb-data:
  mongodb-config:
`;

const mongoCreateAppUser = `// Runs once, when the MongoDB data volume is first initialised.
// Creates the least-privileged user the application connects with.
const databaseName = process.env.MONGODB_DATABASE;

db.getSiblingDB(databaseName).createUser({
  user: process.env.MONGODB_APP_USERNAME,
  pwd: process.env.MONGODB_APP_PASSWORD,
  roles: [{ role: "readWrite", db: databaseName }],
});
`;

const mongoCheck = `const setup = process.env.PUZZLE_MONGODB_SETUP === "1";
const admin = db.getSiblingDB("admin");
const databaseName = process.env.MONGODB_DATABASE;
const application = db.getSiblingDB(databaseName);

const fail = (message) => {
  console.error(message);
  quit(2);
};

const initiate = () => {
  rs.initiate({
    _id: "rs0",
    members: [{ _id: 0, host: "localhost:27017" }],
  });
  quit(1);
};

try {
  admin.auth(
    process.env.MONGO_INITDB_ROOT_USERNAME,
    process.env.MONGO_INITDB_ROOT_PASSWORD,
  );
} catch (error) {
  if (error.code !== 18) {
    throw error;
  }

  if (!setup) {
    fail("MongoDB administrator authentication failed. Run the generated db:setup script.");
  }

  // The localhost exception permits the first administrator only when no
  // users exist. It cannot reset credentials or replace an existing user.
  const hello = admin.hello();

  if (hello.isreplicaset && !hello.setName) {
    initiate();
  }
  if (!hello.isWritablePrimary) {
    quit(1);
  }

  try {
    admin.createUser({
      user: process.env.MONGO_INITDB_ROOT_USERNAME,
      pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
      roles: [{ role: "root", db: "admin" }],
    });
  } catch (error) {
    if (error.code !== 13) {
      throw error;
    }

    fail("MongoDB already has users, but the administrator credentials do not match. Restore the original .env credentials or ask your database administrator. No passwords or data were reset.");
  }

  admin.auth(
    process.env.MONGO_INITDB_ROOT_USERNAME,
    process.env.MONGO_INITDB_ROOT_PASSWORD,
  );
}

try {
  rs.status();
} catch (error) {
  if (error.code !== 94) {
    throw error;
  }
  initiate();
}

if (!admin.hello().isWritablePrimary) {
  quit(1);
}

if (setup && !application.getUser(process.env.MONGODB_APP_USERNAME)) {
  application.createUser({
    user: process.env.MONGODB_APP_USERNAME,
    pwd: process.env.MONGODB_APP_PASSWORD,
    roles: [{ role: "readWrite", db: databaseName }],
  });
}

try {
  application.auth(
    process.env.MONGODB_APP_USERNAME,
    process.env.MONGODB_APP_PASSWORD,
  );
} catch (error) {
  if (error.code !== 18) {
    throw error;
  }
  fail("MongoDB application authentication failed. Restore the original .env credentials or update the user password as an administrator. No passwords or data were reset.");
}

quit(0);
`;

const mongoSetup = `import { spawnSync } from "node:child_process";
import { setTimeout } from "node:timers/promises";

const compose = (args, stdio = "pipe") => {
  const result = spawnSync("docker", ["compose", ...args], {
    stdio,
    encoding: "utf8",
    timeout: 120_000,
  });

  if (result.error) {
    throw result.error;
  }

  return result;
};

const started = compose(["up", "--detach"], "inherit");

if (started.status !== 0) {
  process.exit(started.status ?? 1);
}

const deadline = Date.now() + 120_000;
let output = "";

while (Date.now() < deadline) {
  const result = compose([
    "exec", "-T", "-e", "PUZZLE_MONGODB_SETUP=1", "mongodb",
    "mongosh", "--quiet", "--file", "/opt/puzzle/mongodb/check.js",
  ]);

  if (result.status === 0) {
    console.log("MongoDB is ready. Existing passwords and data were preserved.");
    process.exit(0);
  }

  output = [result.stdout, result.stderr].filter(Boolean).join("\\n");

  if (result.status === 2) {
    break;
  }

  await setTimeout(2_000);
}

console.error(output);
console.error("MongoDB setup failed. Check docker compose logs mongodb and make sure .env matches the existing database. Shell variables override Compose's .env values. No volumes were deleted.");
process.exit(1);
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

const reactRouterWorker = `// Initialize WebAuthn's metadata polyfill before loading the server build.
import "reflect-metadata";
import { createRequestHandler } from "react-router";

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

  if (options.database === "mongodb" || options.database === "d1") {
    files["scripts/create-initial-user.mjs"] = getInitialUserTemplate(options.database);
  }

  if (options.database === "mongodb") {
    files["docker-compose.yml"] = mongoDockerCompose;
    files["docker/mongodb/create-app-user.js"] = mongoCreateAppUser;
    files["docker/mongodb/check.js"] = mongoCheck;
    files["scripts/setup-mongodb.mjs"] = mongoSetup;
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
