import type { CmsEntryStatus, CmsFields, CmsValue } from "../types";
import type {
  ArrayFieldDefinition,
  BlockDefinition,
  BlocksFieldDefinition,
  BooleanFieldDefinition,
  BlocksValue,
  ComputedFieldDefinition,
  CustomFieldDefinition,
  DateFieldDefinition,
  DatetimeFieldDefinition,
  EmailFieldDefinition,
  FieldDefinition,
  FieldDescriptor,
  FieldOptions,
  FieldRequired,
  FieldValidationContext,
  FieldHasDefault,
  FieldMap,
  FieldValue,
  JsonFieldDefinition,
  MediaFieldDefinition,
  MultiSelectFieldDefinition,
  NumberFieldDefinition,
  ObjectFieldDefinition,
  RelationshipFieldDefinition,
  RichTextFieldDefinition,
  SelectFieldDefinition,
  SelectOption,
  SelectValue,
  SlugFieldDefinition,
  TextareaFieldDefinition,
  TextFieldDefinition,
  UrlFieldDefinition,
  FieldsValue,
} from "./types";

type WithFieldType<
  TValue,
  TKind extends FieldDefinition<TValue>["type"],
  TOptions extends FieldOptions<TValue>,
> = FieldDefinition<
  TValue,
  FieldRequired<TOptions>,
  FieldHasDefault<TOptions>,
  TKind
> &
  TOptions;

const defineField = <
  TValue,
  TKind extends FieldDefinition<TValue>["type"],
  const TOptions extends FieldOptions<TValue>,
>(
  type: TKind,
  options?: TOptions,
): WithFieldType<TValue, TKind, TOptions> =>
  ({
    ...options,
    type,
  }) as WithFieldType<TValue, TKind, TOptions>;

export type TextFieldOptions = FieldOptions<string> & {
  readonly trim?: boolean;
};

export const text = <
  const TOptions extends TextFieldOptions = TextFieldOptions,
>(
  options?: TOptions,
): TextFieldDefinition<TOptions> =>
  defineField<string, "text", TOptions>("text", options);

export type TextareaFieldOptions = FieldOptions<string> & {
  readonly rows?: number;
};

export const textarea = <
  const TOptions extends TextareaFieldOptions = TextareaFieldOptions,
>(
  options?: TOptions,
): TextareaFieldDefinition<TOptions> =>
  defineField<string, "textarea", TOptions>("textarea", options);

export type NumberFieldOptions = FieldOptions<number> & {
  readonly step?: number;
};

export const number = <
  const TOptions extends NumberFieldOptions = NumberFieldOptions,
>(
  options?: TOptions,
): NumberFieldDefinition<TOptions> =>
  defineField<number, "number", TOptions>("number", options);

export const boolean = <
  const TOptions extends FieldOptions<boolean> = FieldOptions<boolean>,
>(
  options?: TOptions,
): BooleanFieldDefinition<TOptions> =>
  defineField<boolean, "boolean", TOptions>("boolean", options);

export const date = <
  const TOptions extends FieldOptions<string> = FieldOptions<string>,
>(
  options?: TOptions,
): DateFieldDefinition<TOptions> =>
  defineField<string, "date", TOptions>("date", options);

export const datetime = <
  const TOptions extends FieldOptions<string> = FieldOptions<string>,
>(
  options?: TOptions,
): DatetimeFieldDefinition<TOptions> =>
  defineField<string, "datetime", TOptions>("datetime", options);

export const email = <
  const TOptions extends FieldOptions<string> = FieldOptions<string>,
>(
  options?: TOptions,
): EmailFieldDefinition<TOptions> =>
  defineField<string, "email", TOptions>("email", options);

export type UrlFieldOptions = FieldOptions<string> & {
  readonly protocols?: readonly string[];
};

export const url = <
  const TOptions extends UrlFieldOptions = UrlFieldOptions,
>(
  options?: TOptions,
): UrlFieldDefinition<TOptions> =>
  defineField<string, "url", TOptions>("url", options);

