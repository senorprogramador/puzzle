import type { CmsConfig, CmsCollectionRegistry } from "./define-cms";
import type {
  CmsCollectionPresentation,
  CmsPresentationCollection,
  CmsPresentationField,
  CollectionDefinition,
  CollectionKind,
  CollectionOptions,
  FieldMap,
} from "../collections/collection";
import type { FieldDescriptor } from "../fields";

export type CmsPresentationConfig<TCollections extends CmsCollectionRegistry> = {
  readonly collections: {
    readonly [TKey in keyof TCollections]: CmsPresentationCollection<
      TCollections[TKey]
    >;
  };
};

const isRecord = (value: unknown): value is Readonly<Record<string, unknown>> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const projectSerializable = (value: unknown): unknown => {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }
  if (Array.isArray(value)) return value.map(projectSerializable);
  if (typeof value !== "object") return undefined;
  const record = value as Readonly<Record<string, unknown>>;
  const output: Record<string, unknown> = {};
  for (const key of Object.keys(record)) {
    const projected = projectSerializable(record[key]);
    if (projected !== undefined) output[key] = projected;
  }
  return output;
};

const isCollectionDefinition = (
  value: unknown,
): value is CollectionDefinition<FieldMap, CollectionKind> =>
  isRecord(value) &&
  isRecord(value.fields) &&
  (value.kind === "collection" || value.kind === "singleton");

const projectField = (field: FieldDescriptor): CmsPresentationField => {
  const source = field as Readonly<Record<string, unknown>>;
  const output: Record<string, unknown> = {};
  for (const key of Object.keys(source)) {
    if (key === "access" || key === "validate" || key === "compute" || key === "is") {
      continue;
    }
    if (key === "fields" && field.type === "object") {
      output.fields = projectFields(field.fields);
      continue;
    }
    if (key === "of" && field.type === "array") {
      output.of = projectField(field.of);
      continue;
    }
    if (key === "blocks" && field.type === "blocks") {
      output.blocks = field.blocks.map((block) => ({
        type: block.type,
        ...(block.label === undefined ? {} : { label: block.label }),
        fields: projectFields(block.fields),
      }));
      continue;
    }
    const projected = projectSerializable(source[key]);
    if (projected !== undefined) output[key] = projected;
  }
  return output as CmsPresentationField;
};

const projectFields = <TFields extends FieldMap>(
  fields: TFields,
) => {
  const output: Record<string, CmsPresentationField> = {};
  for (const key of Object.keys(fields)) {
    const field = fields[key];
    if (!field) throw new TypeError(`Missing field descriptor for "${key}".`);
    output[key] = projectField(field);
  }
  return output as {
    readonly [TKey in keyof TFields]: CmsPresentationField<TFields[TKey]>;
  };
};

const projectCollection = <
  TFields extends FieldMap,
  TKind extends CollectionKind,
  TOptions extends CollectionOptions<TFields>,
>(
  collection: CollectionDefinition<TFields, TKind, TOptions>,
): CmsCollectionPresentation<TFields, TKind, TOptions> => {
  const source = collection as Readonly<Record<string, unknown>>;
  const output: Record<string, unknown> = {};
  for (const key of Object.keys(source)) {
    if (key === "access" || key === "hooks") continue;
    if (key === "fields") {
      output.fields = projectFields(collection.fields);
      continue;
    }
    const projected = projectSerializable(source[key]);
    if (projected !== undefined) output[key] = projected;
  }
  return output as CmsCollectionPresentation<TFields, TKind, TOptions>;
};

export const toCmsPresentation = <
  const TCollections extends CmsCollectionRegistry,
>(
  config: CmsConfig<TCollections>,
): CmsPresentationConfig<TCollections> => {
  const collections: Record<string, unknown> = {};
  for (const key of Object.keys(config.collections)) {
    const collection = config.collections[key];
    if (!isCollectionDefinition(collection)) {
      throw new TypeError(`Invalid collection definition for "${key}".`);
    }
    collections[key] = projectCollection(collection);
  }
  return { collections } as CmsPresentationConfig<TCollections>;
};
