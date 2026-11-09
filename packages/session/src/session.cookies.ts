import type { SessionCookieOptions } from "./types/session.types";

import { SessionConfigurationError } from "./errors/session.errors";

export type SessionCookieEnvironment = {
  readonly production: boolean;
  readonly name?: string;
  readonly sameSite?: "lax" | "strict" | "none";
};

export const createSessionCookieOptions = (
  environment: SessionCookieEnvironment,
): SessionCookieOptions => {
  const name = environment.name ?? "__Host-puzzle.session";
  const secure = environment.production;
  const sameSite = environment.sameSite ?? "lax";

  if (name.startsWith("__Host-") && !secure) {
    throw new SessionConfigurationError("__Host- cookies require Secure.");
  }

  if (sameSite === "none" && !secure) {
    throw new SessionConfigurationError(
      "SameSite=None cookies require Secure.",
    );
  }

  return {
    name,
    path: "/",
    httpOnly: true,
    secure,
    sameSite,
  };
};

const serializeCookieValue = (value: string): string =>
  encodeURIComponent(value);

export const serializeSessionCookie = (
  token: string,
  options: SessionCookieOptions,
  maxAge: number,
): string => {
  if (!token) {
    throw new SessionConfigurationError("A session token is required.");
  }

  if (!Number.isInteger(maxAge) || maxAge <= 0) {
    throw new SessionConfigurationError(
      "Cookie max-age must be a positive integer.",
    );
  }

  const name = options.name ?? "__Host-puzzle.session";

  if (name.startsWith("__Host-") && (!options.secure || options.path !== "/")) {
    throw new SessionConfigurationError(
      "__Host- cookies require Secure and Path=/.",
    );
  }

  const attributes = [
    `${name}=${serializeCookieValue(token)}`,
    "Path=/",
    "HttpOnly",
    `SameSite=${options.sameSite}`,
    `Max-Age=${maxAge}`,
  ];

  if (options.secure) attributes.push("Secure");

  return attributes.join("; ");
};

export const serializeClearedSessionCookie = (
  options: SessionCookieOptions,
): string => {
  const name = options.name ?? "__Host-puzzle.session";

  const attributes = [
    `${name}=`,
    "Path=/",
    "HttpOnly",
    `SameSite=${options.sameSite}`,
    "Max-Age=0",
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
  ];

  if (options.secure) attributes.push("Secure");

  return attributes.join("; ");
};

export const readSessionCookie = (
  cookieHeader: string | null,
  cookieName = "__Host-puzzle.session",
): string | null => {
  if (!cookieHeader) return null;

  for (const part of cookieHeader.split(";")) {
    const separator = part.indexOf("=");

    if (separator < 0) continue;

    const name = part.slice(0, separator).trim();

    if (name !== cookieName) continue;

    try {
      return decodeURIComponent(part.slice(separator + 1).trim());
    } catch {
      return null;
    }
  }

  return null;
};
