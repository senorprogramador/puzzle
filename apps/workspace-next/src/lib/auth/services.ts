import {
  SimpleWebAuthnProvider,
  StorageAuthManager,
  StorageAuthLifecycleManager,
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
  protectStateChangingRequest,
  readSessionCookie,
  SessionSecurityError,
  StorageSessionManager,
} from "@puzzle-ui/session";
import {
  handleWorkspaceDeviceAuthRequest,
  initializeWorkspaceStorage,
  WORKSPACE_DEMO_EMAIL,
  WORKSPACE_DEMO_MFA_CODE,
  WorkspaceDeviceAuthManager,
} from "@puzzle-ui/workspace/server";

import { resolveClientIp } from "./client-ip";
import { getStorage } from "./database";
import { getEnvironmentVariable } from "./environment";
import { createPasswordHasher } from "./password";
import { createResendEmailProvider } from "./email";

const required = (name: string) => {
  const value = getEnvironmentVariable(name);

  if (!value) {
    throw new Error(`Missing server configuration: ${name}`);
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
  await initializeWorkspaceStorage(storage);
  const deviceAuth = new WorkspaceDeviceAuthManager();

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
      demoTotpBypass: {
        code: WORKSPACE_DEMO_MFA_CODE,
        email: WORKSPACE_DEMO_EMAIL,
      },
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
  const lifecycle = new StorageAuthLifecycleManager(
    {
      storage,
      passwordHasher,
      emailProvider: createResendEmailProvider(),
      sessions,
      rateLimitProvider,
    },
    { rateLimitKeySecret },
  );
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
    lifecycle: {
      lifecycle,
      sessions,
      cookie,
      csrf: { allowedOrigins: [origin.origin] },
      resolveClientIp,
      verificationUrl: () => new URL("/verify-email", origin).toString(),
      passwordResetUrl: () => new URL("/reset-password", origin).toString(),
      emailChangeUrl: () =>
        new URL("/verify-email-change", origin).toString(),
      allowPasswordChange: false,
    },
  });

  // Registers the collections and unique indexes on first use.
  await sessions.initialize();
  await rateLimitProvider.initialize();
  await authServer.initialize();

  return { auth, authServer, cookie, deviceAuth, sessions, storage };
};

export type AuthServices = Awaited<ReturnType<typeof createServices>>;

const cache = globalThis as typeof globalThis & {
  puzzleAuthServicesV2?: Promise<AuthServices>;
};

/**
 * Creates the auth services once per server process, on first use.
 */
export const getServices = (): Promise<AuthServices> => {
  cache.puzzleAuthServicesV2 ??= createServices().catch((error: unknown) => {
    cache.puzzleAuthServicesV2 = undefined;
    throw error;
  });

  return cache.puzzleAuthServicesV2;
};

/**
 * Returns the signed-in user for a request's Cookie header, or null.
 */
export const getSignedInUser = async (cookieHeader: string | null) => {
  const services = await getServices();
  const token = readSessionCookie(cookieHeader, services.cookie.name);

  if (!token) return null;

  return (
    services.deviceAuth.getUser(token) ??
    services.auth.getCurrentUser(token)
  );
};

export const getWorkspaceIdentity = async (cookieHeader: string | null) => {
  const user = await getSignedInUser(cookieHeader);

  return user
    ? {
        userId: user.id,
        email: user.email,
        emailVerified: user.emailVerifiedAt !== null,
      }
    : null;
};

export const protectWorkspaceMutation = (request: Request): Response | null => {
  try {
    protectStateChangingRequest(request, {
      allowedOrigins: [readOrigin().origin],
    });

    return null;
  } catch (error) {
    if (!(error instanceof SessionSecurityError)) throw error;

    return Response.json(
      {
        error: {
          code: "CSRF_REJECTED",
          message: "The request origin could not be verified.",
        },
      },
      { status: 403, headers: { "Cache-Control": "no-store" } },
    );
  }
};

/**
 * The /api/auth endpoints this app exposes. Everything else returns 404.
 * Add endpoints here when you build additional auth features.
 */
const enabledAuthEndpoints = new Set([
  "/api/auth/sign-in",
  "/api/auth/state",
  "/api/auth/sign-out",
  "/api/auth/email/verification/request",
  "/api/auth/email/verification/verify",
  "/api/auth/email/change/request",
  "/api/auth/email/change/verify",
  "/api/auth/password/reset/request",
  "/api/auth/password/reset/finish",
  "/api/auth/password/change",
  "/api/auth/profile",
  "/api/auth/sessions",
  "/api/auth/sessions/revoke",
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
  const pathname = new URL(request.url).pathname;
  const isDeviceAuthEndpoint = pathname.startsWith("/api/auth/device/");
  const isDisabledRegistrationEndpoint = pathname === "/api/auth/register";

  if (
    !isDeviceAuthEndpoint &&
    !isDisabledRegistrationEndpoint &&
    !enabledAuthEndpoints.has(pathname)
  ) {
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

  if (isDisabledRegistrationEndpoint) {
    if (request.method !== "POST") {
      return Response.json(
        {
          error: {
            code: "METHOD_NOT_ALLOWED",
            message: "Only POST requests are supported.",
          },
        },
        { status: 405, headers: noStore },
      );
    }

    const csrfResponse = protectWorkspaceMutation(request);
    if (csrfResponse) return csrfResponse;

    return Response.json(
      {
        error: {
          code: "DEVICE_LOCAL_SIGNUP_REQUIRED",
          message: "Workspace signup is stored on this device.",
        },
      },
      { status: 410, headers: noStore },
    );
  }

  if (isDeviceAuthEndpoint) {
    return handleWorkspaceDeviceAuthRequest(request, {
      manager: services.deviceAuth,
      cookie: services.cookie,
      allowedOrigins: [readOrigin().origin],
    });
  }

  return handle(services.authServer);
};
