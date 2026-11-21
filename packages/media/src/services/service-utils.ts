import type {
  StorageAdapter,
  StorageCapability,
  StorageCondition,
} from "@puzzle-ui/storage";
import { MediaCapabilityError, MediaValidationError } from "../errors/media.errors";

export type MediaServiceRuntime = {
  readonly idFactory?: () => string;
  readonly now?: () => Date;
};

export const createMediaId = (
  idFactory?: () => string,
  prefix = "media",
): string => {
  if (idFactory) {
    const id = idFactory();
    if (typeof id !== "string" || id.trim() === "") {
      throw new MediaValidationError("The configured ID factory returned an invalid ID.");
    }
    return id;
  }
  const randomUUID = globalThis.crypto?.randomUUID;
  if (typeof randomUUID !== "function") {
    throw new MediaCapabilityError("crypto.randomUUID");
  }
  return `${prefix}_${randomUUID.call(globalThis.crypto)}`;
};

export const getMediaNow = (now?: () => Date): Date => {
  const value = now?.() ?? new Date();
  if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
    throw new MediaValidationError("The configured clock returned an invalid date.");
  }
  return value;
};

export const assertTenantId = (tenantId: string): void => {
  if (typeof tenantId !== "string" || tenantId.trim() === "") {
    throw new MediaValidationError("tenantId must be a non-empty string.");
  }
};

export const assertConditionalWrites = (storage: StorageAdapter): void => {
  assertStorageCapability(storage, "conditionalWrites");
};

export const assertStorageCapability = (
  storage: StorageAdapter,
  capability: StorageCapability,
): void => {
  if (!storage.getCapabilities().capabilities[capability]) {
    throw new MediaCapabilityError(capability);
  }
};

export const makeStorageCondition = (
  expectedRevision: number,
): StorageCondition => {
  if (!Number.isInteger(expectedRevision) || expectedRevision < 1) {
    throw new MediaValidationError("expectedRevision must be a positive integer.");
  }
  return { expectedRevision };
};

export const normalizeDisplayName = (value: string): string => {
  if (typeof value !== "string") {
    throw new MediaValidationError("A media name must be a string.");
  }
  const name = value.replace(/[\u0000-\u001f\u007f]/g, "").trim();
  if (name.length === 0 || name.length > 255) {
    throw new MediaValidationError(
      "A media name must contain 1 to 255 printable characters.",
    );
  }
  return name;
};

export const normalizeOriginalName = (value: string): string => {
  if (typeof value !== "string") {
    throw new MediaValidationError("originalName must be a string.");
  }
  const basename = value.split(/[\\/]/).at(-1) ?? "";
  const name = basename.replace(/[\u0000-\u001f\u007f]/g, "").trim();
  if (name.length === 0 || name.length > 1024) {
    throw new MediaValidationError("originalName must be a non-empty file name.");
  }
  return name;
};
