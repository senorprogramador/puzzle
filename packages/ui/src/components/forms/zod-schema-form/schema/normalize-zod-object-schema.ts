import {
  ZodArray,
  ZodBoolean,
  ZodCatch,
  ZodDate,
  ZodDefault,
  ZodEmail,
  ZodEnum,
  ZodExactOptional,
  ZodLazy,
  ZodLiteral,
  ZodNullable,
  ZodNumber,
  ZodObject,
  ZodOptional,
  ZodPipe,
  ZodPrefault,
  ZodReadonly,
  ZodString,
  ZodType,
  ZodURL,
} from "zod/v4";

import type {
  NormalizedZodConstraints,
  NormalizedZodDescriptor,
  NormalizedZodDiagnostic,
  NormalizedZodMetadataValue,
  NormalizedZodObjectSchema,
  NormalizedZodOption,
  NormalizedZodOptionValue,
  NormalizedZodPathSegment,
} from "./schema.types";

type Metadata = Readonly<Record<string, NormalizedZodMetadataValue>>;
type SchemaNode = object;

interface WrapperState {
  readonly optional: boolean;
  readonly nullable: boolean;
  readonly defaulted: boolean;
  readonly readOnly: boolean;
  readonly metadataLayers: readonly Metadata[];
}

interface NormalizationContext {
  readonly activeSchemas: WeakSet<SchemaNode>;
  readonly diagnostics: NormalizedZodDiagnostic[];
}

const EMPTY_CONSTRAINTS: NormalizedZodConstraints = Object.freeze({});

const emptyPath = (): readonly NormalizedZodPathSegment[] => Object.freeze([]);

const appendPath = (
  path: readonly NormalizedZodPathSegment[],
  segment: NormalizedZodPathSegment,
): readonly NormalizedZodPathSegment[] => Object.freeze([...path, segment]);

const emptyWrapperState = (): WrapperState => ({
  optional: false,
  nullable: false,
  defaulted: false,
  readOnly: false,
  metadataLayers: [],
});

const cloneMetadataValue = (
  value: unknown,
  seen: WeakSet<object>,
  depth = 0,
): NormalizedZodMetadataValue | undefined => {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value !== "object" || depth >= 20 || seen.has(value)) {
    return undefined;
  }

  seen.add(value);

  try {
    if (Array.isArray(value)) {
      const entries: NormalizedZodMetadataValue[] = [];

      for (const entry of value) {
        const normalized = cloneMetadataValue(entry, seen, depth + 1);
        if (normalized !== undefined) entries.push(normalized);
      }

      return Object.freeze(entries);
    }

    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) return undefined;

    const source = value as Readonly<Record<string, unknown>>;
    const normalized: Record<string, NormalizedZodMetadataValue> =
      Object.create(null);

    for (const key of Object.keys(source)) {
      const entry = cloneMetadataValue(source[key], seen, depth + 1);
      if (entry === undefined) continue;

      Object.defineProperty(normalized, key, {
        configurable: false,
        enumerable: true,
        value: entry,
        writable: false,
      });
    }

    return Object.freeze(normalized);
  } catch {
    return undefined;
  } finally {
    seen.delete(value);
  }
};

const readMetadata = (schema: SchemaNode): Metadata => {
  if (!(schema instanceof ZodType)) return Object.freeze({});

  try {
    const metadata = cloneMetadataValue(schema.meta(), new WeakSet());
    if (
      metadata === undefined ||
      metadata === null ||
      Array.isArray(metadata)
    ) {
      return Object.freeze({});
    }

    return metadata as Metadata;
  } catch {
    return Object.freeze({});
  }
};

const mergeMetadata = (layers: readonly Metadata[]): Metadata => {
  const merged: Record<string, NormalizedZodMetadataValue> =
    Object.create(null);

  for (let index = 0; index < layers.length; index += 1) {
    const layer = layers[index];
    if (layer === undefined) continue;

    for (const [key, value] of Object.entries(layer)) {
      if (Object.hasOwn(merged, key)) continue;

      Object.defineProperty(merged, key, {
        configurable: false,
        enumerable: true,
        value,
        writable: false,
      });
    }
  }

  return Object.freeze(merged);
};

const getMetadataString = (
  metadata: Metadata,
  key: string,
): string | undefined => {
  const value = metadata[key];
  return typeof value === "string" ? value : undefined;
};

const getSchemaDescription = (schema: SchemaNode): string | undefined => {
  if (!(schema instanceof ZodType)) return undefined;
  return typeof schema.description === "string"
    ? schema.description
    : undefined;
};