export type SlugFieldOptions = FieldOptions<string> & {
  readonly from?: string;
};

export const slug = <
  const TOptions extends SlugFieldOptions = SlugFieldOptions,
>(
  options?: TOptions,
): SlugFieldDefinition<TOptions> =>
  defineField<string, "slug", TOptions>("slug", options);

export const select = <
  const TChoices extends readonly SelectOption[],
  const TOptions extends FieldOptions<SelectValue<TChoices>> & {
    readonly options: TChoices;
  },
>(
  options: TOptions & { readonly options: TChoices },
): SelectFieldDefinition<TChoices, TOptions> =>
  defineField<SelectValue<TChoices>, "select", TOptions>("select", options);

export const multiSelect = <
  const TChoices extends readonly SelectOption[],
  const TOptions extends FieldOptions<readonly SelectValue<TChoices>[]> & {
    readonly options: TChoices;
  },
>(
  options: TOptions & { readonly options: TChoices },
): MultiSelectFieldDefinition<TChoices, TOptions> =>
  defineField<readonly SelectValue<TChoices>[], "multiSelect", TOptions>(
    "multiSelect",
    options,
  );

export type MediaFieldOptions = FieldOptions<string> & {
  readonly accept?: readonly string[];
};

export const media = <
  const TOptions extends MediaFieldOptions = MediaFieldOptions,
>(
  options?: TOptions,
): MediaFieldDefinition<TOptions> =>
  defineField<string, "media", TOptions>("media", options);

export type RelationshipFieldOptions<
  TTarget extends string | readonly string[] = string | readonly string[],
  TMultiple extends boolean = boolean,
> = FieldOptions<
  TMultiple extends true
    ? readonly string[]
    : TMultiple extends false
      ? string
      : string | readonly string[]
> & {
  readonly multiple?: TMultiple;
  readonly sameLocale?: boolean;
  readonly allowedStatuses?: readonly CmsEntryStatus[];
} & (
  | {
      readonly target: TTarget;
      readonly collection?: never;
    }
  | {
      readonly collection: TTarget;
      readonly target?: never;
    }
);

type RelationshipValue<TOptions> =
  TOptions extends { readonly multiple: true }
    ? readonly string[]
    : TOptions extends { readonly multiple: false }
      ? string
      : "multiple" extends keyof TOptions
        ? string | readonly string[]
        : string;
type RelationshipTargetValue<TOptions> =
  TOptions extends { readonly target: infer TTarget extends string | readonly string[] }
    ? TTarget
    : TOptions extends {
          readonly collection: infer TTarget extends string | readonly string[];
        }
      ? TTarget
      : never;

export function relationship<const TOptions extends RelationshipFieldOptions>(
  options: TOptions,
): FieldDefinition<
  RelationshipValue<TOptions>,
  FieldRequired<TOptions>,
  FieldHasDefault<TOptions>,
  "relationship"
> &
  TOptions & {
    readonly target: RelationshipTargetValue<TOptions>;
  };
export function relationship(options: RelationshipFieldOptions): RelationshipFieldDefinition {
  const target = options.target ?? options.collection;
  if (target === undefined) {
    throw new TypeError("Relationship fields require a target collection.");
  }
  return {
    ...options,
    type: "relationship",
    target,
  };
}

export type RichTextFieldOptions = FieldOptions<CmsValue> & {
  readonly allowedFeatures?: readonly string[];
};

export const richText = <
  const TOptions extends RichTextFieldOptions = RichTextFieldOptions,
>(
  options?: TOptions,
): RichTextFieldDefinition<TOptions> =>
  defineField<CmsValue, "richText", TOptions>("richText", options);

export const json = <
  const TOptions extends FieldOptions<CmsValue> = FieldOptions<CmsValue>,
>(
  options?: TOptions,
): JsonFieldDefinition<TOptions> =>
  defineField<CmsValue, "json", TOptions>("json", options);

