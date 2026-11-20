import {
  DEFAULT_FRAMEWORK_ADAPTER_CAPABILITIES,
  type FrameworkAdapterCapabilities,
} from "./framework-adapter";
import {
  classifyComponent,
  selectAutomaticFoldStrategy,
} from "./classification";
import {
  DEFAULT_GLOBAL_RENDERING_CONFIGURATION,
  resolveFoldConfiguration,
} from "./configuration";
import { predictFoldPosition } from "./prediction";
import type {
  ComponentClassification,
  ComponentClassificationConfiguration,
  FoldClientVisibility,
  FoldConfigurationLayers,
  FoldPriority,
  FoldPrediction,
  FoldPredictionInput,
  FoldStrategy,
  OptimizationProfile,
  RenderMode,
  ResolvedFoldStrategy,
  RenderingConstraints,
} from "./types";

export type OptimizationDecisionSource =
  | "developer-override"
  | "boundary-prop"
  | "accessibility-functionality"
  | "framework-capability"
  | "component-metadata"
  | "automatic-classification"
  | "component-functionality"
  | "global-profile"
  | "safe-default";

export type RenderingPolicy = FoldConfigurationLayers &
  Readonly<{
    constraints?: RenderingConstraints;
    capabilities?: FrameworkAdapterCapabilities;
    classification?: ComponentClassificationConfiguration;
    prediction?: FoldPredictionInput;
    clientVisibility?: FoldClientVisibility;
    diagnostics?: boolean;
  }>;

export type OptimizationDecisionDiagnostics = Readonly<{
  profile: OptimizationProfile;
  classification: ComponentClassification;
  prediction: FoldPrediction;
  priority: FoldPriority;
  strategy: ResolvedFoldStrategy;
  renderMode: RenderMode;
  appliedOverrides: readonly string[];
  disabledOptimizations: readonly string[];
  frameworkRestrictions: readonly string[];
  reason: string;
}>;

export type OptimizationDecision = Readonly<{
  strategy: ResolvedFoldStrategy;
  renderMode: RenderMode;
  priority: FoldPriority;
  idleTimeoutMs: number;
  supported: boolean;
  classification: ComponentClassification;
  prediction: FoldPrediction;
  diagnostics?: OptimizationDecisionDiagnostics;
  sources: Readonly<{
    strategy: OptimizationDecisionSource;
    renderMode: OptimizationDecisionSource;
    priority: OptimizationDecisionSource;
  }>;
}>;

const hasVisibility = (capabilities: FrameworkAdapterCapabilities) =>
  capabilities.supportsVisibility;

const supportsStrategy = (
  strategy: ResolvedFoldStrategy,
  capabilities: FrameworkAdapterCapabilities,
) => {
  switch (strategy) {
    case "eager":
      return true;
    case "visible":
    case "nearby":
      return hasVisibility(capabilities);
    case "idle":
      return capabilities.supportsIdleScheduling;
  }
};

const supportsRenderMode = (
  mode: RenderMode,
  capabilities: FrameworkAdapterCapabilities,
) => {
  switch (mode) {
    case "ssr":
      return capabilities.supportsServerRendering;
    case "deferred":
      return capabilities.supportsDeferredRendering;
    case "static":
      return capabilities.supportsStaticRendering;
  }
};

const fallbackRenderMode = (
  capabilities: FrameworkAdapterCapabilities,
): RenderMode | undefined => {
  if (capabilities.supportsServerRendering) return "ssr";
  if (capabilities.supportsStaticRendering) return "static";
  if (capabilities.supportsDeferredRendering) return "deferred";
  return undefined;
};

