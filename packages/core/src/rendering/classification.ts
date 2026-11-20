import type {
  ComponentClassification,
  ComponentClassificationConfiguration,
  ComponentRenderingMetadata,
  ComponentSemanticRole,
  FoldClientVisibility,
  FoldPrediction,
  FoldPriority,
  ResolvedFoldStrategy,
} from "./types";

export const DEFAULT_COMPONENT_ROLE_METADATA: Readonly<
  Record<ComponentSemanticRole, Partial<ComponentRenderingMetadata>>
> = Object.freeze({
  navigation: Object.freeze({
    priority: "critical",
    defaultFoldStrategy: "eager",
    defaultRenderMode: "ssr",
    componentKind: "dynamic",
    expectedInteractionCost: "high",
  }),
  "navigation-drawer": Object.freeze({
    priority: "low",
    defaultFoldStrategy: "idle",
    defaultRenderMode: "ssr",
    componentKind: "dynamic",
    expectedInteractionCost: "high",
  }),
  hero: Object.freeze({
    priority: "critical",
    defaultFoldStrategy: "eager",
    defaultRenderMode: "ssr",
    componentKind: "static",
    expectedInteractionCost: "none",
  }),
  "main-content": Object.freeze({
    priority: "high",
    defaultFoldStrategy: "auto",
    defaultRenderMode: "ssr",
  }),
  gallery: Object.freeze({
    priority: "normal",
    defaultFoldStrategy: "auto",
    defaultRenderMode: "ssr",
    componentKind: "dynamic",
    expectedInteractionCost: "medium",
  }),
  testimonials: Object.freeze({
    priority: "low",
    defaultFoldStrategy: "auto",
    defaultRenderMode: "ssr",
    componentKind: "static",
    expectedInteractionCost: "none",
  }),
  "interactive-map": Object.freeze({
    priority: "low",
    defaultFoldStrategy: "auto",
    defaultRenderMode: "ssr",
    componentKind: "dynamic",
    expectedInteractionCost: "high",
  }),
  footer: Object.freeze({
    priority: "low",
    defaultFoldStrategy: "auto",
    defaultRenderMode: "ssr",
    componentKind: "static",
    expectedInteractionCost: "none",
    positionHint: "below-fold",
  }),
  unknown: Object.freeze({}),
});

const COMPONENT_ROLES = new Set<ComponentSemanticRole>(
  Object.keys(DEFAULT_COMPONENT_ROLE_METADATA) as ComponentSemanticRole[],
);
const EXPENSIVE_COMPONENT_WEIGHT_BYTES = 256_000;

const assertNonNegativeFinite = (name: string, value: number | undefined) => {
  if (value !== undefined && (!Number.isFinite(value) || value < 0)) {
    throw new RangeError(`${name} must be a non-negative finite number.`);
  }
};

const mergeMetadata = (
  ...layers: readonly (Partial<ComponentRenderingMetadata> | undefined)[]
): ComponentRenderingMetadata => {
  const merged: Partial<ComponentRenderingMetadata> = {};
  const configuration: Record<string, unknown> = {};
  const resourceHints = new Map<string, NonNullable<
    ComponentRenderingMetadata["criticalResourceHints"]
  >[number]>();

  for (const layer of layers) {
    if (!layer) continue;
    Object.assign(merged, layer);
    if (layer.configuration) {
      Object.assign(configuration, layer.configuration);
    }
    for (const hint of layer.criticalResourceHints ?? []) {
      const key = [hint.type, hint.id, hint.url, hint.cacheKey]
        .filter((value) => value !== undefined)
        .join("|");
      resourceHints.set(key, Object.freeze({ ...hint }));
    }
  }

  return Object.freeze({
    ...merged,
    ...(Object.keys(configuration).length > 0
      ? { configuration: Object.freeze(configuration) }
      : {}),
    ...(resourceHints.size > 0
      ? { criticalResourceHints: Object.freeze([...resourceHints.values()]) }
      : {}),
  }) as ComponentRenderingMetadata;
};

export const mergeComponentClassificationConfigurations = (
  ...configurations: readonly (
    | ComponentClassificationConfiguration
    | undefined
  )[]
): ComponentClassificationConfiguration => {
  const roleDefaults: Partial<
    Record<ComponentSemanticRole, Partial<ComponentRenderingMetadata>>
  > = {};

  for (const configuration of configurations) {
    for (const [role, metadata] of Object.entries(
      configuration?.roleDefaults ?? {},
    )) {
      if (!COMPONENT_ROLES.has(role as ComponentSemanticRole)) {
        throw new TypeError(`Unsupported component role: ${role}.`);
      }

      const typedRole = role as ComponentSemanticRole;
      roleDefaults[typedRole] = mergeMetadata(
        roleDefaults[typedRole],
        metadata,
      );
    }
  }

  return Object.freeze({
    roleDefaults: Object.freeze(roleDefaults),
  });
};

