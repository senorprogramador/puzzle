import type { FrameworkAdapterCapabilities } from "./framework-adapter";
import type {
  DeferredLoadingBehavior,
  FoldConfiguration,
  FoldConfigurationInput,
  FoldConfigurationLayers,
  FoldPriority,
  FoldStrategy,
  GlobalRenderingConfiguration,
  GlobalRenderingConfigurationInput,
  OptimizationEngineConfiguration,
  OptimizationProfile,
  OptimizationProfileOverrides,
  OptimizationProfileResolutionOptions,
  OptimizationProfileDiagnostics,
  RenderMode,
} from "./types";

type MutableFoldConfigurationInput = {
  strategy?: FoldStrategy;
  renderMode?: RenderMode;
  priority?: FoldPriority;
  idleTimeoutMs?: number;
};

const FOLD_STRATEGIES = [
  "eager",
  "visible",
  "nearby",
  "idle",
  "auto",
] as const satisfies readonly FoldStrategy[];

const RENDER_MODES = [
  "ssr",
  "deferred",
  "static",
] as const satisfies readonly RenderMode[];

const FOLD_PRIORITIES = [
  "critical",
  "high",
  "normal",
  "low",
] as const satisfies readonly FoldPriority[];

const DEFERRED_LOADING_BEHAVIORS = [
  "on-activation",
  "proximity",
  "idle",
] as const satisfies readonly DeferredLoadingBehavior[];

const INTRINSIC_SIZING_MODES = ["off", "metadata"] as const;

const OPTIMIZATION_PROFILES = [
  "conservative",
  "balanced",
  "aggressive",
  "custom",
] as const satisfies readonly OptimizationProfile[];

const PROFILE_CONFIGURATIONS: Readonly<
  Record<OptimizationProfile, OptimizationProfileOverrides>
> = Object.freeze({
  conservative: Object.freeze({
    strategy: "eager",
    renderMode: "ssr",
    priority: "normal",
    idleTimeoutMs: 1_000,
    rootMargin: "200px 0px",
    proximityThreshold: 0,
    prefetch: false,
    prefetchBudget: 2,
    resourceConcurrency: 2,
    maxConcurrentPrefetch: 1,
    resourceQueueLimit: 50,
    maxRetries: 1,
    maxCachedResources: 50,
    priorityQueueLimits: Object.freeze({
      critical: 25,
      high: 20,
      normal: 10,
      low: 5,
    }),
    adaptiveScheduling: false,
    contentVisibility: false,
    intrinsicSizing: "off",
    deferredLoadingBehavior: "on-activation",
  }),
  balanced: Object.freeze({
    strategy: "auto",
    renderMode: "ssr",
    priority: "normal",
    idleTimeoutMs: 1_000,
    rootMargin: "400px 0px",
    proximityThreshold: 0,
    prefetch: true,
    prefetchBudget: 12,
    resourceConcurrency: 3,
    maxConcurrentPrefetch: 2,
    resourceQueueLimit: 100,
    maxRetries: 1,
    maxCachedResources: 100,
    priorityQueueLimits: Object.freeze({
      critical: 100,
      high: 75,
      normal: 50,
      low: 25,
    }),
    adaptiveScheduling: true,
    contentVisibility: true,
    intrinsicSizing: "metadata",
    deferredLoadingBehavior: "proximity",
  }),
  aggressive: Object.freeze({
    strategy: "nearby",
    renderMode: "deferred",
    priority: "normal",
    idleTimeoutMs: 1_000,
    rootMargin: "800px 0px",
    proximityThreshold: 0,
    prefetch: true,
    prefetchBudget: 20,
    resourceConcurrency: 3,
    maxConcurrentPrefetch: 1,
    resourceQueueLimit: 50,
    maxRetries: 1,
    maxCachedResources: 100,
    priorityQueueLimits: Object.freeze({
      critical: 50,
      high: 30,
      normal: 15,
      low: 5,
    }),
    adaptiveScheduling: true,
    contentVisibility: true,
    intrinsicSizing: "metadata",
    deferredLoadingBehavior: "proximity",
  }),
  custom: Object.freeze({
    strategy: "eager",
    renderMode: "ssr",
    priority: "normal",
    idleTimeoutMs: 1_000,
    rootMargin: "200px 0px",
    proximityThreshold: 0,
    prefetch: false,
    prefetchBudget: 2,
    resourceConcurrency: 2,
    maxConcurrentPrefetch: 1,
    resourceQueueLimit: 50,
    maxRetries: 1,
    maxCachedResources: 50,
    priorityQueueLimits: Object.freeze({
      critical: 25,
      high: 20,
      normal: 10,
      low: 5,
    }),
    adaptiveScheduling: false,
    contentVisibility: false,
    intrinsicSizing: "off",
    deferredLoadingBehavior: "on-activation",
  }),
});

