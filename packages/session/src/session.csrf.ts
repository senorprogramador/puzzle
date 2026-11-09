import { SessionSecurityError } from "./errors/session.errors";

export type CsrfOptions = {
  readonly allowedOrigins: readonly string[];
  readonly allowMissingOrigin?: boolean;
};

const normalizeOrigin = (value: string): string => {
  const url = new URL(value);

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new SessionSecurityError("Unsupported request origin.");
  }

  return url.origin;
};

export const validateRequestOrigin = (
  request: Request,
  options: CsrfOptions,
): void => {
  const origin = request.headers.get("origin");

  if (!origin) {
    if (options.allowMissingOrigin === true) return;

    throw new SessionSecurityError(
      "Origin header is required for this request.",
    );
  }

  let normalizedOrigin: string;

  try {
    normalizedOrigin = normalizeOrigin(origin);
  } catch {
    throw new SessionSecurityError("Invalid request origin.");
  }

  const allowed = options.allowedOrigins.some((candidate) => {
    try {
      return normalizeOrigin(candidate) === normalizedOrigin;
    } catch {
      return false;
    }
  });

  if (!allowed) {
    throw new SessionSecurityError("Request origin is not allowed.");
  }
};

export const protectStateChangingRequest = (
  request: Request,
  options: CsrfOptions,
): void => {
  const method = request.method.toUpperCase();

  if (["GET", "HEAD", "OPTIONS"].includes(method)) return;

  validateRequestOrigin(request, options);

  const fetchSite = request.headers.get("sec-fetch-site");

  if (fetchSite === "cross-site") {
    throw new SessionSecurityError(
      "Cross-site state-changing requests are not allowed.",
    );
  }
};
