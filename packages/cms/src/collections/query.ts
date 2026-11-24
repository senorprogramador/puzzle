import type { CmsEntryStatus, CmsValue, CmsVisibility } from "../types";
import { CmsValidationError } from "../errors";
import type { FieldMap } from "./collection";
import type { FieldsValue } from "../fields";
import type {
  CollectionLocalization,
  CollectionOptions,
} from "./collection";

export type CmsWhereOperator =
  | "equals"
  | "notEquals"
  | "contains"
  | "in"
  | "notIn"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "greaterThan"
  | "greaterThanOrEqual"
  | "lessThan"
  | "lessThanOrEqual"
  | "exists";

export type CmsEntryWhereNode =
  | {
      readonly field: string;
      readonly operator: CmsWhereOperator;
      readonly value: CmsValue | readonly CmsValue[];
    }
  | { readonly and: readonly CmsEntryWhereNode[] }
  | { readonly or: readonly CmsEntryWhereNode[] };

type ContainsValue<TValue> =
  NonNullable<TValue> extends readonly (infer TItem)[]
    ? TItem
    : NonNullable<TValue> extends string
      ? string
      : never;

type NestedObjectPaths<TFields extends FieldMap> = {
  [TKey in keyof TFields & string]: TFields[TKey] extends {
    readonly type: "object";
    readonly fields: infer TChildren extends FieldMap;
  }
    ? `${TKey}.${CmsFieldPath<TChildren>}`
    : never;
}[keyof TFields & string];

export type CmsFieldPath<TFields extends FieldMap> =
  | Extract<keyof TFields, string>
  | NestedObjectPaths<TFields>;

type CmsSystemFieldValues = {
  readonly id: string;
  readonly slug: string;
  readonly locale: string;
  readonly status: CmsEntryStatus;
  readonly publishedAt: string;
  readonly createdAt: string;
  readonly updatedAt: string;
};

type ValueAtFieldPath<TFields extends FieldMap, TPath extends string> =
  TPath extends keyof FieldsValue<TFields>
    ? FieldsValue<TFields>[TPath]
    : TPath extends keyof CmsSystemFieldValues
      ? CmsSystemFieldValues[TPath]
      : TPath extends `${infer TRoot}.${infer TRest}`
        ? TRoot extends keyof TFields
          ? TFields[TRoot] extends {
              readonly type: "object";
              readonly fields: infer TChildren extends FieldMap;
            }
            ? ValueAtFieldPath<TChildren, TRest>
            : never
          : never
        : never;

type FilterOperators<TValue> = {
  readonly equals?: TValue;
  readonly notEquals?: TValue;
  readonly contains?: ContainsValue<TValue>;
  readonly in?: readonly TValue[];
  readonly notIn?: readonly TValue[];
  readonly gt?: TValue;
  readonly gte?: TValue;
  readonly lt?: TValue;
  readonly lte?: TValue;
  readonly greaterThan?: TValue;
  readonly greaterThanOrEqual?: TValue;
  readonly lessThan?: TValue;
  readonly lessThanOrEqual?: TValue;
  readonly exists?: boolean;
};

export type CmsWhere<TFields extends FieldMap> = {
  readonly [TKey in CmsFieldPath<TFields> | keyof CmsSystemFieldValues]?: FilterOperators<
    ValueAtFieldPath<TFields, Extract<TKey, string>>
  >;
} & {
  readonly and?: readonly CmsWhere<TFields>[];
  readonly or?: readonly CmsWhere<TFields>[];
};

export type CmsSortKey<TFields extends FieldMap> = Extract<
  CmsFieldPath<TFields> | keyof CmsSystemFieldValues,
  string
>;

export type CmsSort<TFields extends FieldMap> =
  | CmsSortKey<TFields>
  | `-${CmsSortKey<TFields>}`;

type LocaleQueryInput<TOptions> =
  TOptions extends { readonly localization: CollectionLocalization }
    ? { readonly locale?: string }
    : { readonly locale?: never };

export type CmsCollectionFindInput<
  TFields extends FieldMap,
  TOptions extends CollectionOptions<TFields> = CollectionOptions<TFields>,
> = {
  readonly where?: CmsWhere<TFields>;
  readonly sort?: CmsSort<TFields>;
  readonly limit?: number;
  readonly page?: number;
  readonly after?: string;
  readonly visibility?: CmsVisibility;
} & LocaleQueryInput<TOptions>;

export type CmsCollectionPage<TDocument> = {
  readonly items: readonly TDocument[];
  readonly page: number;
  readonly limit: number;
  readonly nextCursor: string | null;
  readonly hasNextPage: boolean;
};