export type ArrayFieldOptions<TField extends FieldDescriptor> = FieldOptions<
  readonly FieldValue<TField>[]
> & {
  readonly of: TField;
};

export const array = <
  const TField extends FieldDescriptor,
  const TOptions extends ArrayFieldOptions<TField>,
>(
  options: TOptions & { readonly of: TField },
): ArrayFieldDefinition<TField, TOptions> =>
  defineField<readonly FieldValue<TField>[], "array", TOptions>(
    "array",
    options,
  );

export type ObjectFieldOptions<TFields extends FieldMap> = FieldOptions<
  FieldsValue<TFields>
> & {
  readonly fields: TFields;
};

export const object = <
  const TFields extends FieldMap,
  const TOptions extends ObjectFieldOptions<TFields>,
>(
  options: TOptions & { readonly fields: TFields },
): ObjectFieldDefinition<TFields, TOptions> =>
  defineField<FieldsValue<TFields>, "object", TOptions>("object", options);

export type BlocksFieldOptions<
  TBlocks extends readonly BlockDefinition[],
> = FieldOptions<BlocksValue<TBlocks>> & {
  readonly blocks: TBlocks;
};

type BlocksValueFor<TBlocks extends readonly BlockDefinition[]> =
  BlocksValue<TBlocks>;

export const blocks = <
  const TBlocks extends readonly BlockDefinition[],
  const TOptions extends FieldOptions<BlocksValueFor<TBlocks>> & {
    readonly blocks: TBlocks;
  },
>(
  options: TOptions & { readonly blocks: TBlocks },
): BlocksFieldDefinition<TBlocks, TOptions> =>
  defineField<BlocksValueFor<TBlocks>, "blocks", TOptions>("blocks", options);

export type ComputedFieldOptions<TValue extends CmsValue> =
  Omit<FieldOptions<TValue>, "required" | "defaultValue"> & {
    readonly required?: never;
    readonly defaultValue?: never;
    readonly compute: (
      context: FieldValidationContext & { readonly fields: CmsFields },
    ) => TValue | Promise<TValue>;
  };

export const computed = <
  TValue extends CmsValue,
  const TOptions extends ComputedFieldOptions<TValue>,
>(
  options: TOptions & {
    readonly required?: never;
    readonly defaultValue?: never;
    readonly compute: (
      context: FieldValidationContext & { readonly fields: CmsFields },
    ) => TValue | Promise<TValue>;
  },
): ComputedFieldDefinition<TValue, TOptions> =>
  defineField<TValue, "computed", TOptions>("computed", options);

export type CustomFieldOptions<TValue extends CmsValue> = FieldOptions<TValue> & {
  readonly name: string;
  readonly is: (value: unknown) => value is TValue;
};

export const custom = <
  TValue extends CmsValue,
  const TOptions extends CustomFieldOptions<TValue>,
>(
  options: TOptions & {
    readonly is: (value: unknown) => value is TValue;
  },
): CustomFieldDefinition<TValue, TOptions> =>
  defineField<TValue, "custom", TOptions>("custom", options);

export type FieldFactories = Readonly<{
  text: typeof text;
  textarea: typeof textarea;
  number: typeof number;
  boolean: typeof boolean;
  date: typeof date;
  datetime: typeof datetime;
  email: typeof email;
  url: typeof url;
  slug: typeof slug;
  select: typeof select;
  multiSelect: typeof multiSelect;
  media: typeof media;
  relationship: typeof relationship;
  richText: typeof richText;
  json: typeof json;
  array: typeof array;
  object: typeof object;
  blocks: typeof blocks;
  computed: typeof computed;
  custom: typeof custom;
}>;

export const fields: FieldFactories = {
  text,
  textarea,
  number,
  boolean,
  date,
  datetime,
  email,
  url,
  slug,
  select,
  multiSelect,
  media,
  relationship,
  richText,
  json,
  array,
  object,
  blocks,
  computed,
  custom,
};
