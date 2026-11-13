export type Brand<T, Name extends string> = T & {
  readonly __brand: Name;
};

export type SeoUrl = Brand<string, "SeoUrl">;
export type SeoNodeId = Brand<string, "SeoNodeId">;
export type SeoLocale = Brand<string, "SeoLocale">;

export type JsonPrimitive = string | number | boolean | null;

export type JsonValue =
  | JsonPrimitive
  | JsonValue[]
  | {
      [key: string]: JsonValue;
    };

export type JsonObject = {
  [key: string]: JsonValue;
};

export type SeoNodeType = string | string[];

export interface SeoNode {
  "@id"?: SeoNodeId | string;
  "@type": SeoNodeType;
  "@context"?: string | Record<string, JsonValue>;
  [key: string]: unknown;
}

export interface SeoGraph {
  "@context"?: string | Record<string, JsonValue>;
  "@graph": SeoNode[];
}

export interface SeoGraphOptions {
  baseUrl?: string;
  locale?: SeoLocale | string;
  context?: string | Record<string, JsonValue>;
  rootIds?: string[];
}

export interface SeoNodeReference {
  "@id": SeoNodeId | string;
}

export interface SeoMetadata {
  title?: string;
  description?: string;
  canonical?: SeoUrl | string;
  robots?: string;
}

export type SeoValidationSeverity = "error" | "warning" | "info";

export interface SeoValidationIssue {
  code: string;
  message: string;
  severity: SeoValidationSeverity;
  path?: string;
  nodeId?: string;
  property?: string;
}

export interface SeoValidationResult {
  valid: boolean;
  issues: SeoValidationIssue[];
}

export interface SeoSerializationOptions {
  pretty?: boolean;
  safe?: boolean;
  scriptSafe?: boolean;
}

export interface SeoSerializationResult {
  value: string;
  errors: SeoValidationIssue[];
}

export interface SeoReference {
  id: SeoNodeId | string;
}

export interface SeoGraphRoot {
  id: SeoNodeId | string;
  primary?: boolean;
}

export type SeoGraphConflictStrategy =
  | "deterministic"
  | "first"
  | "last"
  | "error";

export interface SeoNodeOptions extends SeoGraphOptions {
  id?: string;
  type?: string;
}

export interface SeoGraphBuilderOptions extends SeoGraphOptions {
  conflictStrategy?: SeoGraphConflictStrategy;
  strictReferences?: boolean;
}

export interface SeoGraphBuilder {
  add(node: SeoNode): this;
  addMany(nodes: readonly SeoNode[]): this;
  build(): SeoGraph;
  getIssues(): readonly SeoValidationIssue[];
}

export interface SeoGraphValidationOptions {
  baseUrl?: string;
  strictReferences?: boolean;
  allowedExternalReferences?: boolean;
}

export interface SeoGraphSerializationOptions extends SeoSerializationOptions {
  includeContext?: boolean;
  validate?: boolean;
}
