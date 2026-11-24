import type {
  CmsActor,
  CmsEntryStatus,
  CmsFields,
  CmsFieldDefinition,
  CmsFieldType,
  CmsFieldValidation,
  CmsScalar,
  CmsSelectOption,
  CmsValue,
} from "../types";

declare const fieldDefinitionTypeMarker: unique symbol;

export type FieldKind =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "date"
  | "datetime"
  | "email"
  | "url"
  | "slug"
  | "select"
  | "multiSelect"
  | "media"
  | "relationship"
  | "richText"
  | "json"
  | "array"
  | "object"
  | "blocks"
  | "computed"
  | "custom";

export type FieldValidation = {
  readonly min?: number;
  readonly max?: number;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly pattern?: string;
  readonly allowedValues?: readonly CmsScalar[];
};

export type FieldValidationContext = {
  readonly fieldPath?: string;
  readonly path?: string;
  readonly locale?: string;
  readonly tenantId?: string;
  readonly contentTypeSlug?: string;
  readonly actor?: CmsActor | null;
};

export type FieldValidationResult =
  | string
  | null
  | void
  | Promise<string | null | void>;

export type FieldValidator<TValue> = {
  bivarianceHack(
    value: TValue,
    context: FieldValidationContext,
  ): FieldValidationResult;
}["bivarianceHack"];

export type FieldAccessContext = FieldValidationContext & {
  readonly operation: "read" | "write";
};

export type FieldAccessCallback = (
  context: FieldAccessContext,
) => boolean | Promise<boolean>;

export type FieldAccess = {
  readonly read?: boolean | FieldAccessCallback;
  readonly write?: boolean | FieldAccessCallback;
};

export type FieldOptions<TValue> = {
  readonly label?: string;
  readonly required?: boolean;
  readonly defaultValue?: TValue;
  readonly localized?: boolean;
  readonly access?: FieldAccess;
  readonly validation?: FieldValidation;
  readonly validate?: FieldValidator<TValue>;
};

export type FieldDefinition<
  TValue,
  TRequired extends boolean = boolean,
  THasDefault extends boolean = boolean,
  TKind extends FieldKind = FieldKind,
> = Readonly<{
  readonly type: TKind;
  readonly label?: string;
  readonly required?: TRequired;
  readonly defaultValue?: TValue;
  readonly localized?: boolean;
  readonly access?: FieldAccess;
  readonly validation?: FieldValidation;
  readonly validate?: FieldValidator<TValue>;
  readonly [fieldDefinitionTypeMarker]?: {
    readonly required: TRequired;
    readonly hasDefault: THasDefault;
  };
}>;

export type RuntimeCmsFieldType = CmsFieldType | FieldKind;

export type RuntimeCmsBlockDefinition = Readonly<{
  readonly type: string;
  readonly label?: string;
  readonly fields: readonly RuntimeCmsFieldDefinition[];
}>;

export type RuntimeCmsFieldDefinition = Omit<
  CmsFieldDefinition,
  "type" | "validation" | "fields" | "blocks"
> &
  Readonly<{
    readonly type: RuntimeCmsFieldType;
    readonly validation?: CmsFieldValidation & {
      readonly minLength?: number;
      readonly maxLength?: number;
    };
    readonly fields?: readonly RuntimeCmsFieldDefinition[];
    readonly of?: RuntimeCmsFieldDefinition;
    readonly blocks?: readonly RuntimeCmsBlockDefinition[];
    readonly access?: FieldAccess;
    readonly validate?: FieldValidator<unknown>;
    readonly compute?: (
      context: FieldValidationContext & { readonly fields: CmsFields },
    ) => CmsValue | Promise<CmsValue>;
    readonly name?: string;
    readonly is?: (value: unknown) => boolean;
    readonly trim?: boolean;
    readonly rows?: number;
    readonly step?: number;
    readonly protocols?: readonly string[];
    readonly from?: string;
    readonly accept?: readonly string[];
    readonly allowedFeatures?: readonly string[];
  }>;

export type SelectOption<TValue extends string | number | boolean = string | number | boolean> = {
  readonly label: string;
  readonly value: TValue;
};

export type FieldRequired<TOptions> =
  TOptions extends { readonly required: true }
    ? true
    : TOptions extends { readonly required?: never }
      ? false
      : TOptions extends { readonly required?: boolean }
        ? boolean
        : false;

export type FieldHasDefault<TOptions> =
  TOptions extends { readonly defaultValue: unknown }
    ? true
    : TOptions extends { readonly defaultValue?: never }
      ? false
      : TOptions extends { readonly defaultValue?: unknown }
        ? boolean
        : false;

export type FieldValue<TField> =
  TField extends FieldDefinition<infer TValue, boolean, boolean, FieldKind>
    ? TValue
    : never;