const FOLD_CONFIGURATION_KEYS = new Set([
  "strategy",
  "renderMode",
  "priority",
  "idleTimeoutMs",
]);

const OVERRIDE_KEYS = new Set([
  ...FOLD_CONFIGURATION_KEYS,
  "rootMargin",
  "proximityThreshold",
  "prefetch",
  "prefetchBudget",
  "resourceConcurrency",
  "maxConcurrentPrefetch",
  "resourceQueueLimit",
  "maxRetries",
  "maxCachedResources",
  "priorityQueueLimits",
  "adaptiveScheduling",
  "contentVisibility",
  "intrinsicSizing",
  "intrinsicSize",
  "deferredLoadingBehavior",
]);

const GLOBAL_CONFIGURATION_KEYS = new Set([
  "profile",
  "configuration",
  "optimization",
  "application",
  "route",
]);

const isRecord = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
};

const assertRecord = (value: unknown, name: string) => {
  if (!isRecord(value)) {
    throw new TypeError(`${name} must be an object.`);
  }

  return value;
};

const assertOnlyKeys = (
  value: Record<string, unknown>,
  allowedKeys: ReadonlySet<string>,
  name: string,
) => {
  for (const key of Reflect.ownKeys(value)) {
    if (typeof key !== "string" || !allowedKeys.has(key)) {
      throw new TypeError(
        `${name} contains an unsupported option: ${String(key)}.`,
      );
    }
  }
};

const isOneOf = <const T extends readonly string[]>(
  value: unknown,
  choices: T,
): value is T[number] =>
  typeof value === "string" && choices.some((choice) => choice === value);

const validateRootMargin = (value: unknown, name: string) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`${name} must be a non-empty CSS root margin.`);
  }

  const normalized = value.trim().replace(/\s+/g, " ");
  const values = normalized.split(" ");
  const validLength = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:px|%)$/i;
  if (
    values.length > 4 ||
    values.some((part) => part !== "0" && !validLength.test(part))
  ) {
    throw new TypeError(`${name} must contain CSS pixel or percentage lengths.`);
  }

  return normalized;
};

const validateNonNegativeInteger = (value: unknown, name: string) => {
  if (
    typeof value !== "number" ||
    !Number.isSafeInteger(value) ||
    value < 0
  ) {
    throw new TypeError(`${name} must be a non-negative integer.`);
  }
  return value;
};

const validatePriorityQueueLimits = (
  value: unknown,
): Readonly<Partial<Record<FoldPriority, number>>> => {
  const record = assertRecord(value, "optimization.priorityQueueLimits");
  assertOnlyKeys(
    record,
    new Set(FOLD_PRIORITIES),
    "optimization.priorityQueueLimits",
  );
  const limits: Partial<Record<FoldPriority, number>> = {};
  for (const priority of FOLD_PRIORITIES) {
    if (record[priority] !== undefined) {
      limits[priority] = validateNonNegativeInteger(
        record[priority],
        `optimization.priorityQueueLimits.${priority}`,
      );
    }
  }
  return Object.freeze(limits);
};

