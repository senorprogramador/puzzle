import { StorageValidationError } from "../errors/storage.errors";

const formatUuid = (bytes: Uint8Array): string => {
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;

  const hex = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

const generateUuid = (): string => {
  const cryptoProvider = globalThis.crypto;

  if (!cryptoProvider) {
    throw new Error(
      "A cryptographically secure Web Crypto implementation is required to generate Storage IDs.",
    );
  }

  if (typeof cryptoProvider.randomUUID === "function") {
    const id = cryptoProvider.randomUUID();
    if (id.length === 0) {
      throw new Error("Web Crypto returned an empty Storage ID.");
    }
    return id;
  }

  return formatUuid(cryptoProvider.getRandomValues(new Uint8Array(16)));
};

export const resolveStorageId = (id?: string): string => {
  if (id === undefined) return generateUuid();

  if (typeof id !== "string" || id.length === 0) {
    throw new StorageValidationError(
      "Storage record IDs must be non-empty strings.",
    );
  }

  return id;
};