const makeBase = (
  schema: SchemaNode,
  path: readonly NormalizedZodPathSegment[],
  state: WrapperState,
) => {
  const metadata = mergeMetadata(state.metadataLayers);
  const finalPathSegment = path.at(-1);
  const title = getMetadataString(metadata, "title");
  const name =
    typeof finalPathSegment === "string" ? finalPathSegment : undefined;
  const label =
    getMetadataString(metadata, "label") ??
    title ??
    (name === undefined ? undefined : name);
  const description =
    getMetadataString(metadata, "description") ?? getSchemaDescription(schema);

  return {
    path,
    ...(name === undefined ? {} : { name }),
    ...(label === undefined ? {} : { label }),
    ...(description === undefined ? {} : { description }),
    optional: state.optional,
    nullable: state.nullable,
    defaulted: state.defaulted,
    readOnly: state.readOnly || metadata.readOnly === true,
    metadata,
    constraints: EMPTY_CONSTRAINTS,
  } as const;
};

const withLayer = (
  state: WrapperState,
  schema: SchemaNode,
  changes: Partial<Omit<WrapperState, "metadataLayers">> = {},
): WrapperState => ({
  ...state,
  ...changes,
  metadataLayers: [...state.metadataLayers, readMetadata(schema)],
});

const makeDiagnostic = (
  code: NormalizedZodDiagnostic["code"],
  severity: NormalizedZodDiagnostic["severity"],
  path: readonly NormalizedZodPathSegment[],
  message: string,
  sourceType?: string,
): NormalizedZodDiagnostic =>
  Object.freeze({
    code,
    severity,
    path,
    message,
    ...(sourceType === undefined ? {} : { sourceType }),
  });

const makeUnsupported = (
  schema: SchemaNode,
  path: readonly NormalizedZodPathSegment[],
  state: WrapperState,
  context: NormalizationContext,
  reason: "recursive_schema" | "unsupported_schema",
  message: string,
): NormalizedZodDescriptor => {
  const sourceType = schema instanceof ZodType ? schema.type : "unknown";
  context.diagnostics.push(
    makeDiagnostic(reason, "warning", path, message, sourceType),
  );

  return Object.freeze({
    ...makeBase(schema, path, state),
    type: "unsupported",
    sourceType,
    reason,
  });
};

const finiteConstraint = (value: number | null): number | undefined =>
  value !== null && Number.isFinite(value) ? value : undefined;

const finiteLengthConstraint = (value: number | null): number | undefined =>
  value !== null && Number.isFinite(value) && value >= 0 ? value : undefined;

const dateConstraint = (value: Date | null): string | undefined => {
  if (value === null || Number.isNaN(value.getTime())) return undefined;
  return value.toISOString();
};

const numberConstraints = (schema: ZodNumber): NormalizedZodConstraints => {
  const minValue = finiteConstraint(schema.minValue);
  const maxValue = finiteConstraint(schema.maxValue);

  return Object.freeze({
    ...(minValue === undefined ? {} : { minValue }),
    ...(maxValue === undefined ? {} : { maxValue }),
    ...(schema.isInt ? { integer: true } : {}),
  });
};

const stringConstraints = (schema: {
  readonly minLength: number | null;
  readonly maxLength: number | null;
}): NormalizedZodConstraints => {
  const minLength = finiteLengthConstraint(schema.minLength);
  const maxLength = finiteLengthConstraint(schema.maxLength);

  return Object.freeze({
    ...(minLength === undefined ? {} : { minLength }),
    ...(maxLength === undefined ? {} : { maxLength }),
  });
};

const dateConstraints = (schema: ZodDate): NormalizedZodConstraints => {
  const minDate = dateConstraint(schema.minDate);
  const maxDate = dateConstraint(schema.maxDate);

  return Object.freeze({
    ...(minDate === undefined ? {} : { minDate }),
    ...(maxDate === undefined ? {} : { maxDate }),
  });
};

const optionLabel = (value: NormalizedZodOptionValue): string => {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  return String(value);
};

const makeOptions = (
  values: Iterable<NormalizedZodOptionValue>,
): readonly NormalizedZodOption[] =>
  Object.freeze(
    [...new Set(values)].map((value) =>
      Object.freeze({ value, label: optionLabel(value) }),
    ),
  );