const validateOverrides = (
  value: unknown,
  name: string,
  allowedKeys: ReadonlySet<string> = OVERRIDE_KEYS,
): OptimizationProfileOverrides => {
  const record = assertRecord(value, name);
  assertOnlyKeys(record, allowedKeys, name);
  const overrides: Record<string, unknown> = {};

  if (record.strategy !== undefined) {
    if (!isOneOf(record.strategy, FOLD_STRATEGIES)) {
      throw new TypeError(`${name}.strategy is not a supported fold strategy.`);
    }
    overrides.strategy = record.strategy;
  }

  if (record.renderMode !== undefined) {
    if (!isOneOf(record.renderMode, RENDER_MODES)) {
      throw new TypeError(`${name}.renderMode is not a supported render mode.`);
    }
    overrides.renderMode = record.renderMode;
  }

  if (record.priority !== undefined) {
    if (!isOneOf(record.priority, FOLD_PRIORITIES)) {
      throw new TypeError(`${name}.priority is not a supported priority.`);
    }
    overrides.priority = record.priority;
  }

  if (record.idleTimeoutMs !== undefined) {
    overrides.idleTimeoutMs = validateNonNegativeInteger(
      record.idleTimeoutMs,
      `${name}.idleTimeoutMs`,
    );
  }

  if (record.rootMargin !== undefined) {
    overrides.rootMargin = validateRootMargin(
      record.rootMargin,
      `${name}.rootMargin`,
    );
  }

  if (record.proximityThreshold !== undefined) {
    const isThreshold = (value: unknown): value is number =>
      typeof value === "number" &&
      Number.isFinite(value) &&
      value >= 0 &&
      value <= 1;
    if (typeof record.proximityThreshold === "number") {
      if (!isThreshold(record.proximityThreshold)) {
        throw new TypeError(
          `${name}.proximityThreshold must contain values between 0 and 1.`,
        );
      }
      overrides.proximityThreshold = record.proximityThreshold;
    } else if (
      Array.isArray(record.proximityThreshold) &&
      record.proximityThreshold.length > 0 &&
      record.proximityThreshold.every(isThreshold)
    ) {
      overrides.proximityThreshold = Object.freeze([
        ...record.proximityThreshold,
      ]);
    } else {
      throw new TypeError(
        `${name}.proximityThreshold must be a number or a non-empty array of values between 0 and 1.`,
      );
    }
  }

  for (const key of [
    "prefetch",
    "adaptiveScheduling",
    "contentVisibility",
  ] as const) {
    if (record[key] !== undefined) {
      if (typeof record[key] !== "boolean") {
        throw new TypeError(`${name}.${key} must be a boolean.`);
      }
      overrides[key] = record[key];
    }
  }

  for (const key of [
    "prefetchBudget",
    "resourceConcurrency",
    "maxConcurrentPrefetch",
    "resourceQueueLimit",
    "maxRetries",
    "maxCachedResources",
  ] as const) {
    if (record[key] !== undefined) {
      overrides[key] = validateNonNegativeInteger(record[key], `${name}.${key}`);
    }
  }

  if (record.resourceConcurrency === 0) {
    throw new TypeError(`${name}.resourceConcurrency must be a positive integer.`);
  }

  if (record.intrinsicSizing !== undefined) {
    if (!isOneOf(record.intrinsicSizing, INTRINSIC_SIZING_MODES)) {
      throw new TypeError(`${name}.intrinsicSizing is not supported.`);
    }
    overrides.intrinsicSizing = record.intrinsicSizing;
  }

  if (record.intrinsicSize !== undefined) {
    if (
      typeof record.intrinsicSize !== "string" ||
      record.intrinsicSize.trim().length === 0 ||
      /[;{}\r\n]/.test(record.intrinsicSize)
    ) {
      throw new TypeError(`${name}.intrinsicSize must be a non-empty CSS size.`);
    }
    overrides.intrinsicSize = record.intrinsicSize.trim();
  }

  if (record.deferredLoadingBehavior !== undefined) {
    if (!isOneOf(record.deferredLoadingBehavior, DEFERRED_LOADING_BEHAVIORS)) {
      throw new TypeError(
        `${name}.deferredLoadingBehavior is not a supported behavior.`,
      );
    }
    overrides.deferredLoadingBehavior = record.deferredLoadingBehavior;
  }

  if (record.priorityQueueLimits !== undefined) {
    overrides.priorityQueueLimits = validatePriorityQueueLimits(
      record.priorityQueueLimits,
    );
  }

  return Object.freeze(overrides) as OptimizationProfileOverrides;
};

const mergeOverrides = (
  ...inputs: readonly (OptimizationProfileOverrides | undefined)[]
): OptimizationProfileOverrides => {
  const merged: Record<string, unknown> = {};
  const priorityQueueLimits: Partial<Record<FoldPriority, number>> = {};
  let hasPriorityQueueLimits = false;

  for (const input of inputs) {
    if (input === undefined) continue;
    for (const [key, value] of Object.entries(input)) {
      if (key === "priorityQueueLimits") {
        Object.assign(priorityQueueLimits, value);
        hasPriorityQueueLimits = true;
      } else {
        merged[key] = value;
      }
    }
  }

  if (hasPriorityQueueLimits) {
    merged.priorityQueueLimits = Object.freeze(priorityQueueLimits);
  }
  return Object.freeze(merged) as OptimizationProfileOverrides;
};

const mergeConfigurationInputs = (
  ...inputs: readonly (FoldConfigurationInput | undefined)[]
): MutableFoldConfigurationInput => {
  const merged: MutableFoldConfigurationInput = {};

  for (const input of inputs) {
    if (input === undefined) continue;
    const configuration = validateOverrides(
      input,
      "configuration",
      FOLD_CONFIGURATION_KEYS,
    );

    if (configuration.strategy !== undefined) {
      merged.strategy = configuration.strategy;
    }
    if (configuration.renderMode !== undefined) {
      merged.renderMode = configuration.renderMode;
    }
    if (configuration.priority !== undefined) {
      merged.priority = configuration.priority;
    }
    if (configuration.idleTimeoutMs !== undefined) {
      merged.idleTimeoutMs = configuration.idleTimeoutMs;
    }
  }

  return merged;
};

