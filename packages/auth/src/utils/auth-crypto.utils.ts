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
