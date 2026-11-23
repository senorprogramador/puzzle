import type {
  ResourceDescriptor,
  ResourcePriority,
} from "@puzzle-ui/core/rendering";

const resourceTypes = ["image", "script", "stylesheet", "font"] as const;
const resourcePriorities = ["critical", "high", "normal", "low"] as const;

const isResourceType = (
  value: unknown,
): value is ResourceDescriptor["type"] =>
  resourceTypes.some((type) => type === value);

const isResourcePriority = (value: unknown): value is ResourcePriority =>
  resourcePriorities.some((priority) => priority === value);

export function assertResourceDescriptor(
  value: unknown,
  label: string,
): asserts value is ResourceDescriptor {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    throw new TypeError(`${label} must be an object.`);
  }

  if (
    !("url" in value) ||
    typeof value.url !== "string" ||
    value.url.trim() === ""
  ) {
    throw new TypeError(`${label} must have a non-empty URL.`);
  }

  if (!("type" in value) || !isResourceType(value.type)) {
    throw new TypeError(`${label} has an unsupported type.`);
  }

  if (!("priority" in value) || !isResourcePriority(value.priority)) {
    throw new TypeError(`${label} has an unsupported priority.`);
  }

  if (
    value.type === "stylesheet" &&
    "media" in value &&
    value.media !== undefined &&
    typeof value.media !== "string"
  ) {
    throw new TypeError(`${label} has invalid media.`);
  }

  if (
    value.type === "script" &&
    "async" in value &&
    value.async !== undefined &&
    typeof value.async !== "boolean"
  ) {
    throw new TypeError(`${label} has invalid async state.`);
  }

  if (
    value.type === "font" &&
    "family" in value &&
    value.family !== undefined &&
    typeof value.family !== "string"
  ) {
    throw new TypeError(`${label} has invalid family.`);
  }
}

export function assertResourceDescriptorList(
  value: unknown,
  label: string,
): asserts value is readonly ResourceDescriptor[] {
  if (!Array.isArray(value)) {
    throw new TypeError(`${label} must be an array.`);
  }

  value.forEach((resource, index) => {
    assertResourceDescriptor(resource, `${label}[${index}]`);
  });
}
