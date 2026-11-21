import { MediaValidationError } from "../errors/media.errors";
import type {
  MediaChecksum,
  MediaCrop,
  MediaFocalPoint,
  MediaFileMetadata,
  MediaHotspot,
  MediaKind,
  MediaObjectReference,
} from "../types/media.types";
import type {
  MediaImageProfile,
  MediaVideoRenditionProfile,
} from "../types/processing.types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isFinitePositive = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

const assertNormalizedCoordinate = (value: unknown, field: string): number => {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 1) {
    throw new MediaValidationError(`${field} must be a finite number from 0 to 1.`);
  }
  return value;
};

const validateProfileSize = (
  profile: { readonly maxWidth?: number; readonly maxHeight?: number },
  name: string,
): void => {
  if (profile.maxWidth === undefined && profile.maxHeight === undefined) {
    throw new MediaValidationError(
      `Profile "${name}" must define maxWidth, maxHeight, or both.`,
    );
  }
  for (const [key, value] of [
    ["maxWidth", profile.maxWidth],
    ["maxHeight", profile.maxHeight],
  ] as const) {
    if (value !== undefined && (!Number.isInteger(value) || value < 1)) {
      throw new MediaValidationError(
        `Profile "${name}" ${key} must be a positive integer.`,
      );
    }
  }
};

export const normalizeMediaChecksum = (input: unknown): MediaChecksum => {
  if (!isRecord(input) || input.algorithm !== "sha256" || typeof input.value !== "string") {
    throw new MediaValidationError("Checksum must be a sha256 digest.");
  }
  const value = input.value.toLowerCase();
  if (!/^[a-f0-9]{64}$/.test(value)) {
    throw new MediaValidationError("A sha256 checksum must contain 64 hexadecimal characters.");
  }
  return { algorithm: "sha256", value };
};

export const normalizeMediaObjectReference = (
  input: unknown,
): MediaObjectReference => {
  if (!isRecord(input) || typeof input.key !== "string" || input.key.trim() === "") {
    throw new MediaValidationError("A media object reference requires a non-empty key.");
  }
  if (/[\u0000-\u001f\u007f]/.test(input.key)) {
    throw new MediaValidationError("A media object key cannot contain control characters.");
  }
  if (
    input.versionId !== undefined &&
    (typeof input.versionId !== "string" ||
      input.versionId.trim() === "" ||
      /[\u0000-\u001f\u007f]/.test(input.versionId))
  ) {
    throw new MediaValidationError("Object versionId must be a non-empty safe string.");
  }
  return {
    key: input.key,
    ...(input.versionId !== undefined ? { versionId: input.versionId } : {}),
  };
};

export const normalizeMediaCrop = (input: unknown): MediaCrop => {
  if (!isRecord(input)) {
    throw new MediaValidationError("A crop must be an object.");
  }
  const x = assertNormalizedCoordinate(input.x, "crop.x");
  const y = assertNormalizedCoordinate(input.y, "crop.y");
  const width = assertNormalizedCoordinate(input.width, "crop.width");
  const height = assertNormalizedCoordinate(input.height, "crop.height");
  if (width <= 0 || height <= 0 || x + width > 1 || y + height > 1) {
    throw new MediaValidationError(
      "A crop must have positive dimensions and remain within the image bounds.",
    );
  }
  return { x, y, width, height };
};

export const normalizeMediaFocalPoint = (input: unknown): MediaFocalPoint => {
  if (!isRecord(input)) {
    throw new MediaValidationError(
      "A focal point must be an object with x and y coordinates.",
    );
  }
  return {
    x: assertNormalizedCoordinate(input.x, "focalPoint.x"),
    y: assertNormalizedCoordinate(input.y, "focalPoint.y"),
  };
};

export const normalizeMediaHotspots = (input: unknown): readonly MediaHotspot[] => {
  if (!Array.isArray(input)) {
    throw new MediaValidationError("Hotspots must be an array.");
  }
  const ids = new Set<string>();
  return input.map((item, index) => {
    if (!isRecord(item) || typeof item.id !== "string" || item.id.trim() === "") {
      throw new MediaValidationError(`Hotspot at index ${index} requires an id.`);
    }
    if (ids.has(item.id)) {
      throw new MediaValidationError(`Hotspot id "${item.id}" is duplicated.`);
    }
    ids.add(item.id);
    const x = assertNormalizedCoordinate(item.x, `hotspots[${index}].x`);
    const y = assertNormalizedCoordinate(item.y, `hotspots[${index}].y`);
    const width =
      item.width === undefined
        ? undefined
        : assertNormalizedCoordinate(item.width, `hotspots[${index}].width`);
    const height =
      item.height === undefined
        ? undefined
        : assertNormalizedCoordinate(item.height, `hotspots[${index}].height`);
    if ((width === undefined) !== (height === undefined)) {
      throw new MediaValidationError(
        `Hotspot "${item.id}" must define both width and height, or neither.`,
      );
    }
    if (
      width !== undefined &&
      height !== undefined &&
      ((width === 0) !== (height === 0) || x + width > 1 || y + height > 1)
    ) {
      throw new MediaValidationError(
        `Hotspot "${item.id}" must be a point or have positive dimensions within image bounds.`,
      );
    }
    if (item.label !== undefined && typeof item.label !== "string") {
      throw new MediaValidationError(`Hotspot "${item.id}" label must be a string.`);
    }
    if (item.data !== undefined) {
      if (!isRecord(item.data)) {
        throw new MediaValidationError(`Hotspot "${item.id}" data must be an object.`);
      }
      for (const value of Object.values(item.data)) {
        if (
          value !== null &&
          typeof value !== "string" &&
          typeof value !== "number" &&
          typeof value !== "boolean"
        ) {
          throw new MediaValidationError(
            `Hotspot "${item.id}" data must contain only JSON scalar values.`,
          );
        }
      }
    }
    return {
      id: item.id,
      x,
      y,
      ...(width !== undefined ? { width, height } : {}),
      ...(typeof item.label === "string" ? { label: item.label } : {}),
      ...(isRecord(item.data)
        ? {
            data: item.data as Readonly<
              Record<string, string | number | boolean | null>
            >,
          }
        : {}),
    };
  });
};