const normalizeNode = (
  schema: SchemaNode,
  path: readonly NormalizedZodPathSegment[],
  state: WrapperState,
  context: NormalizationContext,
): NormalizedZodDescriptor => {
  if (context.activeSchemas.has(schema)) {
    return makeUnsupported(
      schema,
      path,
      withLayer(state, schema),
      context,
      "recursive_schema",
      "Recursive schemas are represented as unsupported nodes to prevent infinite expansion.",
    );
  }

  context.activeSchemas.add(schema);

  try {
    const layeredState = withLayer(state, schema);

    if (schema instanceof ZodOptional || schema instanceof ZodExactOptional) {
      return normalizeNode(
        schema.unwrap(),
        path,
        { ...layeredState, optional: true },
        context,
      );
    }

    if (schema instanceof ZodNullable) {
      return normalizeNode(
        schema.unwrap(),
        path,
        { ...layeredState, nullable: true },
        context,
      );
    }

    if (schema instanceof ZodDefault || schema instanceof ZodPrefault) {
      return normalizeNode(
        schema.unwrap(),
        path,
        { ...layeredState, optional: true, defaulted: true },
        context,
      );
    }

    if (schema instanceof ZodReadonly) {
      return normalizeNode(
        schema.unwrap(),
        path,
        { ...layeredState, readOnly: true },
        context,
      );
    }

    if (schema instanceof ZodCatch || schema instanceof ZodLazy) {
      return normalizeNode(schema.unwrap(), path, layeredState, context);
    }

    if (schema instanceof ZodPipe) {
      context.diagnostics.push(
        makeDiagnostic(
          "pipe_input_display",
          "info",
          path,
          "Display information is taken from the pipe input schema; parsing and transforms are never run during normalization.",
          schema.type,
        ),
      );
      return normalizeNode(schema.in, path, layeredState, context);
    }

    const base = makeBase(schema, path, layeredState);

    if (schema instanceof ZodObject) {
      const shape = schema.shape;
      const properties = Object.keys(shape).map((name) =>
        normalizeNode(
          shape[name],
          appendPath(path, name),
          emptyWrapperState(),
          context,
        ),
      );

      return Object.freeze({
        ...base,
        type: "object",
        properties: Object.freeze(properties),
      });
    }

    if (schema instanceof ZodArray) {
      return Object.freeze({
        ...base,
        type: "array",
        element: normalizeNode(
          schema.element,
          appendPath(path, 0),
          emptyWrapperState(),
          context,
        ),
      });
    }

    if (schema instanceof ZodEmail) {
      return Object.freeze({
        ...base,
        type: "email",
        format: schema.format ?? undefined,
        constraints: stringConstraints(schema),
      });
    }

    if (schema instanceof ZodURL) {
      return Object.freeze({
        ...base,
        type: "url",
        format: schema.format ?? undefined,
        constraints: stringConstraints(schema),
      });
    }

    if (schema instanceof ZodString) {
      const format = schema.format ?? undefined;
      const type =
        format === "email" ? "email" : format === "url" ? "url" : "string";

      return Object.freeze({
        ...base,
        type,
        ...(format === undefined ? {} : { format }),
        constraints: stringConstraints(schema),
      });
    }

    if (schema instanceof ZodNumber) {
      return Object.freeze({
        ...base,
        type: "number",
        constraints: numberConstraints(schema),
      });
    }

    if (schema instanceof ZodBoolean) {
      return Object.freeze({ ...base, type: "boolean" });
    }

    if (schema instanceof ZodEnum) {
      return Object.freeze({
        ...base,
        type: "enum",
        options: makeOptions(schema.options),
      });
    }

    if (schema instanceof ZodLiteral) {
      return Object.freeze({
        ...base,
        type: "literal",
        options: makeOptions(schema.values),
      });
    }

    if (schema instanceof ZodDate) {
      return Object.freeze({
        ...base,
        type: "date",
        constraints: dateConstraints(schema),
      });
    }

    return makeUnsupported(
      schema,
      path,
      layeredState,
      context,
      "unsupported_schema",
      `The Zod ${schema instanceof ZodType ? schema.type : "unknown"} schema has no supported form descriptor.`,
    );
  } finally {
    context.activeSchemas.delete(schema);
  }
};

/**
 * Converts a Zod Classic 4 object schema into a frozen, framework-independent
 * descriptor tree. Paths are immutable arrays of property names and numeric
 * array indexes (array element descriptors use `0` as the index placeholder),
 * so names containing dots or bracket characters stay unambiguous.
 * Unsupported and recursive nodes remain visible as fallback descriptors and
 * are also reported in `diagnostics`.
 *
 * This function reads public schema classes, wrapper methods, metadata, and
 * constraint properties only. It never parses values or executes transforms,
 * coercions, refinements, or defaults.
 */
export const normalizeZodObjectSchema = (
  schema: ZodObject,
): NormalizedZodObjectSchema => {
  const context: NormalizationContext = {
    activeSchemas: new WeakSet(),
    diagnostics: [],
  };
  const descriptor = normalizeNode(
    schema,
    emptyPath(),
    emptyWrapperState(),
    context,
  );

  if (descriptor.type !== "object") {
    throw new TypeError(
      "normalizeZodObjectSchema requires a Zod object schema.",
    );
  }

  return Object.freeze({
    ...descriptor,
    diagnostics: Object.freeze([...context.diagnostics]),
  });
};
