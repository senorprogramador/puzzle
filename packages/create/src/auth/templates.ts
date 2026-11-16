import type { AuthDatabase, Framework, FullStackFramework } from "../types";

export type AuthTemplateOptions = {
  framework: Framework;
  database?: AuthDatabase;
};

type ServerLayout = {
  /** Directory of the generated server-only auth modules. */
  directory: string;
  /** Import specifier of that directory from routes and pages. */
  importPath: string;
  /** Converts a module name to its file name, e.g. "services" -> "services.server". */
  module: (name: string) => string;
};

const serverLayouts: Record<FullStackFramework, ServerLayout> = {
  next: {
    directory: "src/lib/auth",
    importPath: "@/lib/auth",
    module: (name) => name,
  },
  tanstack: {
    directory: "src/lib/auth",
    importPath: "../lib/auth",
    module: (name) => name,
  },
  // React Router never bundles `.server` modules for the browser.
  "react-router": {
    directory: "app/lib/auth",
    importPath: "~/lib/auth",
    module: (name) => `${name}.server`,
  },
};

const usesWorkersRuntime = (framework: FullStackFramework, database: AuthDatabase) =>
  database === "d1" && framework !== "next";

const environmentModule = (
  framework: FullStackFramework,
  database: AuthDatabase,
) => {
  if (usesWorkersRuntime(framework, database)) {
    return `import { env } from "cloudflare:workers";

/**
 * Reads a variable from the Cloudflare Worker environment. During local
 * development the Cloudflare Vite plugin loads them from \`.env\`.
 */
export const getEnvironmentVariable = (name: string): string | undefined => {
  const value: unknown = Reflect.get(env, name);

  return typeof value === "string" && value ? value : undefined;
};
`;
  }

  if (framework === "next") {
    return `/**
 * Reads a server-only variable. Next.js loads \`.env\` into \`process.env\`.
 */
export const getEnvironmentVariable = (name: string): string | undefined =>
  process.env[name] || undefined;
`;
  }

  return `try {
  // Loads \`.env\` without overriding variables set by your host.
  process.loadEnvFile();
} catch {
  // No \`.env\` file: variables come from the environment.
}

/**
 * Reads a server-only variable from \`process.env\`.
 */
export const getEnvironmentVariable = (name: string): string | undefined =>
  process.env[name] || undefined;
`;
};

const nodePasswordModule = `import { hash, verify } from "@node-rs/argon2";
import type { PasswordHasher } from "@puzzle-ui/auth";

// @node-rs/argon2 uses Argon2id by default.
const parameters = { memoryCost: 65536, timeCost: 3, parallelism: 1 };

const passwordHasher: PasswordHasher = {
  async hash(password) {
    return {
      hash: await hash(password, parameters),
      algorithm: "argon2id",
      parameters,
    };
  },
  verify: (password, stored) =>
    stored.hash.startsWith("$argon2id$")
      ? verify(stored.hash, password)
      : Promise.resolve(false),
};

export const createPasswordHasher = (): PasswordHasher => passwordHasher;
`;

const workersPasswordModule = (layout: ServerLayout) => `import { Pbkdf2PasswordHasher, type PasswordHasher } from "@puzzle-ui/auth";

import { getEnvironmentVariable } from "./${layout.module("environment")}";

/**
 * Cloudflare Workers cannot run native Argon2, so passwords use the built-in
 * WebCrypto PBKDF2-SHA256 with the 100,000 iterations Workers allow. A secret
 * pepper, stored outside the database, keeps leaked hashes unusable unless
 * the pepper leaks too. Changing the pepper invalidates every stored password.
 */
export const createPasswordHasher = (): PasswordHasher => {
  const pepperHex = getEnvironmentVariable("AUTH_PASSWORD_PEPPER_HEX") ?? "";

  if (!/^[a-f0-9]{64}$/i.test(pepperHex)) {
    throw new Error("AUTH_PASSWORD_PEPPER_HEX must encode exactly 32 bytes.");
  }

  const pepper = Uint8Array.from(pepperHex.match(/.{2}/g) ?? [], (byte) =>
    Number.parseInt(byte, 16),
  );

  return new Pbkdf2PasswordHasher({ pepper });
};
`;