export type FieldDescriptor =
  | TextFieldDefinition
  | TextareaFieldDefinition
  | NumberFieldDefinition
  | BooleanFieldDefinition
  | DateFieldDefinition
  | DatetimeFieldDefinition
  | EmailFieldDefinition
  | UrlFieldDefinition
  | SlugFieldDefinition
  | SelectFieldDefinition
  | MultiSelectFieldDefinition
  | MediaFieldDefinition
  | RelationshipFieldDefinition
  | RichTextFieldDefinition
  | JsonFieldDefinition
  | (FieldDefinition<readonly unknown[], boolean, boolean, "array"> & {
      readonly of: FieldDescriptor;
    })
  | (FieldDefinition<unknown, boolean, boolean, "object"> & {
      readonly fields: FieldMap;
    })
  | (FieldDefinition<readonly unknown[], boolean, boolean, "blocks"> & {
      readonly blocks: readonly BlockDefinition[];
    })
  | ComputedFieldDefinition
  | (FieldDefinition<CmsValue, boolean, boolean, "custom"> & {
      readonly name: string;
      readonly is: (value: unknown) => boolean;
    });

export type AnyFieldDefinition = FieldDescriptor;

export interface FieldMap {
  readonly [key: string]: FieldDescriptor;
}

export type IsFieldRequired<TField> =
  TField extends FieldDefinition<infer _TValue, infer TRequired, infer THasDefault, FieldKind>
    ? TRequired extends true
      ? THasDefault extends true
        ? false
        : true
      : false
    : false;

export type FieldsValue<TFields extends FieldMap> = {
  readonly [TKey in keyof TFields as IsFieldRequired<TFields[TKey]> extends true
    ? TKey
    : never]: FieldValue<TFields[TKey]>;
} & {
  readonly [TKey in keyof TFields as IsFieldRequired<TFields[TKey]> extends true
    ? never
    : TKey]?: FieldValue<TFields[TKey]>;
};

export type FieldsCreateInput<TFields extends FieldMap> = FieldsValue<TFields>;

export type TextFieldDefinition<
  TOptions extends FieldOptions<string> = FieldOptions<string>,
> = FieldDefinition<string, FieldRequired<TOptions>, FieldHasDefault<TOptions>, "text"> &
  TOptions & {
    readonly trim?: boolean;
  };

export type TextareaFieldDefinition<
  TOptions extends FieldOptions<string> = FieldOptions<string>,
> = FieldDefinition<string, FieldRequired<TOptions>, FieldHasDefault<TOptions>, "textarea"> &
  TOptions & {
    readonly rows?: number;
  };

export type NumberFieldDefinition<
  TOptions extends FieldOptions<number> = FieldOptions<number>,
> = FieldDefinition<number, FieldRequired<TOptions>, FieldHasDefault<TOptions>, "number"> &
  TOptions & {
    readonly step?: number;
  };

export type BooleanFieldDefinition<
  TOptions extends FieldOptions<boolean> = FieldOptions<boolean>,
> = FieldDefinition<boolean, FieldRequired<TOptions>, FieldHasDefault<TOptions>, "boolean">;

export type DateFieldDefinition<
  TOptions extends FieldOptions<string> = FieldOptions<string>,
> = FieldDefinition<string, FieldRequired<TOptions>, FieldHasDefault<TOptions>, "date">;

export type DatetimeFieldDefinition<
  TOptions extends FieldOptions<string> = FieldOptions<string>,
> = FieldDefinition<string, FieldRequired<TOptions>, FieldHasDefault<TOptions>, "datetime">;

export type EmailFieldDefinition<
  TOptions extends FieldOptions<string> = FieldOptions<string>,
> = FieldDefinition<string, FieldRequired<TOptions>, FieldHasDefault<TOptions>, "email">;

export type UrlFieldDefinition<
  TOptions extends FieldOptions<string> = FieldOptions<string>,
> = FieldDefinition<string, FieldRequired<TOptions>, FieldHasDefault<TOptions>, "url"> &
  TOptions & {
    readonly protocols?: readonly string[];
  };

export type SlugFieldDefinition<
  TOptions extends FieldOptions<string> = FieldOptions<string>,
> = FieldDefinition<string, FieldRequired<TOptions>, FieldHasDefault<TOptions>, "slug"> &
  TOptions & {
    readonly from?: string;
  };

export type SelectValue<TOptions extends readonly SelectOption[]> =
  TOptions[number]["value"];

export type SelectFieldOptions<
  TOptions extends readonly SelectOption[],
  TValue extends SelectValue<TOptions> = SelectValue<TOptions>,
> = FieldOptions<TValue> & {
  readonly options: TOptions;
};

export type SelectFieldDefinition<
  TOptions extends readonly SelectOption[] = readonly SelectOption[],
  TFieldOptions extends FieldOptions<SelectValue<TOptions>> = FieldOptions<SelectValue<TOptions>>,
> = FieldDefinition<
  SelectValue<TOptions>,
  FieldRequired<TFieldOptions>,
  FieldHasDefault<TFieldOptions>,
  "select"
> & {
  readonly options: TOptions;
} & TFieldOptions;

export type MultiSelectFieldDefinition<
  TOptions extends readonly SelectOption[] = readonly SelectOption[],
  TFieldOptions extends FieldOptions<readonly SelectValue<TOptions>[]> = FieldOptions<
    readonly SelectValue<TOptions>[]
  >,
