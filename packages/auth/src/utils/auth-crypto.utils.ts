import { AuthConfigurationError } from "../errors/auth.errors";

const getCrypto = (): Crypto => {
  const cryptoApi = globalThis.crypto;

  if (!cryptoApi?.getRandomValues || !cryptoApi.subtle) {
    throw new AuthConfigurationError(
      "This runtime does not provide the required Web Crypto APIs.",
    );
  }

  return cryptoApi;
};

export const generateAuthId = (prefix: string): string => {
  const bytes = new Uint8Array(16);

  getCrypto().getRandomValues(bytes);

  const value = Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return `${prefix}_${value}`;
};

export const createRateLimitKey = async (
  secret: string,
  value: string,
): Promise<string> => {
  const cryptoApi = getCrypto();

  const key = await cryptoApi.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["sign"],
  );

  const signature = await cryptoApi.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value),
  );

  const bytes = new Uint8Array(signature);

  const hash = Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return `hmac-sha256:${hash}`;
};

export const generateSecureAuthToken = (): string => {
  const bytes = new Uint8Array(32);

  getCrypto().getRandomValues(bytes);

  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

export const hashAuthToken = async (token: string): Promise<string> => {
  if (typeof token !== "string" || token.length === 0) {
    throw new AuthConfigurationError("A valid token is required.");
  }

  const digest = await getCrypto().subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token),
  );

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};