const databaseModule = (
  framework: FullStackFramework,
  database: AuthDatabase,
  layout: ServerLayout,
) => {
  if (database === "mongodb") {
    return `import { MongoClient, MongoServerError } from "mongodb";
import { MongoStorageAdapter } from "@puzzle-ui/storage-mongodb";

import { getEnvironmentVariable } from "./${layout.module("environment")}";

type Connection = {
  client: MongoClient;
  storage: MongoStorageAdapter;
};

// Dev servers re-run modules after edits. Keeping the connection on
// globalThis reuses one connection pool per process.
const cache = globalThis as typeof globalThis & {
  puzzleDatabase?: Promise<Connection>;
};

const connect = async (): Promise<Connection> => {
  const uri = getEnvironmentVariable("MONGODB_URI");

  if (!uri) {
    throw new Error("Missing server configuration: MONGODB_URI");
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const storage = new MongoStorageAdapter({
      database: client.db(getEnvironmentVariable("MONGODB_DATABASE")),
      client,
      // Auth needs all-or-nothing writes, which require a replica set.
      transactionsEnabled: true,
    });

    return { client, storage };
  } catch (error) {
    await client.close();

    if (error instanceof MongoServerError && error.code === 18) {
      throw new Error(
        "MongoDB authentication failed. For the generated local database, run the db:setup package script. Existing volumes keep their users and passwords: restore the matching .env credentials or update the user as an administrator. Also check for shell variables overriding .env. No data should be deleted to fix authentication.",
        { cause: error },
      );
    }

    throw error;
  }
};

export const getStorage = async (): Promise<MongoStorageAdapter> => {
  cache.puzzleDatabase ??= connect().catch((error: unknown) => {
    cache.puzzleDatabase = undefined;
    throw error;
  });

  return (await cache.puzzleDatabase).storage;
};
`;
  }

  if (database === "d1") {
    if (framework === "next") {
      return `import { getCloudflareContext } from "@opennextjs/cloudflare";
import { D1StorageAdapter } from "@puzzle-ui/storage-d1";

/**
 * Uses the \`DB\` binding from wrangler.jsonc. \`next dev\` provides a local
 * D1 database, so no Cloudflare account is needed during development.
 */
export const getStorage = async (): Promise<D1StorageAdapter> => {
  const { env } = await getCloudflareContext({ async: true });

  return new D1StorageAdapter({ database: env.DB });
};
`;
    }

    return `import { env } from "cloudflare:workers";
import { D1StorageAdapter } from "@puzzle-ui/storage-d1";

/**
 * Uses the \`DB\` binding from wrangler.jsonc. The Cloudflare Vite plugin
 * provides a local D1 database, so no Cloudflare account is needed during
 * development.
 */
export const getStorage = async (): Promise<D1StorageAdapter> =>
  new D1StorageAdapter({ database: env.DB });
`;
  }

  return `import type { StorageAdapter } from "@puzzle-ui/storage";

/**
 * Return the Puzzle Storage adapter for your database.
 *
 * Auth requires an adapter that supports unique constraints and atomic
 * batches. See https://puzzle-ui.com/docs/storage for the available
 * adapters and how to write your own.
 */
export const getStorage = async (): Promise<StorageAdapter> => {
  // TODO: create and return your storage adapter.
  throw new Error(
    "Puzzle Auth has no database yet. Return a storage adapter from ${layout.directory}/${layout.module("database")}.ts.",
  );
};
`;
};

const clientIpModule = (
  database: AuthDatabase,
  layout: ServerLayout,
) => `import { getEnvironmentVariable } from "./${layout.module("environment")}";

const isLocalOrigin = (origin: string | undefined) => {
  if (!origin) {
    return false;
  }

  const { hostname } = new URL(origin);

  return hostname === "localhost" || hostname === "127.0.0.1";
};

/**
 * Returns the client IP used for rate limiting.
 *
 * Headers such as X-Forwarded-For can be set by anyone. In production, set
 * TRUSTED_CLIENT_IP_HEADER to a header your host always overwrites${
   database === "d1" ? ", such as\n * cf-connecting-ip on Cloudflare" : ""
 }.
 */
export const resolveClientIp = (request: Request): string => {
  const header = getEnvironmentVariable("TRUSTED_CLIENT_IP_HEADER");

  if (!header) {
    if (isLocalOrigin(getEnvironmentVariable("APP_ORIGIN"))) {
      return "127.0.0.1";
    }

    throw new Error(
      "Set TRUSTED_CLIENT_IP_HEADER to a header your host or proxy controls.",
    );
  }

  const ip = request.headers.get(header)?.split(",")[0]?.trim();

  if (!ip) {
    throw new Error(\`The trusted \${header} header is missing.\`);
  }

  return ip;
};
`;