> = FieldDefinition<
  readonly SelectValue<TOptions>[],
  FieldRequired<TFieldOptions>,
  FieldHasDefault<TFieldOptions>,
  "multiSelect"
> & {
  readonly options: TOptions;
} & TFieldOptions;

export type MediaFieldDefinition<
  TOptions extends FieldOptions<string> = FieldOptions<string>,
> = FieldDefinition<string, FieldRequired<TOptions>, FieldHasDefault<TOptions>, "media"> &
  TOptions & {
    readonly accept?: readonly string[];
  };

export type RelationshipFieldDefinition<
  TTarget extends string | readonly string[] = string | readonly string[],
  TMultiple extends boolean = boolean,
  TOptions extends FieldOptions<
    TMultiple extends true
      ? readonly string[]
      : TMultiple extends false
        ? string
        : string | readonly string[]
  > = FieldOptions<
    TMultiple extends true
      ? readonly string[]
      : TMultiple extends false
        ? string
        : string | readonly string[]
  > & {
    readonly target?: TTarget;
    readonly collection?: TTarget;
  },
> = FieldDefinition<
  TMultiple extends true
    ? readonly string[]
    : TMultiple extends false
      ? string
      : string | readonly string[],
  FieldRequired<TOptions>,
  FieldHasDefault<TOptions>,
  "relationship"
> &
  TOptions & {
    readonly target: TTarget;
    readonly collection?: TTarget;
    readonly multiple?: TMultiple;
    readonly sameLocale?: boolean;
    readonly allowedStatuses?: readonly CmsEntryStatus[];
  };

export type RichTextFieldDefinition<
  TOptions extends FieldOptions<CmsValue> = FieldOptions<CmsValue>,
> = FieldDefinition<CmsValue, FieldRequired<TOptions>, FieldHasDefault<TOptions>, "richText"> &
  TOptions & {
    readonly allowedFeatures?: readonly string[];
  };

export type JsonFieldDefinition<
  TOptions extends FieldOptions<CmsValue> = FieldOptions<CmsValue>,
> = FieldDefinition<CmsValue, FieldRequired<TOptions>, FieldHasDefault<TOptions>, "json"> &
  TOptions;

export type ArrayFieldDefinition<
  TField extends FieldDescriptor = FieldDescriptor,
  TOptions extends FieldOptions<readonly FieldValue<TField>[]> = FieldOptions<
    readonly FieldValue<TField>[]
  >,
> = FieldDefinition<
  readonly FieldValue<TField>[],
  FieldRequired<TOptions>,
  FieldHasDefault<TOptions>,
  "array"
> & {
  readonly of: TField;
} & TOptions;

export type ObjectFieldDefinition<
  TFields extends FieldMap = FieldMap,
  TOptions extends FieldOptions<FieldsValue<TFields>> = FieldOptions<FieldsValue<TFields>>,
> = FieldDefinition<
  FieldsValue<TFields>,
  FieldRequired<TOptions>,
  FieldHasDefault<TOptions>,
  "object"
> & {
  readonly fields: TFields;
} & TOptions;

export type BlockDefinition<TFields extends FieldMap = FieldMap> = Readonly<{
  readonly type: string;
  readonly label?: string;
  readonly fields: TFields;
}>;

export type BlockValue<TBlock> =
  TBlock extends BlockDefinition<infer TFields>
    ? Readonly<{
        readonly type: TBlock["type"];
        readonly fields: FieldsValue<TFields>;
      }>
    : never;

export type BlocksValue<TBlocks extends readonly BlockDefinition[]> =
  readonly BlockValue<TBlocks[number]>[];

export type BlocksFieldDefinition<
  TBlocks extends readonly BlockDefinition[] = readonly BlockDefinition[],
  TOptions extends FieldOptions<BlocksValue<TBlocks>> = FieldOptions<BlocksValue<TBlocks>>,
> = FieldDefinition<
  BlocksValue<TBlocks>,
  FieldRequired<TOptions>,
  FieldHasDefault<TOptions>,
  "blocks"
> & {
  readonly blocks: TBlocks;
} & TOptions;

export type ComputedFieldDefinition<
  TValue extends CmsValue = CmsValue,
  TOptions extends Omit<FieldOptions<TValue>, "required" | "defaultValue"> = Omit<
    FieldOptions<TValue>,
    "required" | "defaultValue"
  >,
> = FieldDefinition<
  TValue,
  false,
  false,
  "computed"
> & {
  readonly compute: (
    context: FieldValidationContext & { readonly fields: CmsFields },
  ) => TValue | Promise<TValue>;
} & TOptions;

export type CustomFieldDefinition<
  TValue extends CmsValue = CmsValue,
  TOptions extends FieldOptions<TValue> = FieldOptions<TValue>,
> = FieldDefinition<TValue, FieldRequired<TOptions>, FieldHasDefault<TOptions>, "custom"> &
  TOptions & {
    readonly name: string;
    readonly is: (value: unknown) => value is TValue;
  };

export type FieldValidationIssue = Readonly<{
  readonly path: string;
  readonly code: string;
  readonly message: string;
}>;