export const normalizeMediaTags = (input: unknown): readonly string[] => {
  if (!Array.isArray(input) || input.some((tag) => typeof tag !== "string")) {
    throw new MediaValidationError("Tags must be an array of strings.");
  }
  return [...new Set(input.map((tag: string) => tag.trim()).filter(Boolean))];
};

export const validateMediaFileMetadata = (
  input: unknown,
): MediaFileMetadata => {
  if (!isRecord(input)) {
    throw new MediaValidationError("Media metadata must be an object.");
  }
  const kinds: readonly MediaKind[] = [
    "image",
    "video",
    "audio",
    "document",
    "other",
  ];
  if (!kinds.includes(input.kind as MediaKind)) {
    throw new MediaValidationError("Media kind is not supported.");
  }
  if (
    typeof input.mimeType !== "string" ||
    !/^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+$/i.test(input.mimeType)
  ) {
    throw new MediaValidationError("Media mimeType must be a valid type/subtype.");
  }
  const kind = input.kind as MediaKind;
  if (
    (kind === "image" || kind === "video" || kind === "audio") &&
    !input.mimeType.toLowerCase().startsWith(`${kind}/`)
  ) {
    throw new MediaValidationError(
      `A ${kind} asset must have a ${kind}/* MIME type.`,
    );
  }
  if (!Number.isSafeInteger(input.size) || (input.size as number) < 1) {
    throw new MediaValidationError("Media size must be a positive safe integer.");
  }
  const dimensionsPresent = input.width !== undefined || input.height !== undefined;
  if (
    dimensionsPresent &&
    (!isFinitePositive(input.width) ||
      !isFinitePositive(input.height) ||
    !Number.isSafeInteger(input.width) ||
    !Number.isSafeInteger(input.height))
  ) {
    throw new MediaValidationError(
      "Media dimensions must include positive integer width and height values.",
    );
  }
  if (input.duration !== undefined && !isFinitePositive(input.duration) && input.duration !== 0) {
    throw new MediaValidationError("Media duration must be a finite non-negative number.");
  }
  if (
    input.orientation !== undefined &&
    (typeof input.orientation !== "number" ||
      !Number.isInteger(input.orientation) ||
      input.orientation < 1 ||
      input.orientation > 8)
  ) {
    throw new MediaValidationError("Image orientation must be an integer from 1 to 8.");
  }
  const checksum =
    input.checksum === undefined
      ? undefined
      : normalizeMediaChecksum(input.checksum);
  return {
    kind,
    mimeType: input.mimeType.toLowerCase(),
    size: input.size as number,
    ...(checksum ? { checksum } : {}),
    ...(dimensionsPresent
      ? { width: input.width as number, height: input.height as number }
      : {}),
    ...(input.duration !== undefined ? { duration: input.duration as number } : {}),
    ...(input.orientation !== undefined
      ? { orientation: input.orientation as number }
      : {}),
  };
};

export const validateMediaImageProfiles = (
  profiles: readonly MediaImageProfile[],
): readonly MediaImageProfile[] => {
  if (profiles.length === 0) {
    throw new MediaValidationError("At least one image processing profile is required.");
  }
  const names = new Set<string>();
  for (const profile of profiles) {
    if (profile.name.trim() === "" || names.has(profile.name)) {
      throw new MediaValidationError(
        "Image profile names must be non-empty and unique.",
      );
    }
    names.add(profile.name);
    validateProfileSize(profile, profile.name);
    if (
      profile.quality !== undefined &&
      (!Number.isFinite(profile.quality) ||
        profile.quality < 0 ||
        profile.quality > 1)
    ) {
      throw new MediaValidationError(
        `Image profile "${profile.name}" quality must be from 0 to 1.`,
      );
    }
  }
  return profiles;
};

export const validateMediaVideoProfiles = (
  profiles: readonly MediaVideoRenditionProfile[],
): readonly MediaVideoRenditionProfile[] => {
  if (profiles.length === 0) {
    throw new MediaValidationError("At least one video rendition profile is required.");
  }
  const names = new Set<string>();
  for (const profile of profiles) {
    if (profile.name.trim() === "" || names.has(profile.name)) {
      throw new MediaValidationError(
        "Video profile names must be non-empty and unique.",
      );
    }
    names.add(profile.name);
    validateProfileSize(profile, profile.name);
    for (const [key, value] of [
      ["videoBitrate", profile.videoBitrate],
      ["audioBitrate", profile.audioBitrate],
    ] as const) {
      if (value !== undefined && (!Number.isInteger(value) || value < 1)) {
        throw new MediaValidationError(
          `Video profile "${profile.name}" ${key} must be a positive integer.`,
        );
      }
    }
  }
  return profiles;
};
