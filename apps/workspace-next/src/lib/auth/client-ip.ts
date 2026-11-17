import { getEnvironmentVariable } from "./environment";

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
 * TRUSTED_CLIENT_IP_HEADER to a header your host always overwrites.
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
    throw new Error(`The trusted ${header} header is missing.`);
  }

  return ip;
};
