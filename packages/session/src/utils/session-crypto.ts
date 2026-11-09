import { SessionSecurityError } from "../errors/session.errors";

const TOKEN_BYTES = 32;

const toBase64Url = (bytes: Uint8Array): string => {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");
};

export const generateSessionToken = (
  cryptoProvider: Crypto = globalThis.crypto,
): string => {
  if (!cryptoProvider?.getRandomValues) {
    throw new SessionSecurityError(
      "A cryptographically secure random generator is required.",
    );
  }

  const bytes = new Uint8Array(TOKEN_BYTES);

  cryptoProvider.getRandomValues(bytes);

  return toBase64Url(bytes);
};

export const hashSessionToken = async (
  token: string,
  cryptoProvider: Crypto = globalThis.crypto,
): Promise<string> => {
  if (!token || token.length < 32) {
    throw new SessionSecurityError("Invalid session token.");
  }

  if (!cryptoProvider?.subtle) {
    throw new SessionSecurityError("Web Crypto SubtleCrypto is required.");
  }

  const digest = await cryptoProvider.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token),
  );

  return toBase64Url(new Uint8Array(digest));
};

export const generateSessionId = (
  cryptoProvider: Crypto = globalThis.crypto,
): string => {
  if (!cryptoProvider?.randomUUID) {
    throw new SessionSecurityError(
      "A cryptographically secure UUID generator is required.",
    );
  }

  return cryptoProvider.randomUUID();
};
