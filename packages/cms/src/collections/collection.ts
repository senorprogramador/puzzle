import type {
  CmsAccessAction,
  CmsAccessRequest,
  CmsContext,
  CmsEntryView,
} from "../types";
import type { CmsActor } from "../types";
import type {
  BlockDefinition,
  FieldDescriptor,
  FieldMap,
  FieldsValue,
} from "../fields";
export type { FieldMap } from "../fields";

export type CollectionKind = "collection" | "singleton";

export type CollectionLocalization = {
  readonly locales: readonly string[];
  readonly defaultLocale?: string;
};

export type CmsCollectionHookOperation =
  | "create"
  | "update"
  | "publish"
  | "unpublish"
  | "schedule"
  | "unschedule"
  | "archive"
  | "delete"
  | "restore"
  | "scheduled-publish";

export type CmsCollectionHookEvent<TFields extends FieldMap> = {
  readonly operation: CmsCollectionHookOperation;
  readonly context: CmsContext;
  readonly contentType: string;
  readonly entryId?: string;
  readonly fields?: Partial<FieldsValue<TFields>>;
  readonly current?: CmsEntryView;
};

type BivariantCallback<TInput, TOutput> = {
  bivarianceHack(input: TInput): TOutput;
}["bivarianceHack"];

export type CmsCollectionHooks<TFields extends FieldMap = FieldMap> = {
  readonly beforeChange?: BivariantCallback<
    CmsCollectionHookEvent<TFields>,
    void | Promise<void>
  >;
  readonly afterChange?: BivariantCallback<
    CmsCollectionHookEvent<TFields> & { readonly entry: CmsEntryView },
    void | Promise<void>
  >;
};

export type CollectionAccessAction =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "publish"
  | "unpublish"
  | "schedule"
  | "unschedule"
  | "archive"
  | "restore"
  | "revisions"
  | "translations";

export type CmsCollectionAccessRequest = Omit<CmsAccessRequest, "action"> & {
  readonly action: CmsAccessAction | CollectionAccessAction;
  readonly user: CmsActor | null;
};

export type CmsCollectionAccessPolicy = {
  bivarianceHack(
    request: CmsCollectionAccessRequest,
  ): boolean | Promise<boolean>;
}["bivarianceHack"];

export type CollectionAccess = Partial<
  Readonly<
    Record<CmsAccessAction | CollectionAccessAction, CmsCollectionAccessPolicy>
  >
>;

export type CollectionOptions<TFields extends FieldMap = FieldMap> = {
  readonly fields: TFields;
  readonly name?: string;
  readonly description?: string;
  readonly version?: number;
  readonly drafts?: boolean;
  readonly timestamps?: boolean;
  readonly localization?: CollectionLocalization;
  readonly access?: CollectionAccess;
  readonly hooks?: CmsCollectionHooks<TFields>;
};

type CollectionFactoryOptions<TFields extends FieldMap> = Omit<
  CollectionOptions<TFields>,
  "fields"
>;

export type CollectionDefinition<
  TFields extends FieldMap = FieldMap,
  TKind extends CollectionKind = CollectionKind,
  TOptions extends CollectionOptions<TFields> = CollectionOptions<TFields>,
> = TOptions & {
  readonly kind: TKind;
};

type CmsPresentationFieldBase<TField extends FieldDescriptor> = Omit<
  TField,
  "access" | "validate" | "compute" | "is" | "fields" | "of" | "blocks"
>;

export type CmsPresentationField<
  TField extends FieldDescriptor = FieldDescriptor,
> = TField extends {
  readonly type: "array";
  readonly of: infer TChild extends FieldDescriptor;
}
  ? CmsPresentationFieldBase<TField> & {
      readonly of: CmsPresentationField<TChild>;
    }
  : TField extends {
        readonly type: "object";
        readonly fields: infer TChildren extends FieldMap;
      }
    ? CmsPresentationFieldBase<TField> & {
        readonly fields: CmsPresentationFields<TChildren>;
      }
    : TField extends {
          readonly type: "blocks";
          readonly blocks: readonly (infer TBlock extends BlockDefinition)[];
        }
      ? CmsPresentationFieldBase<TField> & {
          readonly blocks: readonly CmsPresentationBlock<TBlock>[];
        }
      : CmsPresentationFieldBase<TField>;

export type CmsPresentationBlock<TBlock extends BlockDefinition> = Omit<
  TBlock,
  "fields"
> & {
  readonly fields: CmsPresentationFields<TBlock["fields"]>;
};

export type CmsPresentationFields<TFields extends FieldMap> = {
  readonly [TKey in keyof TFields]: CmsPresentationField<TFields[TKey]>;
};

export type CmsCollectionPresentation<
  TFields extends FieldMap = FieldMap,
  TKind extends CollectionKind = CollectionKind,
  TOptions extends CollectionOptions<TFields> = CollectionOptions<TFields>,
> = Omit<
  CollectionDefinition<TFields, TKind, TOptions>,
  "access" | "hooks" | "fields"
> & {
  readonly fields: CmsPresentationFields<TFields>;
};

export type CmsPresentationCollection<TCollection> =
  TCollection extends CollectionDefinition<
    infer TFields,
    infer TKind,
    infer TOptions
  >
    ? CmsCollectionPresentation<TFields, TKind, TOptions>
    : never;

export type CmsCollectionRuntimeOptions = {
  readonly drafts?: boolean;
  readonly timestamps?: boolean;
  readonly access?: CollectionAccess;
  readonly hooks?: CmsCollectionHooks;
};

export interface CollectionFactory {
  <
    const TFields extends FieldMap,
    const TOptions extends CollectionFactoryOptions<TFields>,
  >(
    options: { readonly fields: TFields } & TOptions,
  ): CollectionDefinition<TFields, "collection", { readonly fields: TFields } & TOptions>;
  singleton<
    const TFields extends FieldMap,
    const TOptions extends CollectionFactoryOptions<TFields>,
  >(
    options: { readonly fields: TFields } & TOptions,
  ): CollectionDefinition<TFields, "singleton", { readonly fields: TFields } & TOptions>;
}

const createCollectionDefinition = <
  const TFields extends FieldMap,
  const TKind extends CollectionKind,
  const TOptions extends CollectionFactoryOptions<TFields>,
>(
  kind: TKind,
  options: { readonly fields: TFields } & TOptions,
): CollectionDefinition<TFields, TKind, { readonly fields: TFields } & TOptions> => ({
  ...options,
  kind,
});

export const collection: CollectionFactory = Object.assign(
  <
    const TFields extends FieldMap,
    const TOptions extends CollectionFactoryOptions<TFields>,
  >(
    options: { readonly fields: TFields } & TOptions,
  ): CollectionDefinition<TFields, "collection", { readonly fields: TFields } & TOptions> =>
    createCollectionDefinition("collection", options),
  {
    singleton: <
      const TFields extends FieldMap,
      const TOptions extends CollectionFactoryOptions<TFields>,
    >(
      options: { readonly fields: TFields } & TOptions,
    ): CollectionDefinition<TFields, "singleton", { readonly fields: TFields } & TOptions> =>
      createCollectionDefinition("singleton", options),
  },
);