const servicesModule = (layout: ServerLayout) => `import {
  SimpleWebAuthnProvider,
  StorageAuthManager,
  StorageAuthMfaManager,
  StorageAuthStepUpManager,
  StorageRateLimitProvider,
  WebCryptoAuthSecretProtector,
} from "@puzzle-ui/auth";
import {
  createAuthServer,
  type AuthServer,
} from "@puzzle-ui/fullstack/auth/server";
import {
  createSessionCookieOptions,
  readSessionCookie,
  StorageSessionManager,
} from "@puzzle-ui/session";

import { resolveClientIp } from "./${layout.module("client-ip")}";
import { getStorage } from "./${layout.module("database")}";
import { getEnvironmentVariable } from "./${layout.module("environment")}";
import { createPasswordHasher } from "./${layout.module("password")}";

const required = (name: string) => {
  const value = getEnvironmentVariable(name);

  if (!value) {
    throw new Error(\`Missing server configuration: \${name}\`);
  }

  return value;
};

const hexToBytes = (hex: string) =>
  Uint8Array.from(hex.match(/.{2}/g) ?? [], (byte) => Number.parseInt(byte, 16));

const readOrigin = () => {
  const origin = required("APP_ORIGIN");
  const url = new URL(origin);
  const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";

  if (url.origin !== origin || (url.protocol !== "https:" && !local)) {
    throw new Error(
      "APP_ORIGIN must be an exact origin without a trailing slash, using HTTPS outside localhost.",
    );
  }

  return url;
};

const createServices = async () => {
  const origin = readOrigin();
  const keyHex = required("AUTH_ENCRYPTION_KEY_HEX");

  if (!/^[a-f0-9]{64}$/i.test(keyHex)) {
    throw new Error("AUTH_ENCRYPTION_KEY_HEX must encode exactly 32 bytes.");
  }

  const rateLimitKeySecret = required("AUTH_RATE_LIMIT_SECRET");
  const passwordHasher = createPasswordHasher();
  const storage = await getStorage();

  const sessions = new StorageSessionManager(storage, {
    lifetime: { idleTimeoutSeconds: 1800, absoluteLifetimeSeconds: 86400 },
  });
  const rateLimitProvider = new StorageRateLimitProvider(storage);
  const secretProtector = new WebCryptoAuthSecretProtector({
    currentKeyId: "primary",
    keys: { primary: hexToBytes(keyHex) },
  });
  const mfa = new StorageAuthMfaManager(
    {
      storage, sessions, passwordHasher, rateLimitProvider, secretProtector,
      webAuthnProvider: new SimpleWebAuthnProvider(),
    },
    {
      rateLimitKeySecret,
      issuer: origin.hostname,
      webAuthn: {
        rpId: origin.hostname,
        rpName: origin.hostname,
        origin: origin.origin,
      },
    },
  );
  const auth = new StorageAuthManager(
    { storage, sessions, passwordHasher, rateLimitProvider, mfa },
    { rateLimitKeySecret, minimumPasswordLength: 12 },
  );
  const stepUp = new StorageAuthStepUpManager({ storage, sessions, mfa });
  // Secure, __Host- prefixed cookies require HTTPS.
  const cookie = createSessionCookieOptions({
    production: origin.protocol === "https:",
  });
  const authServer = createAuthServer({
    auth,
    mfa,
    stepUp,
    sessions,
    cookie,
    csrf: { allowedOrigins: [origin.origin] },
    resolveClientIp,
  });

  // Registers the collections and unique indexes on first use.
  await sessions.initialize();
  await rateLimitProvider.initialize();
  await authServer.initialize();

  return { auth, authServer, cookie, sessions, storage };
};

export type AuthServices = Awaited<ReturnType<typeof createServices>>;

const cache = globalThis as typeof globalThis & {
  puzzleAuthServices?: Promise<AuthServices>;
};

/**
 * Creates the auth services once per server process, on first use.
 */
export const getServices = (): Promise<AuthServices> => {
  cache.puzzleAuthServices ??= createServices().catch((error: unknown) => {
    cache.puzzleAuthServices = undefined;
    throw error;
  });

  return cache.puzzleAuthServices;
};

/**
 * Returns the signed-in user for a request's Cookie header, or null.
 */
export const getSignedInUser = async (cookieHeader: string | null) => {
  const services = await getServices();
  const token = readSessionCookie(cookieHeader, services.cookie.name);

  return token ? services.auth.getCurrentUser(token) : null;
};

/**
 * The /api/auth endpoints this app exposes. Everything else returns 404.
 * Add endpoints here when you build additional auth features.
 */
const enabledAuthEndpoints = new Set([
  "/api/auth/register",
  "/api/auth/sign-in",
  "/api/auth/state",
  "/api/auth/sign-out",
  "/api/auth/mfa/sign-in/totp",
  "/api/auth/mfa/sign-in/recovery-code",
  "/api/auth/mfa/passkey/sign-in/start",
  "/api/auth/mfa/passkey/sign-in/finish",
  "/api/auth/mfa/passkey/challenge/start",
  "/api/auth/mfa/passkey/challenge/finish",
  "/api/auth/mfa/passkey/enrollment/start",
  "/api/auth/mfa/passkey/enrollment/finish",
  "/api/auth/mfa/totp/enrollment/start",
  "/api/auth/mfa/totp/enrollment/finish",
  "/api/auth/mfa/factors",
  "/api/auth/mfa/factors/remove",
  "/api/auth/mfa/recovery-codes/regenerate",
]);

const noStore = { "Cache-Control": "no-store" };

/**
 * Runs an /api/auth request against the configured AuthServer.
 */
export const handleAuthRequest = async (
  request: Request,
  handle: (authServer: AuthServer) => Promise<Response>,
): Promise<Response> => {
  if (!enabledAuthEndpoints.has(new URL(request.url).pathname)) {
    return new Response(null, { status: 404, headers: noStore });
  }

  let services: AuthServices;

  try {
    services = await getServices();
  } catch (error) {
    console.error("Puzzle Auth is unavailable:", error);

    return Response.json(
      {
        error: {
          code: "AUTH_NOT_CONFIGURED",
          message: "Puzzle Auth is not available. Check the server logs.",
        },
      },
      { status: 503, headers: noStore },
    );
  }

  return handle(services.authServer);
};
`;

