import type {
  NormalizedZodDescriptor,
  NormalizedZodPathSegment,
} from "./schema";

const getValueAtPath = (value: unknown, path: readonly NormalizedZodPathSegment[]) => {
  let current = value;

  for (const segment of path) {
    if (
      current === null ||
      typeof current !== "object" ||
      !Object.hasOwn(current, segment)
    ) {
      return undefined;
    }

    current = Reflect.get(current, segment);
  }

  return current;
};

const setValueAtPath = (
  value: unknown,
  path: readonly NormalizedZodPathSegment[],
  nextValue: unknown,
): unknown => {
  if (path.length === 0) {
    return nextValue;
  }

  const update = (
    current: unknown,
    depth: number,
  ): Record<PropertyKey, unknown> | unknown[] => {
    const segment = path[depth]!;
    const nextSegment = path[depth + 1];
    const isArray = Array.isArray(current) || typeof segment === "number";
    const clone: Record<PropertyKey, unknown> | unknown[] = isArray
      ? Array.isArray(current)
        ? current.slice()
        : []
      : current !== null && typeof current === "object"
        ? { ...current }
        : {};

    const child =
      current !== null &&
      typeof current === "object" &&
      Object.hasOwn(current, segment)
        ? Reflect.get(current, segment)
        : undefined;
    const updated =
      depth === path.length - 1
        ? nextValue
        : update(
            child ??
              (typeof nextSegment === "number" ? [] : {}),
            depth + 1,
          );

    Object.defineProperty(clone, segment, {
      configurable: true,
      enumerable: true,
      value: updated,
      writable: true,
    });

    return clone;
  };

  return update(value, 0);
};

const toHumanLabel = (name: string) => {
  const words = name
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return words
    .map((word, index) =>
      index === 0
        ? `${word[0]?.toLocaleUpperCase()}${word.slice(1)}`
        : word.toLocaleLowerCase(),
    )
    .join(" ");
};

const createEmptyValue = (descriptor: NormalizedZodDescriptor): unknown => {
  if (descriptor.optional || descriptor.defaulted) {
    return undefined;
  }

  switch (descriptor.type) {
    case "string":
    case "email":
    case "url":
      return "";
    case "boolean":
      return false;
    case "enum":
    case "literal":
      return descriptor.options[0]?.value;
    case "object":
      return Object.fromEntries(
        descriptor.properties
          .filter((property) => !property.optional && !property.defaulted)
          .map((property) => [
            property.name ?? "",
            createEmptyValue(property),
          ]),
      );
    case "array":
      return [];
    case "number":
    case "date":
    case "unsupported":
      return undefined;
    default:
      return undefined;
  }
};

const resolveRelativePath = (
  descriptorPath: readonly NormalizedZodPathSegment[],
  actualPath: readonly NormalizedZodPathSegment[],
  childPath: readonly NormalizedZodPathSegment[],
) => [...actualPath, ...childPath.slice(descriptorPath.length)];

const getDescriptorAtPath = (
  root: NormalizedZodDescriptor,
  path: readonly NormalizedZodPathSegment[],
): NormalizedZodDescriptor | undefined => {
  let current: NormalizedZodDescriptor = root;
  let descriptorPath = root.path;

  for (const segment of path.slice(root.path.length)) {
    const nextPath = [...descriptorPath, segment];

    if (current.type === "object" && typeof segment === "string") {
      const property = current.properties.find(
        (candidate) =>
          candidate.path.length === nextPath.length &&
          candidate.path.every((part, index) => part === nextPath[index]),
      );

      if (!property) {
        return undefined;
      }

      current = property;
    } else if (current.type === "array" && typeof segment === "number") {
      current = current.element;
    } else {
      return undefined;
    }

    descriptorPath = current.path;
  }

  return current;
};

export {
  createEmptyValue,
  getDescriptorAtPath,
  getValueAtPath,
  resolveRelativePath,
  setValueAtPath,
  toHumanLabel,
};