const completeConfiguration = (
  configuration: MutableFoldConfigurationInput,
): FoldConfiguration =>
  Object.freeze({
    strategy: configuration.strategy ?? "eager",
    renderMode: configuration.renderMode ?? "ssr",
    priority: configuration.priority ?? "normal",
    idleTimeoutMs: configuration.idleTimeoutMs ?? 1_000,
  });

const foldConfigurationOf = (
  overrides: OptimizationProfileOverrides,
): FoldConfigurationInput => ({
  ...(overrides.strategy === undefined
    ? {}
    : { strategy: overrides.strategy }),
  ...(overrides.renderMode === undefined
    ? {}
    : { renderMode: overrides.renderMode }),
  ...(overrides.priority === undefined
    ? {}
    : { priority: overrides.priority }),
  ...(overrides.idleTimeoutMs === undefined
    ? {}
    : { idleTimeoutMs: overrides.idleTimeoutMs }),
});

const completeOptimizationConfiguration = (
  overrides: OptimizationProfileOverrides,
): OptimizationEngineConfiguration => {
  const resourceConcurrency = overrides.resourceConcurrency ?? 2;
  const maxConcurrentPrefetch =
    overrides.maxConcurrentPrefetch ??
    Math.min(
      PROFILE_CONFIGURATIONS.balanced.maxConcurrentPrefetch ?? 1,
      resourceConcurrency,
    );

  if (
    maxConcurrentPrefetch < 1 ||
    maxConcurrentPrefetch > resourceConcurrency
  ) {
    throw new TypeError(
      "maxConcurrentPrefetch must be a positive integer no greater than resourceConcurrency.",
    );
  }

  const basePriorityLimits = {
    critical: 100,
    high: 75,
    normal: 50,
    low: 25,
  } satisfies Record<FoldPriority, number>;

  return Object.freeze({
    rootMargin: overrides.rootMargin ?? "400px 0px",
    proximityThreshold: overrides.proximityThreshold ?? 0,
    prefetch: overrides.prefetch ?? false,
    prefetchBudget: overrides.prefetchBudget ?? 12,
    resourceConcurrency,
    maxConcurrentPrefetch,
    resourceQueueLimit: overrides.resourceQueueLimit ?? 100,
    maxRetries: overrides.maxRetries ?? 1,
    maxCachedResources: overrides.maxCachedResources ?? 100,
    priorityQueueLimits: Object.freeze({
      ...basePriorityLimits,
      ...overrides.priorityQueueLimits,
    }),
    adaptiveScheduling: overrides.adaptiveScheduling ?? false,
    contentVisibility: overrides.contentVisibility ?? false,
    intrinsicSizing: overrides.intrinsicSizing ?? "off",
    ...(overrides.intrinsicSize === undefined
      ? {}
      : { intrinsicSize: overrides.intrinsicSize }),
    deferredLoadingBehavior:
      overrides.deferredLoadingBehavior ?? "on-activation",
  });
};

const hasOverrides = (value: unknown) =>
  isRecord(value) && Reflect.ownKeys(value).length > 0;

const getFrameworkRestrictions = (
  configuration: FoldConfiguration,
  capabilities: FrameworkAdapterCapabilities | undefined,
) => {
  if (!capabilities) return Object.freeze([] as string[]);
  const restrictions: string[] = [];

  if (
    (configuration.strategy === "visible" ||
      configuration.strategy === "nearby" ||
      configuration.strategy === "auto") &&
    !capabilities.supportsVisibility
  ) {
    restrictions.push("visibility-strategy");
  }
  if (
    configuration.strategy === "idle" &&
    !capabilities.supportsIdleScheduling
  ) {
    restrictions.push("idle-strategy");
  }
  if (
    configuration.renderMode === "deferred" &&
    !capabilities.supportsDeferredRendering
  ) {
    restrictions.push("deferred-rendering");
  }
  return Object.freeze(restrictions);
};

export const DEFAULT_FOLD_CONFIGURATION: FoldConfiguration =
  completeConfiguration({});