const authConfig = (database: AuthDatabase) => `const authConfig = {
  redirects: { afterSignIn: "/dashboard", afterSignUp: "/dashboard" },
  offerPasskeyAfterSignIn: ${database === "mongodb" || database === "d1"},
};`;

const dashboardBody = (email: string) => `<Container
  as="main"
  widthPreset="content"
  style={{ paddingBlock: "var(--puzzle-space-16)" }}
>
  <Stack direction="col" gap="lg">
    <Stack direction="col" gap="sm">
      <Heading as="h1" level="headline1">
        Dashboard
      </Heading>
      <Text as="p">
        Signed in as <strong>{${email}}</strong>. The server checks your
        session before this page is rendered.
      </Text>
    </Stack>
    <Stack direction="row" gap="sm" wrap="wrap">
      <Button href="/" variant="outline">
        Back to home
      </Button>
      <SignOutButton />
    </Stack>
    <MfaSettings />
  </Stack>
</Container>`;

const indent = (value: string, spaces: number) =>
  value
    .split("\n")
    .map((line) => (line ? `${" ".repeat(spaces)}${line}` : line))
    .join("\n");

const signOutButton = (framework: FullStackFramework) => `${
  framework === "next" ? '"use client";\n\n' : ""
}import { useState } from "react";

import { useAuth } from "@puzzle-ui/fullstack/auth/client";
import { Button } from "@puzzle-ui/ui";

export const SignOutButton = () => {
  const { signOut } = useAuth();
  const [pending, setPending] = useState(false);

  const handleSignOut = async () => {
    setPending(true);

    try {
      await signOut();
      window.location.assign("/");
    } catch (error) {
      console.error(error);
      setPending(false);
    }
  };

  return (
    <Button variant="secondary" onClick={handleSignOut} disabled={pending}>
      Sign out
    </Button>
  );
};
`;

const dashboardImports = `import { MfaSettings } from "@puzzle-ui/fullstack/auth/client";
import { Button, Container, Heading, Stack, Text } from "@puzzle-ui/ui";`;