export type CmsCollectionReadOptions<
  TOptions extends CollectionOptions<FieldMap> = CollectionOptions<FieldMap>,
> = {
  readonly visibility?: CmsVisibility;
} & LocaleQueryInput<TOptions>;

const isRecord = (value: unknown): value is Readonly<Record<string, unknown>> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const operators: Readonly<Record<string, CmsWhereOperator>> = {
  equals: "equals",
  notEquals: "notEquals",
  contains: "contains",
  in: "in",
  notIn: "notIn",
  gt: "gt",
  gte: "gte",
  lt: "lt",
  lte: "lte",
  greaterThan: "greaterThan",
  greaterThanOrEqual: "greaterThanOrEqual",
  lessThan: "lessThan",
  lessThanOrEqual: "lessThanOrEqual",
  exists: "exists",
};

const isCmsValue = (
  value: unknown,
  seen = new Set<object>(),
): value is CmsValue => {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return true;
  }
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value !== "object" || seen.has(value)) return false;
  seen.add(value);
  const valid = Array.isArray(value)
    ? value.every((item) => isCmsValue(item, seen))
    : Object.getPrototypeOf(value) === Object.prototype &&
      Object.values(value).every((item) => isCmsValue(item, seen));
  seen.delete(value);
  return valid;
};

const isCmsValueArray = (value: unknown): value is readonly CmsValue[] =>
  Array.isArray(value) && value.every((item) => isCmsValue(item));

const whereNodes = (value: unknown): readonly CmsEntryWhereNode[] => {
  if (!isRecord(value)) {
    throw new CmsValidationError([
      { path: "where", code: "type", message: "Where must be an object." },
    ]);
  }

  const nodes: CmsEntryWhereNode[] = [];
  for (const [field, condition] of Object.entries(value)) {
    if (field === "and" || field === "or") {
      if (!Array.isArray(condition)) {
        throw new CmsValidationError([
          {
            path: `where.${field}`,
            code: "type",
            message: `Where ${field} must be an array.`,
          },
        ]);
      }
      const children = condition.flatMap(whereNodes);
      nodes.push(field === "and" ? { and: children } : { or: children });
      continue;
    }
    if (!field.trim() || !isRecord(condition)) {
      throw new CmsValidationError([
        {
          path: `where.${field}`,
          code: "type",
          message: "Each field condition must be an operator object.",
        },
      ]);
    }

    for (const [operatorName, operand] of Object.entries(condition)) {
      const operator = operators[operatorName];
      if (!operator) {
        throw new CmsValidationError([
          {
            path: `where.${field}.${operatorName}`,
            code: "operator",
            message: `Unsupported where operator "${operatorName}".`,
          },
        ]);
      }

      if (operator === "exists") {
        if (typeof operand === "boolean") {
          nodes.push({ field, operator, value: operand });
        } else {
          throw new CmsValidationError([
            {
              path: `where.${field}.exists`,
              code: "type",
              message: "The exists operator requires a boolean.",
            },
          ]);
        }
        continue;
      }

      if (operator === "in" || operator === "notIn") {
        if (isCmsValueArray(operand)) {
          nodes.push({ field, operator, value: operand });
        } else {
          throw new CmsValidationError([
            {
              path: `where.${field}.${operator}`,
              code: "type",
              message: `The ${operator} operator requires an array of values.`,
            },
          ]);
        }
        continue;
      }

      if (operator === "contains") {
        if (isCmsValue(operand)) {
          nodes.push({ field, operator, value: operand });
        } else {
          throw new CmsValidationError([
            {
              path: `where.${field}.contains`,
              code: "serialization",
              message: "Filter values must be finite JSON-compatible values.",
            },
          ]);
        }
        continue;
      }

      if (!isCmsValue(operand)) {
        throw new CmsValidationError([
          {
            path: `where.${field}.${operator}`,
            code: "serialization",
            message: "Filter values must be finite JSON-compatible values.",
          },
        ]);
      }
      nodes.push({ field, operator, value: operand });
    }
  }
  return nodes;
};

export const normalizeWhere = <TFields extends FieldMap>(
  where: CmsWhere<TFields> | undefined,
): readonly CmsEntryWhereNode[] => where === undefined ? [] : whereNodes(where);

export type CmsQueryFieldValue<
  TFields extends FieldMap,
  TPath extends CmsSortKey<TFields> = CmsSortKey<TFields>,
> = ValueAtFieldPath<TFields, TPath>;