export const resolveOptimizationProfile = (
  input: unknown = {},
  options: OptimizationProfileResolutionOptions = {},
): GlobalRenderingConfiguration => {
  const record = assertRecord(input, "global configuration");
  assertOnlyKeys(record, GLOBAL_CONFIGURATION_KEYS, "global configuration");

  const profileValue =
    record.profile === undefined ? "balanced" : record.profile;
  if (!isOneOf(profileValue, OPTIMIZATION_PROFILES)) {
    throw new TypeError(
      "global configuration.profile is not a supported optimization profile.",
    );
  }

  const profileConfiguration = PROFILE_CONFIGURATIONS[profileValue];
  const optimization = validateOverrides(
    record.optimization ?? {},
    "global configuration.optimization",
  );
  const application = validateOverrides(
    record.application ?? {},
    "global configuration.application",
  );
  const route = validateOverrides(
    record.route ?? {},
    "global configuration.route",
  );
  const legacyConfiguration =
    record.configuration === undefined
      ? undefined
      : validateOverrides(
          record.configuration,
          "global configuration.configuration",
          FOLD_CONFIGURATION_KEYS,
        );

  const mergedOverrides = mergeOverrides(
    profileConfiguration,
    optimization,
    application,
    legacyConfiguration,
    route,
  );
  const configuration = completeConfiguration(
    mergeConfigurationInputs(
      foldConfigurationOf(profileConfiguration),
      foldConfigurationOf(optimization),
      foldConfigurationOf(application),
      legacyConfiguration === undefined
        ? undefined
        : foldConfigurationOf(legacyConfiguration),
      foldConfigurationOf(route),
    ),
  );

  const hasCustomPrefetchConcurrency = [
    optimization,
    application,
    route,
  ].some((layer) => layer.maxConcurrentPrefetch !== undefined);
  const completeOverrides =
    hasCustomPrefetchConcurrency ||
    mergedOverrides.resourceConcurrency === undefined
      ? mergedOverrides
      : Object.freeze({
          ...mergedOverrides,
          maxConcurrentPrefetch: Math.min(
            mergedOverrides.maxConcurrentPrefetch ?? 1,
            mergedOverrides.resourceConcurrency,
          ),
        });
  const engineConfiguration =
    completeOptimizationConfiguration(completeOverrides);
  const appliedOverrides = Object.freeze([
    ...(hasOverrides(record.optimization) ? ["custom"] : []),
    ...(hasOverrides(record.application) ? ["application"] : []),
    ...(hasOverrides(record.configuration) ? ["configuration"] : []),
    ...(hasOverrides(record.route) ? ["route"] : []),
  ]);
  const hasExplicitRenderingOverrides = [
    optimization,
    application,
    legacyConfiguration,
    route,
  ].some(
    (layer) =>
      layer?.strategy !== undefined || layer?.renderMode !== undefined,
  );

  const diagnostics: OptimizationProfileDiagnostics | undefined =
    options.diagnostics === true
      ? Object.freeze({
          selectedProfile: profileValue,
          appliedOverrides,
          disabledOptimizations: Object.freeze([
            ...(engineConfiguration.prefetch ? [] : ["prefetch"]),
            ...(engineConfiguration.adaptiveScheduling
              ? []
              : ["adaptive-scheduling"]),
            ...(engineConfiguration.contentVisibility
              ? []
              : ["content-visibility"]),
            ...(engineConfiguration.intrinsicSizing === "metadata"
              ? []
              : ["intrinsic-sizing"]),
          ]),
          frameworkRestrictions: getFrameworkRestrictions(
            configuration,
            options.capabilities,
          ),
        })
      : undefined;

  return Object.freeze({
    profile: profileValue,
    configuration,
    optimization: engineConfiguration,
    ...(hasExplicitRenderingOverrides
      ? { hasExplicitRenderingOverrides: true }
      : {}),
    ...(diagnostics === undefined ? {} : { diagnostics }),
  });
};

export const DEFAULT_GLOBAL_RENDERING_CONFIGURATION =
  resolveOptimizationProfile();

export const normalizeFoldConfiguration = (
  input: unknown = {},
): FoldConfiguration =>
  completeConfiguration(mergeConfigurationInputs(input as FoldConfigurationInput));

export const normalizeGlobalRenderingConfiguration = (
  input: unknown = {},
): GlobalRenderingConfiguration => resolveOptimizationProfile(input);

export const resolveFoldConfiguration = (
  layers: FoldConfigurationLayers = {},
): FoldConfiguration => {
  const globalConfiguration =
    layers.global?.configuration ??
    DEFAULT_GLOBAL_RENDERING_CONFIGURATION.configuration;

  return completeConfiguration(
    mergeConfigurationInputs(
      globalConfiguration,
      layers.component?.configuration,
      layers.boundary?.configuration,
      layers.override,
    ),
  );
};