const nextTemplates = (database: AuthDatabase) => {
  const layout = serverLayouts.next;

  return {
    "src/app/api/auth/[...auth]/route.ts": `import { createNextAuthHandler } from "@puzzle-ui/fullstack/auth/next";

import { handleAuthRequest } from "${layout.importPath}/services";

const handleAuth = (request: Request) =>
  handleAuthRequest(request, (auth) => {
    const handlers = createNextAuthHandler({ auth });

    return request.method === "GET"
      ? handlers.GET(request)
      : handlers.POST(request);
  });

export { handleAuth as GET, handleAuth as POST };
`,
    "src/app/sign-in/page.tsx": `"use client";

import { useRouter } from "next/navigation";

import { AuthExperience } from "@puzzle-ui/fullstack/auth/client";

${authConfig(database)}

const SignInPage = () => {
  const router = useRouter();

  return (
    <main>
      <AuthExperience
        mode="sign-in"
        config={authConfig}
        onSignUp={() => router.push("/sign-up")}
      />
    </main>
  );
};

export default SignInPage;
`,
    "src/app/sign-up/page.tsx": `"use client";

import { useRouter } from "next/navigation";

import { AuthExperience } from "@puzzle-ui/fullstack/auth/client";

${authConfig(database)}

const SignUpPage = () => {
  const router = useRouter();

  return (
    <main>
      <AuthExperience
        mode="sign-up"
        config={authConfig}
        onSignIn={() => router.push("/sign-in")}
      />
    </main>
  );
};

export default SignUpPage;
`,
    "src/app/dashboard/page.tsx": `import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

${dashboardImports}

import { SignOutButton } from "@/components/sign-out-button";
import { getSignedInUser } from "${layout.importPath}/services";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

// A server component: the session is checked before anything is rendered.
const DashboardPage = async () => {
  const user = await getSignedInUser((await headers()).get("cookie"));

  if (!user) {
    redirect("/sign-in");
  }

  return (
${indent(dashboardBody("user.email"), 4)}
  );
};

export default DashboardPage;
`,
    "src/components/sign-out-button.tsx": signOutButton("next"),
    ...serverModules("next", database),
  };
};

const tanstackTemplates = (database: AuthDatabase) => {
  const layout = serverLayouts.tanstack;

  return {
    "src/routes/api/auth/$.ts": `import { createFileRoute } from "@tanstack/react-router";

import { createTanStackAuthHandler } from "@puzzle-ui/fullstack/auth/tanstack";

import { handleAuthRequest } from "../../../lib/auth/services";

const handleAuth = (request: Request) =>
  handleAuthRequest(request, (auth) =>
    createTanStackAuthHandler({ auth })(request),
  );

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => handleAuth(request),
      POST: ({ request }) => handleAuth(request),
    },
  },
});
`,
    "src/routes/sign-in.tsx": `import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { AuthExperience } from "@puzzle-ui/fullstack/auth/client";

${authConfig(database)}

const SignInPage = () => {
  const navigate = useNavigate();

  return (
    <main>
      <AuthExperience
        mode="sign-in"
        config={authConfig}
        onSignUp={() => void navigate({ to: "/sign-up" })}
      />
    </main>
  );
};

export const Route = createFileRoute("/sign-in")({
  component: SignInPage,
});
`,
    "src/routes/sign-up.tsx": `import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { AuthExperience } from "@puzzle-ui/fullstack/auth/client";

${authConfig(database)}

const SignUpPage = () => {
  const navigate = useNavigate();

  return (
    <main>
      <AuthExperience
        mode="sign-up"
        config={authConfig}
        onSignIn={() => void navigate({ to: "/sign-in" })}
      />
    </main>
  );
};

export const Route = createFileRoute("/sign-up")({
  component: SignUpPage,
});
`,
    "src/routes/dashboard.tsx": `import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";

${dashboardImports}

import { SignOutButton } from "../components/sign-out-button";
import { getSignedInUser } from "${layout.importPath}/services";

// Runs on the server, also when navigating on the client.
const getUser = createServerFn({ method: "GET" }).handler(async () => {
  const user = await getSignedInUser(getRequestHeader("cookie") ?? null);

  if (!user) {
    throw redirect({ to: "/sign-in" });
  }

  return { email: user.email };
});

const DashboardPage = () => {
  const user = Route.useLoaderData();

  return (
${indent(dashboardBody("user.email"), 4)}
  );
};

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard" }, { name: "robots", content: "noindex" }],
  }),
  loader: () => getUser(),
  component: DashboardPage,
});
`,
    "src/components/sign-out-button.tsx": signOutButton("tanstack"),
    ...serverModules("tanstack", database),
  };
};

