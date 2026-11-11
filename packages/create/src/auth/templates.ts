import type { Framework } from "../types";

const authServer = `import type { AuthServer } from "@puzzle-ui/fullstack/auth/server";

let authServer: AuthServer | null = null;

/**
 * Register the server configured by your application.
 *
 * Create the AuthServer with your own storage adapter, password hasher,
 * rate limiter, session manager, MFA manager and CSRF configuration.
 *
 * Never import this module from browser-facing code.
 */
export const configureAuthServer = (server: AuthServer): void => {
  if (authServer && authServer !== server) {
    throw new Error("Puzzle Auth has already been configured.");
  }

  authServer = server;
};

/**
 * Returns null until the application has registered its AuthServer.
 */
export const getAuthServer = (): AuthServer | null => authServer;
`;

const authBootstrap = `/**
 * Initialize Puzzle Auth once for this server runtime.
 *
 * Configure your storage adapter and security providers here.
 *
 * Example:
 *
 * configureAuthServer(
 *   createAuthServer({
 *     auth,
 *     mfa,
 *     stepUp,
 *     sessions,
 *     cookie,
 *     csrf,
 *     resolveClientIp,
 *   }),
 * );
 *
 * Do not use development-only or in-memory providers in production.
 */
const configure = async (): Promise<void> => {
  // TODO: initialize your application-specific AuthServer.
};

let initialization: Promise<void> | null = null;

export const initializePuzzleAuth = (): Promise<void> => {
  if (!initialization) {
    initialization = configure().catch((error: unknown) => {
      initialization = null;
      throw error;
    });
  }

  return initialization;
};
`;

const authUnavailableResponse = `const createAuthUnavailableResponse = (): Response =>
  new Response(
    JSON.stringify({
      error: {
        code: "AUTH_NOT_CONFIGURED",
        message: "Puzzle Auth has not been configured by the application.",
      },
    }),
    {
      status: 503,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        Pragma: "no-cache",
      },
    },
  );

export { createAuthUnavailableResponse };
`;

const nextProviders = `"use client";

import type { ReactNode } from "react";

import { Theme } from "@puzzle-ui/theme";
import { AuthProvider } from "@puzzle-ui/fullstack/auth/client";

type ProvidersProps = {
  children: ReactNode;
};

const Providers = ({ children }: ProvidersProps) => (
  <Theme theme="system">
    <AuthProvider options={{ basePath: "/api/auth" }}>
      {children}
    </AuthProvider>
  </Theme>
);

export { Providers };
`;

const nextSignIn = `"use client";

import { AuthExperience } from "@puzzle-ui/fullstack/auth/client";

const SignInPage = () => <AuthExperience mode="sign-in" />;

export default SignInPage;
`;

const nextSignUp = `"use client";

import { AuthExperience } from "@puzzle-ui/fullstack/auth/client";

const SignUpPage = () => <AuthExperience mode="sign-up" />;

export default SignUpPage;
`;

const nextAuthRoute = `import { createNextAuthHandler } from "@puzzle-ui/fullstack/auth/next";

import { getAuthServer } from "../../../../lib/auth/server";
import { initializePuzzleAuth } from "../../../../lib/auth/bootstrap";
import { createAuthUnavailableResponse } from "../../../../lib/auth/unavailable";

const handle = async (request: Request): Promise<Response> => {
  await initializePuzzleAuth();

  const auth = getAuthServer();

  if (!auth) {
    return createAuthUnavailableResponse();
  }

  const handlers = createNextAuthHandler({ auth });

  return request.method.toUpperCase() === "GET"
    ? handlers.GET(request)
    : handlers.POST(request);
};

export { handle as GET, handle as POST };
`;

const tanstackRoot = `import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";

import { Theme } from "@puzzle-ui/theme";
import { AuthProvider } from "@puzzle-ui/fullstack/auth/client";

const RootComponent = () => (
  <html lang="en">
    <head>
      <HeadContent />
    </head>
    <body>
      <Theme theme="system">
        <AuthProvider options={{ basePath: "/api/auth" }}>
          <Outlet />
        </AuthProvider>
      </Theme>
      <Scripts />
    </body>
  </html>
);

export const Route = createRootRoute({
  component: RootComponent,
});
`;

const tanstackSignIn = `import { createFileRoute } from "@tanstack/react-router";

import { AuthExperience } from "@puzzle-ui/fullstack/auth/client";

const SignInPage = () => <AuthExperience mode="sign-in" />;

export const Route = createFileRoute("/sign-in")({
  component: SignInPage,
});
`;

const tanstackSignUp = `import { createFileRoute } from "@tanstack/react-router";

import { AuthExperience } from "@puzzle-ui/fullstack/auth/client";

const SignUpPage = () => <AuthExperience mode="sign-up" />;

export const Route = createFileRoute("/sign-up")({
  component: SignUpPage,
});
`;

const tanstackAuthRoute = `import { createFileRoute } from "@tanstack/react-router";

import { createTanStackAuthHandler } from "@puzzle-ui/fullstack/auth/tanstack";

import { getAuthServer } from "../../../lib/auth/server";
import { initializePuzzleAuth } from "../../../lib/auth/bootstrap";
import { createAuthUnavailableResponse } from "../../../lib/auth/unavailable";

const handle = async (request: Request): Promise<Response> => {
  await initializePuzzleAuth();

  const auth = getAuthServer();

  if (!auth) {
    return createAuthUnavailableResponse();
  }

  return createTanStackAuthHandler({ auth })(request);
};

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => handle(request),
      POST: ({ request }) => handle(request),
    },
  },
});
`;

const reactMain = `import React from "react";
import ReactDOM from "react-dom/client";

import { Theme } from "@puzzle-ui/theme";
import { AuthProvider } from "@puzzle-ui/fullstack/auth/client";

import App from "./App";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")!,
).render(
  <React.StrictMode>
    <Theme theme="system">
      <AuthProvider options={{ basePath: "/api/auth" }}>
        <App />
      </AuthProvider>
    </Theme>
  </React.StrictMode>,
);
`;

const reactSignIn = `import { AuthExperience } from "@puzzle-ui/fullstack/auth/client";

export const SignInPage = () => <AuthExperience mode="sign-in" />;
`;

const reactSignUp = `import { AuthExperience } from "@puzzle-ui/fullstack/auth/client";

export const SignUpPage = () => <AuthExperience mode="sign-up" />;
`;

const authTemplates: Record<Framework, Record<string, string>> = {
  next: {
    "src/app/providers.tsx": nextProviders,
    "src/app/sign-in/page.tsx": nextSignIn,
    "src/app/sign-up/page.tsx": nextSignUp,
    "src/app/api/auth/[...auth]/route.ts": nextAuthRoute,
    "src/lib/auth/server.ts": authServer,
    "src/lib/auth/bootstrap.ts": authBootstrap,
    "src/lib/auth/unavailable.ts": authUnavailableResponse,
  },
  tanstack: {
    "src/routes/__root.tsx": tanstackRoot,
    "src/routes/sign-in.tsx": tanstackSignIn,
    "src/routes/sign-up.tsx": tanstackSignUp,
    "src/routes/api/auth/$.ts": tanstackAuthRoute,
    "src/lib/auth/server.ts": authServer,
    "src/lib/auth/bootstrap.ts": authBootstrap,
    "src/lib/auth/unavailable.ts": authUnavailableResponse,
  },
  react: {
    "src/main.tsx": reactMain,
    "src/auth/sign-in.tsx": reactSignIn,
    "src/auth/sign-up.tsx": reactSignUp,
  },
};

export { authTemplates };
