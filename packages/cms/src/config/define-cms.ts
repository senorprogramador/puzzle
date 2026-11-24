import type { FieldDescriptor } from "../fields";
import type {
  CollectionKind,
  FieldMap,
} from "../collections/collection";

export type CmsCollectionRegistry = Readonly<Record<string, unknown>>;

export type CmsConfig<TCollections extends CmsCollectionRegistry> = {
  readonly collections: TCollections;
};

type FieldMapValues<TFields extends FieldMap> = TFields[keyof TFields];

type RelationshipTargets<TField> =
  TField extends unknown
    ? TField extends {
        readonly type: "relationship";
        readonly target: infer TTarget;
      }
      ? TTarget extends string
        ? TTarget
        : TTarget extends readonly string[]
          ? TTarget[number]
          : never
      : TField extends { readonly type: "array"; readonly of: infer TChild }
        ? RelationshipTargets<TChild>
        : TField extends {
              readonly type: "object";
              readonly fields: infer TChildren extends FieldMap;
            }
          ? RelationshipTargets<FieldMapValues<TChildren>>
          : TField extends {
                readonly type: "blocks";
                readonly blocks: readonly (infer TBlock)[];
              }
            ? TBlock extends { readonly fields: infer TChildren extends FieldMap }
              ? RelationshipTargets<FieldMapValues<TChildren>>
              : never
            : never
    : never;

type CollectionFields<TCollection> =
  TCollection extends { readonly fields: infer TFields extends FieldMap }
    ? TFields
    : never;

type AllRelationshipTargets<TCollections extends CmsCollectionRegistry> = {
  [TKey in keyof TCollections]: RelationshipTargets<
    FieldMapValues<CollectionFields<TCollections[TKey]>>
  >;
}[keyof TCollections];

type MissingRelationshipTargets<TCollections extends CmsCollectionRegistry> =
  Exclude<AllRelationshipTargets<TCollections>, Extract<keyof TCollections, string>>;

type ReservedFieldNames =
  | "id"
  | "locale"
  | "status"
  | "publishedAt"
  | "createdAt"
  | "updatedAt"
  | "revision"
  | "revisionNumber"
  | "scheduledAt"
  | "scheduledTimeZone"
  | "scheduledRevisionNumber"
  | "archivedAt"
  | "deletedAt"
  | "and"
  | "or";

type ReservedFields<TCollections extends CmsCollectionRegistry> = {
  [TKey in keyof TCollections]: Extract<
    keyof CollectionFields<TCollections[TKey]>,
    ReservedFieldNames
  >;
}[keyof TCollections];

type SlugFieldNames<TFields extends FieldMap> = {
  [TKey in keyof TFields]: TFields[TKey] extends { readonly type: "slug" }
    ? TKey
    : never;
}[keyof TFields];

type SingletonSlugFields<TCollections extends CmsCollectionRegistry> = {
  [TKey in keyof TCollections]: TCollections[TKey] extends {
    readonly kind: "singleton";
    readonly fields: infer TFields extends FieldMap;
  }
    ? SlugFieldNames<TFields>
    : never;
}[keyof TCollections];

type InvalidCollections<TCollections extends CmsCollectionRegistry> = {
  [TKey in keyof TCollections]: TCollections[TKey] extends {
    readonly kind: CollectionKind;
    readonly fields: FieldMap;
  }
    ? never
    : TKey;
}[keyof TCollections];

type ConfigConstraints<TCollections extends CmsCollectionRegistry> =
  [InvalidCollections<TCollections>] extends [never]
    ? [MissingRelationshipTargets<TCollections>] extends [never]
      ? [ReservedFields<TCollections>] extends [never]
        ? [SingletonSlugFields<TCollections>] extends [never]
          ? unknown
          : { readonly __singletonSlugFields__: SingletonSlugFields<TCollections> }
        : { readonly __reservedCMSFields__: ReservedFields<TCollections> }
      : {
          readonly __unknownRelationshipTargets__: MissingRelationshipTargets<TCollections>;
        }
    : { readonly __invalidCollections__: InvalidCollections<TCollections> };

export type DefineCmsInput<TCollections extends CmsCollectionRegistry> = {
  readonly collections: TCollections;
} & ConfigConstraints<TCollections>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const fieldEntries = (
  fields: Readonly<Record<string, FieldDescriptor>>,
): readonly (readonly [string, FieldDescriptor])[] => {
  const entries: Array<readonly [string, FieldDescriptor]> = [];
  for (const key of Object.keys(fields)) entries.push([key, fields[key]!]);
  return entries;
};

const nestedFieldMaps = (field: FieldDescriptor): readonly FieldMap[] => {
  if (field.type === "array") return [Object.freeze({ item: field.of })];
  if (field.type === "object") return [field.fields];
  if (field.type === "blocks") return field.blocks.map((block) => block.fields);
  return [];
};

const validateNestedDescriptors = (
  fields: FieldMap,
  collectionKeys: ReadonlySet<string>,
  path: string,
): void => {
  for (const [key, field] of fieldEntries(fields)) {
    const fieldPath = `${path}.${key}`;
    if (field.type === "relationship") {
      const targets = typeof field.target === "string" ? [field.target] : field.target;
      for (const target of targets) {
        if (!collectionKeys.has(target)) {
          throw new TypeError(
            `Relationship field "${fieldPath}" targets unknown collection "${target}".`,
          );
        }
      }
    }
    if (field.type === "slug" && field.from && !Object.hasOwn(fields, field.from)) {
      throw new TypeError(
        `Slug field "${fieldPath}" refers to unknown source field "${field.from}".`,
      );
    }
    for (const children of nestedFieldMaps(field)) {
      validateNestedDescriptors(children, collectionKeys, fieldPath);
    }
  }
};

const validateConfig = (input: unknown): void => {
  if (!isRecord(input) || !isRecord(input.collections)) {
    throw new TypeError("defineCMS requires a collections object.");
  }
  const collectionKeys = new Set(Object.keys(input.collections));
  for (const [key, rawCollection] of Object.entries(input.collections)) {
    if (!isRecord(rawCollection) || !isRecord(rawCollection.fields)) {
      throw new TypeError(`Collection "${key}" requires a keyed fields object.`);
    }
    if (rawCollection.kind !== "collection" && rawCollection.kind !== "singleton") {
      throw new TypeError(`Collection "${key}" has an invalid collection kind.`);
    }
    const fields = rawCollection.fields as FieldMap;
    const reservedFields = [
      "id",
      "locale",
      "status",
      "publishedAt",
      "createdAt",
      "updatedAt",
      "revision",
      "revisionNumber",
      "scheduledAt",
      "scheduledTimeZone",
      "scheduledRevisionNumber",
      "archivedAt",
      "deletedAt",
      "and",
      "or",
    ];
    for (const fieldKey of Object.keys(fields)) {
      if (reservedFields.includes(fieldKey)) {
        throw new TypeError(
          `Field "${key}.${fieldKey}" conflicts with CMS document metadata or query operators.`,
        );
      }
    }
    if (
      rawCollection.kind === "singleton" &&
      Object.values(fields).some(
        (field) => isRecord(field) && field.type === "slug",
      )
    ) {
      throw new TypeError(
        `Singleton collection "${key}" cannot define a slug field; its document has a stable internal slug.`,
      );
    }
    validateNestedDescriptors(fields, collectionKeys, key);
  }
};

export const defineCMS = <
  const TCollections extends CmsCollectionRegistry,
>(
  input: DefineCmsInput<TCollections>,
): CmsConfig<TCollections> => {
  validateConfig(input);
  return input;
};