const reactRouterTemplates = (database: AuthDatabase) => {
  const layout = serverLayouts["react-router"];

  return {
    "app/routes/api.auth.ts": `import { createAuthRouteHandlers } from "@puzzle-ui/fullstack/auth/server";

import { handleAuthRequest } from "${layout.importPath}/${layout.module("services")}";

import type { Route } from "./+types/api.auth";

const handleAuth = (request: Request) =>
  handleAuthRequest(request, async (auth) => {
    const route = createAuthRouteHandlers(auth)[new URL(request.url).pathname];
    const method = request.method.toUpperCase();
    const handler = method === "GET" || method === "POST" ? route?.[method] : undefined;

    return handler
      ? handler(request)
      : new Response(null, {
          status: 405,
          headers: { "Cache-Control": "no-store" },
        });
  });

export const loader = ({ request }: Route.LoaderArgs) => handleAuth(request);

export const action = ({ request }: Route.ActionArgs) => handleAuth(request);
`,
    "app/routes/sign-in.tsx": `import { useNavigate } from "react-router";

import { AuthExperience } from "@puzzle-ui/fullstack/auth/client";

export const meta = () => [{ title: "Sign in" }];

${authConfig(database)}

const SignInPage = () => {
  const navigate = useNavigate();

  return (
    <main>
      <AuthExperience
        mode="sign-in"
        config={authConfig}
        onSignUp={() => void navigate("/sign-up")}
      />
    </main>
  );
};

export default SignInPage;
`,
    "app/routes/sign-up.tsx": `import { useNavigate } from "react-router";

import { AuthExperience } from "@puzzle-ui/fullstack/auth/client";

export const meta = () => [{ title: "Create an account" }];

${authConfig(database)}

const SignUpPage = () => {
  const navigate = useNavigate();

  return (
    <main>
      <AuthExperience
        mode="sign-up"
        config={authConfig}
        onSignIn={() => void navigate("/sign-in")}
      />
    </main>
  );
};

export default SignUpPage;
`,
    "app/routes/dashboard.tsx": `import { redirect } from "react-router";

${dashboardImports}

import { SignOutButton } from "~/components/sign-out-button";
import { getSignedInUser } from "${layout.importPath}/${layout.module("services")}";

import type { Route } from "./+types/dashboard";

export const meta = () => [
  { title: "Dashboard" },
  { name: "robots", content: "noindex" },
];

// Runs on the server for every request, before the page is rendered.
export const loader = async ({ request }: Route.LoaderArgs) => {
  const user = await getSignedInUser(request.headers.get("cookie"));

  if (!user) {
    throw redirect("/sign-in");
  }

  return { email: user.email };
};

const DashboardPage = ({ loaderData: user }: Route.ComponentProps) => (
${indent(dashboardBody("user.email"), 2)}
);

export default DashboardPage;
`,
    "app/components/sign-out-button.tsx": signOutButton("react-router"),
    ...serverModules("react-router", database),
  };
};

const serverModules = (
  framework: FullStackFramework,
  database: AuthDatabase,
): Record<string, string> => {
  const layout = serverLayouts[framework];
  const file = (name: string) => `${layout.directory}/${layout.module(name)}.ts`;

  return {
    [file("environment")]: environmentModule(framework, database),
    [file("password")]:
      database === "d1" ? workersPasswordModule(layout) : nodePasswordModule,
    [file("database")]: databaseModule(framework, database, layout),
    [file("client-ip")]: clientIpModule(database, layout),
    [file("services")]: servicesModule(layout),
  };
};

const reactSignIn = `import { AuthExperience } from "@puzzle-ui/fullstack/auth/client";

export const SignInPage = () => <AuthExperience mode="sign-in" />;
`;

const reactSignUp = `import { AuthExperience } from "@puzzle-ui/fullstack/auth/client";

export const SignUpPage = () => <AuthExperience mode="sign-up" />;
`;

const getAuthTemplates = ({
  framework,
  database = "custom",
}: AuthTemplateOptions): Record<string, string> => {
  switch (framework) {
    case "next":
      return nextTemplates(database);
    case "tanstack":
      return tanstackTemplates(database);
    case "react-router":
      return reactRouterTemplates(database);
    case "react":
      return {
        "src/auth/sign-in.tsx": reactSignIn,
        "src/auth/sign-up.tsx": reactSignUp,
      };
  }
};

export { getAuthTemplates };