export const classifyComponent = (
  metadata: ComponentRenderingMetadata = {},
  configuration: ComponentClassificationConfiguration = {},
  inheritedMetadata?: ComponentRenderingMetadata,
): ComponentClassification => {
  const role =
    metadata.role ?? inheritedMetadata?.role ?? "unknown";
  if (!COMPONENT_ROLES.has(role)) {
    throw new TypeError(`Unsupported component role: ${String(role)}.`);
  }

  const roleDefaults = mergeMetadata(
    DEFAULT_COMPONENT_ROLE_METADATA[role],
    configuration.roleDefaults?.[role],
  );
  const resolvedMetadata = mergeMetadata(
    roleDefaults,
    inheritedMetadata,
    metadata,
  );
  const documentOrder = resolvedMetadata.documentOrder;
  assertNonNegativeFinite("expectedWeightBytes", resolvedMetadata.expectedWeightBytes);
  assertNonNegativeFinite("dimensions.width", resolvedMetadata.dimensions?.width);
  assertNonNegativeFinite("dimensions.height", resolvedMetadata.dimensions?.height);
  assertNonNegativeFinite(
    "dimensions.aspectRatio",
    resolvedMetadata.dimensions?.aspectRatio,
  );
  assertNonNegativeFinite(
    "parentLayout.documentOffset",
    resolvedMetadata.parentLayout?.documentOffset,
  );
  assertNonNegativeFinite(
    "parentLayout.precedingContentHeight",
    resolvedMetadata.parentLayout?.precedingContentHeight,
  );
  assertNonNegativeFinite("parentLayout.paddingTop", resolvedMetadata.parentLayout?.paddingTop);
  assertNonNegativeFinite("parentLayout.gap", resolvedMetadata.parentLayout?.gap);
  for (const height of resolvedMetadata.parentLayout?.precedingSiblingHeights ?? []) {
    assertNonNegativeFinite("parentLayout.precedingSiblingHeights[]", height);
  }
  if (documentOrder !== undefined && !Number.isSafeInteger(documentOrder)) {
    throw new RangeError("documentOrder must be a non-negative safe integer.");
  }

  const priority: FoldPriority =
    resolvedMetadata.critical === true
      ? "critical"
      : (metadata.priority ??
        metadata.configuration?.priority ??
        inheritedMetadata?.priority ??
        inheritedMetadata?.configuration?.priority ??
        roleDefaults.priority ??
        "normal");
  const explicitClassification =
    metadata.critical !== undefined ||
    metadata.priority !== undefined ||
    metadata.configuration?.priority !== undefined;
  const hasRoleDefaults = role !== "unknown";

  return Object.freeze({
    role,
    priority,
    metadata: resolvedMetadata,
    confidence: explicitClassification ? 1 : hasRoleDefaults ? 0.9 : 0.1,
    reason: explicitClassification
      ? "Explicit component priority metadata."
      : hasRoleDefaults
        ? `Defaults for the declared "${role}" role.`
        : "No component metadata was supplied; using conservative defaults.",
  });
};

export type AutomaticFoldStrategyInput = Readonly<{
  classification: ComponentClassification;
  prediction: FoldPrediction;
  priority?: FoldPriority;
  visibility?: FoldClientVisibility;
  supportsVisibility: boolean;
  supportsIdleScheduling: boolean;
}>;

export type AutomaticFoldStrategyDecision = Readonly<{
  strategy: ResolvedFoldStrategy;
  reason: string;
}>;

const expensiveComponent = (metadata: ComponentRenderingMetadata) =>
  metadata.expectedInteractionCost === "high" ||
  (metadata.expectedWeightBytes !== undefined &&
    metadata.expectedWeightBytes >= EXPENSIVE_COMPONENT_WEIGHT_BYTES);

const selectDeferredStrategy = (
  input: AutomaticFoldStrategyInput,
  expensive: boolean,
): AutomaticFoldStrategyDecision => {
  const priority = input.priority ?? input.classification.priority;
  if (input.supportsVisibility) {
    if (priority === "low" && expensive) {
      return Object.freeze({
        strategy: input.supportsIdleScheduling ? "idle" : "visible",
        reason: "A non-critical component has a high estimated client cost.",
      });
    }
    return Object.freeze({
      strategy: priority === "low" ? "visible" : "nearby",
      reason: "The server predicts below-fold placement with useful confidence.",
    });
  }

  if (input.supportsIdleScheduling && expensive) {
    return Object.freeze({
      strategy: "idle",
      reason: "Idle scheduling is available but visibility observation is not.",
    });
  }

  return Object.freeze({
    strategy: "eager",
    reason: "The active framework cannot safely observe deferred placement.",
  });
};

export const selectAutomaticFoldStrategy = (
  input: AutomaticFoldStrategyInput,
): AutomaticFoldStrategyDecision => {
  const { classification, prediction, visibility = "unknown" } = input;
  const priority = input.priority ?? classification.priority;

  if (visibility === "visible") {
    return Object.freeze({
      strategy: "eager",
      reason: "The client confirmed that the component is visible.",
    });
  }

  if (
    priority === "critical" ||
    classification.metadata.critical === true ||
    prediction.result === "known-critical"
  ) {
    return Object.freeze({
      strategy: "eager",
      reason: "Critical content is available immediately.",
    });
  }

  if (visibility === "nearby") {
    return Object.freeze({
      strategy: "nearby",
      reason: "The client confirmed that the component is near the viewport.",
    });
  }

  if (
    prediction.result === "predicted-above-fold" &&
    prediction.confidence >= 0.5
  ) {
    return Object.freeze({
      strategy: "eager",
      reason: "The server predicts above-fold placement; SSR remains intact.",
    });
  }

  const expensive = expensiveComponent(classification.metadata);
  if (
    prediction.result === "predicted-below-fold" &&
    prediction.confidence >= 0.5
  ) {
    return selectDeferredStrategy(input, expensive);
  }

  if (
    prediction.result === "unknown" &&
    priority === "low" &&
    expensive &&
    input.supportsIdleScheduling
  ) {
    return Object.freeze({
      strategy: "idle",
      reason:
        "Only a non-critical client resource is eligible for idle scheduling without position evidence.",
    });
  }

  return Object.freeze({
    strategy: "eager",
    reason: "Position evidence is insufficient for safe component deferral.",
  });
};
