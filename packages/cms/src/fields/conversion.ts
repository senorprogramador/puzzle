import type {
  CmsRelationshipConfig,
} from "../types";
import type {
  FieldDescriptor,
  FieldMap,
  RuntimeCmsBlockDefinition,
  RuntimeCmsFieldDefinition,
} from "./types";
import { isCmsValue } from "./serialization";

const convertFieldMap = (fields: FieldMap): readonly RuntimeCmsFieldDefinition[] =>
  Object.keys(fields).map((key) => {
    const field = fields[key];
    if (!field) throw new Error(`Missing field descriptor for "${key}".`);
    return toCmsFieldDefinition(key, field.label ?? key, field);
  });

const relationshipConfig = (
  target: string | readonly string[],
  multiple: boolean | undefined,
  sameLocale: boolean | undefined,
  allowedStatuses: CmsRelationshipConfig["allowedStatuses"],
): CmsRelationshipConfig => ({
  targetTypes: typeof target === "string" ? [target] : target,
  ...(multiple === undefined ? {} : { multiple }),
  ...(sameLocale === undefined ? {} : { sameLocale }),
  ...(allowedStatuses === undefined ? {} : { allowedStatuses }),
});

export const toCmsFieldDefinition = (
  key: string,
  label: string,
  descriptor: FieldDescriptor,
): RuntimeCmsFieldDefinition => {
  const defaultValue = descriptor.defaultValue;
  if (defaultValue !== undefined && !isCmsValue(defaultValue)) {
    throw new TypeError(`The default value for field "${key}" is not JSON-compatible.`);
  }

  const common = {
    key,
    label,
    ...(descriptor.required === undefined ? {} : { required: descriptor.required }),
    ...(descriptor.localized === undefined ? {} : { localized: descriptor.localized }),
    ...(defaultValue === undefined ? {} : { defaultValue }),
    ...(descriptor.validation === undefined
      ? {}
      : { validation: descriptor.validation }),
    ...(descriptor.access === undefined ? {} : { access: descriptor.access }),
    ...(descriptor.validate === undefined ? {} : { validate: descriptor.validate }),
  };

  switch (descriptor.type) {
    case "text":
      return {
        ...common,
        type: "text",
        ...(descriptor.trim === undefined ? {} : { trim: descriptor.trim }),
      };
    case "textarea":
      return {
        ...common,
        type: "textarea",
        ...(descriptor.rows === undefined ? {} : { rows: descriptor.rows }),
      };
    case "number":
      return {
        ...common,
        type: "number",
        ...(descriptor.step === undefined ? {} : { step: descriptor.step }),
      };
    case "boolean":
    case "date":
    case "datetime":
    case "email":
    case "json":
      return { ...common, type: descriptor.type };
    case "url":
      return {
        ...common,
        type: "url",
        ...(descriptor.protocols === undefined
          ? {}
          : { protocols: descriptor.protocols }),
      };
    case "slug":
      return {
        ...common,
        type: "slug",
        ...(descriptor.from === undefined ? {} : { from: descriptor.from }),
      };
    case "select":
    case "multiSelect":
      return {
        ...common,
        type: descriptor.type,
        options: descriptor.options,
      };
    case "media":
      return {
        ...common,
        type: "media",
        ...(descriptor.accept === undefined ? {} : { accept: descriptor.accept }),
      };
    case "relationship":
      return {
        ...common,
        type: "relationship",
        relation: relationshipConfig(
          descriptor.target,
          descriptor.multiple,
          descriptor.sameLocale,
          descriptor.allowedStatuses,
        ),
      };
    case "richText":
      return {
        ...common,
        type: "richText",
        ...(descriptor.allowedFeatures === undefined
          ? {}
          : { allowedFeatures: descriptor.allowedFeatures }),
      };
    case "array":
      return {
        ...common,
        type: "array",
        of: toCmsFieldDefinition(
          "item",
          descriptor.of.label ?? "Item",
          descriptor.of,
        ),
      };
    case "object":
      return {
        ...common,
        type: "object",
        fields: convertFieldMap(descriptor.fields),
      };
    case "blocks": {
      const convertedBlocks: readonly RuntimeCmsBlockDefinition[] = descriptor.blocks.map(
        (block) => ({
          type: block.type,
          ...(block.label === undefined ? {} : { label: block.label }),
          fields: convertFieldMap(block.fields),
        }),
      );
      return { ...common, type: "blocks", blocks: convertedBlocks };
    }
    case "computed":
      return { ...common, type: "computed", compute: descriptor.compute };
    case "custom":
      return {
        ...common,
        type: "custom",
        name: descriptor.name,
        is: descriptor.is,
      };
    default:
      throw new Error("Unsupported field descriptor.");
  }
};
