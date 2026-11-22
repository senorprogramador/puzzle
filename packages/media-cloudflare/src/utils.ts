import {
  MediaValidationError,
  normalizeMediaChecksum,
  normalizeMediaObjectReference,
} from "@puzzle-ui/media";
import type {
  MediaChecksum,
  MediaObjectReference,
  MediaUploadConstraints,
} from "@puzzle-ui/media";
import { CloudflareMediaValidationError } from "./errors";

export const validateTenantId = (tenantId: string): string => {
  if (typeof tenantId !== "string" || tenantId.trim() === "") {
    throw new MediaValidationError("tenantId must be a non-empty string.");
  }
  if (tenantId.length > 200 || /[\u0000-\u001f\u007f]/.test(tenantId)) {
    throw new MediaValidationError("tenantId contains unsupported characters.");
  }
  return tenantId;
};

export const validateUploadConstraints = (
  input: MediaUploadConstraints,
): MediaUploadConstraints => {
  validateTenantId(input.tenantId);
  if (typeof input.fileName !== "string" || input.fileName.trim() === "") {
    throw new MediaValidationError("fileName must be a non-empty string.");
  }
  if (input.fileName.length > 512 || /[\u0000-\u001f\u007f]/.test(input.fileName)) {
    throw new MediaValidationError("fileName contains unsupported characters.");
  }
  if (
    typeof input.contentType !== "string" ||
    !/^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+$/i.test(input.contentType)
  ) {
    throw new MediaValidationError("contentType must be a valid MIME type.");
  }
  if (
    input.expectedSize !== undefined &&
    (!Number.isSafeInteger(input.expectedSize) || input.expectedSize < 1)
  ) {
    throw new MediaValidationError("expectedSize must be a positive safe integer.");
  }
  validatePositiveInteger(input.expiresInMs, "expiresInMs");
  if (input.objectPrefix !== undefined) {
    if (
      input.objectPrefix.trim() === "" ||
      input.objectPrefix.startsWith("/") ||
      input.objectPrefix.includes("\\") ||
      input.objectPrefix.split("/").some((segment) => segment === "." || segment === "..") ||
      /[\u0000-\u001f\u007f]/.test(input.objectPrefix)
    ) {
      throw new MediaValidationError("objectPrefix must be a safe relative prefix.");
    }
  }
  const expectedChecksum = input.expectedChecksum
    ? normalizeMediaChecksum(input.expectedChecksum)
    : undefined;
  return {
    ...input,
    tenantId: input.tenantId.trim(),
    contentType: input.contentType.toLowerCase(),
    ...(expectedChecksum ? { expectedChecksum } : {}),
  };
};

export const validatePositiveInteger = (value: number, name: string): void => {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new MediaValidationError(`${name} must be a positive safe integer.`);
  }
};

export const validateExpiry = (
  value: number,
  name: string,
  max: number,
): void => {
  validatePositiveInteger(value, name);
  if (value > max) {
    throw new MediaValidationError(`${name} exceeds the configured limit.`);
  }
};

export const createTenantObjectKey = (
  tenantId: string,
  uploadId: string,
  fileName: string,
  prefix?: string,
): string => {
  const safeName = fileName.replace(/[^\w.\-]+/g, "_").replace(/^\.*/, "") || "file";
  const safePrefix = prefix ? `${prefix.replace(/\/+$/g, "")}/` : "";
  return `${safePrefix}tenants/${encodeURIComponent(tenantId)}/${uploadId}/${safeName}`;
};

export const normalizeReference = (object: MediaObjectReference): MediaObjectReference =>
  normalizeMediaObjectReference(object);

export const sha256 = async (bytes: Uint8Array): Promise<MediaChecksum> => {
  if (!globalThis.crypto?.subtle) {
    throw new CloudflareMediaValidationError("Web Crypto is required for checksum verification.");
  }
  const digest = await globalThis.crypto.subtle.digest(
    "SHA-256",
    new Uint8Array(bytes),
  );
  return {
    algorithm: "sha256",
    value: [...new Uint8Array(digest)]
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join(""),
  };
};

export const checksumEquals = (
  left: MediaChecksum,
  right: MediaChecksum,
): boolean => normalizeMediaChecksum(left).value === normalizeMediaChecksum(right).value;

export const cursorForObject = (key: string): string =>
  encodeURIComponent(key);