export const resolveOptimizationDecision = (
  policy: RenderingPolicy = {},
): OptimizationDecision => {
  const classification = classifyComponent(
    policy.component,
    policy.classification,
  );
  const component = classification.metadata;
  const configuration = resolveFoldConfiguration({
    ...policy,
    component,
  });
  const capabilities =
    policy.capabilities ?? DEFAULT_FRAMEWORK_ADAPTER_CAPABILITIES;
  const globalSource = policy.global ? "global-profile" : "safe-default";
  const predictionComponent = {
    ...policy.prediction?.component,
    ...component,
  };
  const prediction = predictFoldPosition(
    { ...policy.prediction, component: predictionComponent },
    classification,
  );
  const componentConfiguration = component?.configuration;
  const boundaryConfiguration = policy.boundary?.configuration;
  const override = policy.override;
  const globalConfiguration =
    policy.global?.configuration ??
    DEFAULT_GLOBAL_RENDERING_CONFIGURATION.configuration;

  const componentStrategy = classification.priority === "critical"
    ? "eager"
    : (component?.defaultFoldStrategy ??
      component?.preferredStrategy ??
      componentConfiguration?.strategy);
  const boundaryStrategy = boundaryConfiguration?.strategy;
  const overrideStrategy = override?.strategy;
  let strategyCandidate: FoldStrategy =
    overrideStrategy ??
    boundaryStrategy ??
    componentStrategy ??
    globalConfiguration.strategy;
  let strategySource: OptimizationDecisionSource =
    overrideStrategy !== undefined
      ? "developer-override"
      : boundaryStrategy !== undefined
        ? "boundary-prop"
        : componentStrategy !== undefined
          ? "component-metadata"
          : globalSource;

  const explicitComponentRenderMode =
    policy.component?.defaultRenderMode ??
    policy.component?.preferredRenderMode ??
    policy.component?.configuration?.renderMode;
  const explicitRoleRenderMode =
    policy.classification?.roleDefaults?.[classification.role]
      ?.defaultRenderMode ??
    policy.classification?.roleDefaults?.[classification.role]
      ?.preferredRenderMode ??
    policy.classification?.roleDefaults?.[classification.role]
      ?.configuration?.renderMode;
  const aggressiveCanDefer =
    policy.global?.profile === "aggressive" &&
    component?.componentKind === "dynamic" &&
    component.expectedInteractionCost !== "none" &&
    classification.role !== "unknown" &&
    classification.priority !== "critical" &&
    component.critical !== true &&
    component.seo !== true &&
    classification.role !== "main-content" &&
    explicitComponentRenderMode === undefined &&
    explicitRoleRenderMode === undefined;
  const componentRenderMode =
    classification.priority === "critical"
      ? "ssr"
      : (explicitComponentRenderMode ??
        explicitRoleRenderMode ??
        (aggressiveCanDefer
          ? undefined
          : (component?.defaultRenderMode ??
            component?.preferredRenderMode ??
            componentConfiguration?.renderMode)));
  const boundaryRenderMode = boundaryConfiguration?.renderMode;
  const overrideRenderMode = override?.renderMode;
  let renderModeCandidate: RenderMode =
    overrideRenderMode ??
    boundaryRenderMode ??
    componentRenderMode ??
    globalConfiguration.renderMode;
  let renderModeSource: OptimizationDecisionSource =
    overrideRenderMode !== undefined
      ? "developer-override"
      : boundaryRenderMode !== undefined
        ? "boundary-prop"
        : componentRenderMode !== undefined
          ? "component-metadata"
          : globalSource;

  const componentHasPriority =
    component.priority !== undefined ||
    component.critical !== undefined ||
    componentConfiguration?.priority !== undefined ||
    classification.role !== "unknown";
  const componentPriority = componentHasPriority
    ? classification.priority
    : undefined;
  const boundaryPriority = boundaryConfiguration?.priority;
  const overridePriority = override?.priority;
  let priority: FoldPriority =
    overridePriority ??
    boundaryPriority ??
    componentPriority ??
    globalConfiguration.priority;
  let prioritySource: OptimizationDecisionSource =
    overridePriority !== undefined
      ? "developer-override"
      : boundaryPriority !== undefined
        ? "boundary-prop"
        : componentPriority !== undefined
          ? "component-metadata"
          : globalSource;

  if (policy.constraints?.requiresImmediateRendering) {
    if (strategyCandidate !== "eager") {
      strategyCandidate = "eager";
      strategySource = "accessibility-functionality";
    }
    if (renderModeCandidate !== "ssr") {
      renderModeCandidate = "ssr";
      renderModeSource = "accessibility-functionality";
    }
  } else if (policy.constraints?.requiresServerRendering) {
    if (renderModeCandidate !== "ssr") {
      renderModeCandidate = "ssr";
      renderModeSource = "accessibility-functionality";
    }
  }

  const criticalContent =
    component?.critical === true || classification.priority === "critical";
  const serverContent =
    component?.seo === true || classification.role === "main-content";
  const unknownWithoutSpecificPolicy =
    classification.role === "unknown" &&
    componentStrategy === undefined &&
    componentRenderMode === undefined &&
    boundaryStrategy === undefined &&
    boundaryRenderMode === undefined &&
    overrideStrategy === undefined &&
    overrideRenderMode === undefined;
  const unknownNeedsSafeFallback =
    unknownWithoutSpecificPolicy &&
    policy.global?.profile === "aggressive" &&
    policy.global.hasExplicitRenderingOverrides !== true;

  if (criticalContent) {
    strategyCandidate = "eager";
    strategySource = "accessibility-functionality";
    renderModeCandidate = "ssr";
    renderModeSource = "accessibility-functionality";
    priority = "critical";
    prioritySource = "accessibility-functionality";
  } else if (serverContent) {
    renderModeCandidate = "ssr";
    renderModeSource = "accessibility-functionality";
  } else if (unknownNeedsSafeFallback) {
    strategyCandidate = "eager";
    strategySource = "safe-default";
    renderModeCandidate = "ssr";
    renderModeSource = "safe-default";
  }

  const automaticStrategy =
    strategyCandidate === "auto"
      ? selectAutomaticFoldStrategy({
          classification,
          prediction,
          priority,
          visibility: policy.clientVisibility,
          supportsVisibility: capabilities.supportsVisibility,
          supportsIdleScheduling: capabilities.supportsIdleScheduling,
        })
      : undefined;
  let strategy: ResolvedFoldStrategy =
    automaticStrategy?.strategy ?? strategyCandidate as ResolvedFoldStrategy;
  if (strategyCandidate === "auto") {
    strategySource = "automatic-classification";
  } else if (
    !supportsStrategy(strategy, capabilities) &&
    strategySource !== "developer-override" &&
    strategySource !== "boundary-prop"
  ) {
    strategy = "eager";
    strategySource = "framework-capability";
  }

  let renderMode = renderModeCandidate;
  let functionallyUnsupported = false;
  const staticModeIsUnsafe =
    renderMode === "static" &&
    (component.componentKind === "dynamic" ||
      (component.expectedInteractionCost !== undefined &&
        component.expectedInteractionCost !== "none"));

  if (staticModeIsUnsafe) {
    renderMode = "ssr";
    renderModeSource = "component-functionality";
    functionallyUnsupported = true;
  }

  if (
    !supportsRenderMode(renderMode, capabilities) &&
    renderModeSource !== "developer-override" &&
    renderModeSource !== "boundary-prop" &&
    renderModeSource !== "accessibility-functionality"
  ) {
    const fallback = fallbackRenderMode(capabilities);
    if (fallback !== undefined) {
      renderMode = fallback;
      renderModeSource = "framework-capability";
    }
  }

  const supported =
    !functionallyUnsupported &&
    supportsStrategy(strategy, capabilities) &&
    supportsRenderMode(renderMode, capabilities);

  const diagnostics =
    policy.diagnostics === true
      ? Object.freeze({
          profile:
            policy.global?.profile ??
            DEFAULT_GLOBAL_RENDERING_CONFIGURATION.profile,
          classification,
          prediction,
          priority,
          strategy,
          renderMode,
          appliedOverrides: Object.freeze([
            ...(policy.global?.diagnostics?.appliedOverrides ?? []),
            ...(componentStrategy === undefined &&
            componentRenderMode === undefined &&
            componentPriority === undefined
              ? []
              : ["component"]),
            ...(boundaryConfiguration === undefined ? [] : ["boundary"]),
            ...(override === undefined ? [] : ["boundary-override"]),
          ]),
          disabledOptimizations:
            policy.global?.diagnostics?.disabledOptimizations ??
            Object.freeze([]),
          frameworkRestrictions:
            policy.global?.diagnostics?.frameworkRestrictions ??
            Object.freeze([]),
          reason:
            automaticStrategy?.reason ??
            (staticModeIsUnsafe
              ? "Static rendering is incompatible with the declared interactive component metadata."
              : criticalContent
                ? "Critical content is kept eager, high priority, and server-rendered."
                : serverContent
                  ? "SEO or main content is kept server-rendered."
                  : unknownNeedsSafeFallback
                    ? "Unknown components use the safe eager, server-rendered default."
              : "The strategy follows the highest-priority supported policy layer."),
        })
      : undefined;

  return Object.freeze({
    strategy,
    renderMode,
    priority,
    idleTimeoutMs: configuration.idleTimeoutMs,
    supported,
    classification,
    prediction,
    ...(diagnostics === undefined ? {} : { diagnostics }),
    sources: Object.freeze({
      strategy: strategySource,
      renderMode: renderModeSource,
      priority: prioritySource,
    }),
  });
};
