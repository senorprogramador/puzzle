import { AuthConfigurationError } from "../errors/auth.errors";

import type {
  AuthSecretProtector,
  ProtectedAuthSecret,
} from "./mfa-provider.types";

export type WebCryptoAuthSecretProtectorOptions = {
  readonly currentKeyId: string;
  readonly keys: Readonly<Record<string, Uint8Array>>;
};

const BASE64URL_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

const ADDITIONAL_DATA_PREFIX = "puzzle-auth:totp:v1:";

const getCrypto = (): Crypto => {
  const cryptoApi = globalThis.crypto;

  if (!cryptoApi?.getRandomValues || !cryptoApi.subtle) {
    throw new AuthConfigurationError(
      "This runtime does not provide the required Web Crypto APIs.",
    );
  }

  return cryptoApi;
};

const encodeBase64Url = (bytes: Uint8Array): string => {
  let result = "";
  let index = 0;

  while (index + 2 < bytes.length) {
    const first = bytes[index++]!;
    const second = bytes[index++]!;
    const third = bytes[index++]!;

    result += BASE64URL_ALPHABET[first >> 2];
    result += BASE64URL_ALPHABET[((first & 3) << 4) | (second >> 4)];
    result += BASE64URL_ALPHABET[((second & 15) << 2) | (third >> 6)];
    result += BASE64URL_ALPHABET[third & 63];
  }

  if (index < bytes.length) {
    const first = bytes[index++]!;

    result += BASE64URL_ALPHABET[first >> 2];

    if (index < bytes.length) {
      const second = bytes[index]!;

      result += BASE64URL_ALPHABET[((first & 3) << 4) | (second >> 4)];
      result += BASE64URL_ALPHABET[(second & 15) << 2];
    } else {
      result += BASE64URL_ALPHABET[(first & 3) << 4];
    }
  }

  return result;
};

const decodeBase64Url = (value: string): Uint8Array => {
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    !/^[A-Za-z0-9_-]+$/.test(value) ||
    value.length % 4 === 1
  ) {
    throw new AuthConfigurationError(
      "The encrypted authentication secret is malformed.",
    );
  }

  const bytes: number[] = [];
  let buffer = 0;
  let bits = 0;

  for (const character of value) {
    const decoded = BASE64URL_ALPHABET.indexOf(character);

    if (decoded < 0) {
      throw new AuthConfigurationError(
        "The encrypted authentication secret is malformed.",
      );
    }

    buffer = (buffer << 6) | decoded;
    bits += 6;

    if (bits >= 8) {
      bits -= 8;
      bytes.push((buffer >>> bits) & 255);
    }
  }

  return new Uint8Array(bytes);
};

const toArrayBuffer = (bytes: Uint8Array): ArrayBuffer =>
  bytes.slice().buffer as ArrayBuffer;

export class WebCryptoAuthSecretProtector implements AuthSecretProtector {
  private readonly currentKeyId: string;
  private readonly keys: Readonly<Record<string, Uint8Array>>;

  private readonly importedKeys = new Map<string, Promise<CryptoKey>>();

  constructor(options: WebCryptoAuthSecretProtectorOptions) {
    if (
      typeof options.currentKeyId !== "string" ||
      !/^[A-Za-z0-9_-]{1,64}$/.test(options.currentKeyId)
    ) {
      throw new AuthConfigurationError(
        "A valid authentication encryption key ID is required.",
      );
    }

    const keys: Record<string, Uint8Array> = {};

    for (const [keyId, key] of Object.entries(options.keys)) {
      if (
        !/^[A-Za-z0-9_-]{1,64}$/.test(keyId) ||
        !(key instanceof Uint8Array) ||
        key.byteLength !== 32
      ) {
        throw new AuthConfigurationError(
          "Authentication encryption keys must be 32-byte Uint8Array values with valid IDs.",
        );
      }

      keys[keyId] = key.slice();
    }

    if (!keys[options.currentKeyId]) {
      throw new AuthConfigurationError(
        "The current authentication encryption key is not configured.",
      );
    }

    this.currentKeyId = options.currentKeyId;
    this.keys = keys;
  }

  private getKey(keyId: string): Promise<CryptoKey> {
    const existing = this.importedKeys.get(keyId);

    if (existing) return existing;

    const rawKey = this.keys[keyId];

    if (!rawKey) {
      throw new AuthConfigurationError(
        `Authentication encryption key "${keyId}" is unavailable.`,
      );
    }

    const imported = getCrypto().subtle.importKey(
      "raw",
      toArrayBuffer(rawKey),
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"],
    );

    this.importedKeys.set(keyId, imported);

    return imported;
  }

  async encrypt(plaintext: string): Promise<ProtectedAuthSecret> {
    if (typeof plaintext !== "string" || plaintext.length === 0) {
      throw new AuthConfigurationError(
        "A non-empty authentication secret is required.",
      );
    }

    const cryptoApi = getCrypto();
    const iv = new Uint8Array(12);

    cryptoApi.getRandomValues(iv);

    try {
      const key = await this.getKey(this.currentKeyId);

      const encrypted = await cryptoApi.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: toArrayBuffer(iv),
          additionalData: toArrayBuffer(
            new TextEncoder().encode(
              `${ADDITIONAL_DATA_PREFIX}${this.currentKeyId}`,
            ),
          ),
          tagLength: 128,
        },
        key,
        toArrayBuffer(new TextEncoder().encode(plaintext)),
      );

      return {
        ciphertext: encodeBase64Url(new Uint8Array(encrypted)),
        iv: encodeBase64Url(iv),
        keyId: this.currentKeyId,
      };
    } catch (error) {
      throw new AuthConfigurationError(
        "Could not encrypt the authentication secret.",
        { cause: error },
      );
    }
  }

  async decrypt(secret: ProtectedAuthSecret): Promise<string> {
    if (
      !secret ||
      typeof secret.keyId !== "string" ||
      typeof secret.ciphertext !== "string" ||
      typeof secret.iv !== "string"
    ) {
      throw new AuthConfigurationError(
        "The encrypted authentication secret is incomplete.",
      );
    }

    const iv = decodeBase64Url(secret.iv);
    const ciphertext = decodeBase64Url(secret.ciphertext);

    if (iv.byteLength !== 12 || ciphertext.byteLength < 16) {
      throw new AuthConfigurationError(
        "The encrypted authentication secret is malformed.",
      );
    }

    try {
      const key = await this.getKey(secret.keyId);

      const plaintext = await getCrypto().subtle.decrypt(
        {
          name: "AES-GCM",
          iv: toArrayBuffer(iv),
          additionalData: toArrayBuffer(
            new TextEncoder().encode(
              `${ADDITIONAL_DATA_PREFIX}${secret.keyId}`,
            ),
          ),
          tagLength: 128,
        },
        key,
        toArrayBuffer(ciphertext),
      );

      return new TextDecoder("utf-8", { fatal: true }).decode(plaintext);
    } catch (error) {
      throw new AuthConfigurationError(
        "Could not decrypt the authentication secret.",
        { cause: error },
      );
    }
  }
}
