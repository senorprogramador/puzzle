import type { ResourcePriority } from "../resources/priority";
import type {
  ResourceDescriptor,
  ResourcePrefetchStrategy,
  ResourceState,
} from "../resources/types";

export type FoldStrategy = "eager" | "visible" | "nearby" | "idle" | "auto";

export type ResolvedFoldStrategy = Exclude<FoldStrategy, "auto">;

export type RenderMode = "ssr" | "deferred" | "static";

export type FoldPriority = ResourcePriority;

export type ComponentSemanticRole =
  | "navigation"
  | "navigation-drawer"
  | "hero"
  | "main-content"
  | "gallery"
  | "testimonials"
  | "interactive-map"
  | "footer"
  | "unknown";

export type ComponentKind = "static" | "dynamic";

export type ExpectedInteractionCost = "none" | "low" | "medium" | "high";

export type FoldPositionHint = "above-fold" | "below-fold";

export type ComponentDimensions = Readonly<{
  width?: number;
  height?: number;
  aspectRatio?: number;
}>;

export type ParentLayoutMetadata = Readonly<{
  documentOffset?: number;
  precedingContentHeight?: number;
  precedingSiblingHeights?: readonly number[];
  paddingTop?: number;
  gap?: number;
}>;

export type PageStructureMetadata = Readonly<{
  region?: "header" | "hero" | "main" | "content" | "footer";
  positionHint?: FoldPositionHint;
  documentOrder?: number;
}>;

export type CriticalResourceHint = Readonly<{
  id?: string;
  type: string;
  url?: string;
  cacheKey?: string;
}>;

export type VisibilityState =
  | "unknown"
  | "outside"
  | "nearby"
  | "visible"
  | "activated";

export type DeferredLifecycleState =
  | "idle"
  | "scheduled"
  | "loading"
  | "ready"
  | "mounted"
  | "failed"
  | "cancelled";

export type DeferredLifecycleEvent =
  | Readonly<{ type: "schedule" }>
  | Readonly<{ type: "start" }>
  | Readonly<{ type: "resolve" }>
  | Readonly<{ type: "mount" }>
  | Readonly<{ type: "fail" }>
  | Readonly<{ type: "cancel" }>
  | Readonly<{ type: "retry" }>
  | Readonly<{ type: "reset" }>;

export type OptimizationProfile =
  | "conservative"
  | "balanced"
  | "aggressive"
  | "custom";

export type DeferredLoadingBehavior =
  | "on-activation"
  | "proximity"
  | "idle";

export type FoldConfiguration = Readonly<{
  strategy: FoldStrategy;
  renderMode: RenderMode;
  priority: FoldPriority;
  idleTimeoutMs: number;
}>;

export type FoldConfigurationInput = Readonly<Partial<FoldConfiguration>>;

export type OptimizationProfileOverrides = Readonly<{
  strategy?: FoldStrategy;
  renderMode?: RenderMode;
  priority?: FoldPriority;
  idleTimeoutMs?: number;
  rootMargin?: string;
  proximityThreshold?: number | readonly number[];
  prefetch?: boolean;
  prefetchBudget?: number;
  resourceConcurrency?: number;
  maxConcurrentPrefetch?: number;
  resourceQueueLimit?: number;
  maxRetries?: number;
  maxCachedResources?: number;
  priorityQueueLimits?: Readonly<Partial<Record<FoldPriority, number>>>;
  adaptiveScheduling?: boolean;
  contentVisibility?: boolean;
  intrinsicSizing?: "off" | "metadata";
  intrinsicSize?: string;
  deferredLoadingBehavior?: DeferredLoadingBehavior;
}>;

export type OptimizationEngineConfiguration = Readonly<{
  rootMargin: string;
  proximityThreshold: number | readonly number[];
  prefetch: boolean;
  prefetchBudget: number;
  resourceConcurrency: number;
  maxConcurrentPrefetch: number;
  resourceQueueLimit: number;
  maxRetries: number;
  maxCachedResources: number;
  priorityQueueLimits: Readonly<Record<FoldPriority, number>>;
  adaptiveScheduling: boolean;
  contentVisibility: boolean;
  intrinsicSizing: "off" | "metadata";
  intrinsicSize?: string;
  deferredLoadingBehavior: DeferredLoadingBehavior;
}>;

export type OptimizationProfileDiagnostics = Readonly<{
  selectedProfile: OptimizationProfile;
  appliedOverrides: readonly string[];
  disabledOptimizations: readonly string[];
  frameworkRestrictions: readonly string[];
}>;

export type RenderingDiagnosticBoundaryContext = Readonly<{
  contextType: "boundary";
  boundaryId: string;
  profile: OptimizationProfile;
  effectiveConfiguration: GlobalRenderingConfiguration;
  visibility: VisibilityState;
  isVisible: boolean;
  isNearby: boolean;
  isActivated: boolean;
  predictedPosition: FoldPrediction;
  strategy: ResolvedFoldStrategy;
  renderMode: RenderMode;
  priority: FoldPriority;
  appliedOverrides: readonly string[];
  disabledOptimizations: readonly string[];
  frameworkRestrictions: readonly string[];
}>;

export type RenderingDiagnosticResourceContext = Readonly<{
  contextType: "resource-prefetch";
  boundaryId: string;
  profile: OptimizationProfile;
  effectiveConfiguration: GlobalRenderingConfiguration;
  visibility: VisibilityState;
  isVisible: boolean;
  isNearby: boolean;
  priority: FoldPriority;
  strategy: ResourcePrefetchStrategy;
}>;

export type RenderingDiagnosticContext =
  | RenderingDiagnosticBoundaryContext
  | RenderingDiagnosticResourceContext;

export type RenderingDiagnosticEvent =
  | Readonly<{
      type: "boundary-registered";
      timestamp: number;
      context: RenderingDiagnosticBoundaryContext;
    }>
  | Readonly<{
      type: "boundary-visibility-changed";
      timestamp: number;
      context: RenderingDiagnosticBoundaryContext;
      previousVisibility: VisibilityState;
    }>
  | Readonly<{
      type: "resource-scheduled";
      timestamp: number;
      context: RenderingDiagnosticContext;
      source: "fold-boundary" | "deferred-loader" | "prefetch";
      resource?: ResourceDescriptor;
      resourceId?: string;
      state: ResourceState | "scheduled";
    }>
  | Readonly<{
      type: "resource-loaded";
      timestamp: number;
      context: RenderingDiagnosticContext;
      source: "deferred-loader" | "prefetch";
      resource?: ResourceDescriptor;
      resourceId?: string;
      state: "loaded";
      durationMs: number;
    }>
  | Readonly<{
      type: "resource-cancelled";
      timestamp: number;
      context: RenderingDiagnosticContext;
      source: "fold-boundary" | "deferred-loader" | "prefetch";
      resource?: ResourceDescriptor;
      resourceId?: string;
    }>
  | Readonly<{
      type: "prefetch-started";
      timestamp: number;
      context: RenderingDiagnosticResourceContext;
      resource: ResourceDescriptor;
      state: ResourceState;
    }>
  | Readonly<{
      type: "prefetch-skipped";
      timestamp: number;
      context: RenderingDiagnosticResourceContext;
      resource: ResourceDescriptor;
      reason: "disabled" | "page-hidden" | "network-policy";
    }>
  | Readonly<{
      type: "component-activated";
      timestamp: number;
      context: RenderingDiagnosticBoundaryContext;
      activationLatencyMs: number;
    }>
  | Readonly<{
      type: "component-mounted";
      timestamp: number;
      context: RenderingDiagnosticBoundaryContext;
      source: "fold-boundary" | "deferred-boundary";
      mountLatencyMs: number;
    }>
  | Readonly<{
      type: "loading-failed";
      timestamp: number;
      context: RenderingDiagnosticContext;
      source: "deferred-loader" | "deferred-render" | "resource-scheduler";
      resource?: ResourceDescriptor;
      resourceId?: string;
      error: unknown;
      attempts?: number;
    }>;

export type RenderingDiagnosticEventInput =
  | Readonly<{
      type: "resource-scheduled";
      source: "fold-boundary" | "deferred-loader";
      resource?: ResourceDescriptor;
      resourceId?: string;
      state: ResourceState | "scheduled";
    }>
  | Readonly<{
      type: "resource-loaded";
      source: "deferred-loader";
      resource?: ResourceDescriptor;
      resourceId?: string;
      state: "loaded";
      durationMs: number;
    }>
  | Readonly<{
      type: "resource-cancelled";
      source: "fold-boundary" | "deferred-loader";
      resource?: ResourceDescriptor;
      resourceId?: string;
    }>
  | Readonly<{
      type: "component-mounted";
      source: "fold-boundary" | "deferred-boundary";
      mountLatencyMs: number;
    }>
  | Readonly<{
      type: "loading-failed";
      source: "deferred-loader" | "deferred-render" | "resource-scheduler";
      resource?: ResourceDescriptor;
      resourceId?: string;
      error: unknown;
      attempts?: number;
    }>;

export type RenderingDiagnosticPrefetchEventInput =
  | Readonly<{
      type: "prefetch-started";
      resource: ResourceDescriptor;
      state: ResourceState;
    }>
  | Readonly<{
      type: "prefetch-skipped";
      resource: ResourceDescriptor;
      reason: "disabled" | "page-hidden" | "network-policy";
    }>
  | Readonly<{
      type: "resource-loaded";
      source: "prefetch";
      resource: ResourceDescriptor;
      state: "loaded";
      durationMs: number;
    }>
  | Readonly<{
      type: "resource-cancelled";
      source: "prefetch";
      resource: ResourceDescriptor;
    }>
  | Readonly<{
      type: "loading-failed";
      source: "resource-scheduler";
      resource: ResourceDescriptor;
      error: unknown;
      attempts?: number;
    }>;

export type OptimizationProfileResolutionOptions = Readonly<{
  capabilities?: Readonly<{
    supportsServerRendering: boolean;
    supportsDeferredRendering: boolean;
    supportsStaticRendering: boolean;
    supportsVisibility: boolean;
    supportsIdleScheduling: boolean;
  }>;
  diagnostics?: boolean;
}>;

export type GlobalRenderingConfigurationInput = Readonly<{
  profile?: OptimizationProfile;
  configuration?: FoldConfigurationInput;
  optimization?: OptimizationProfileOverrides;
  application?: OptimizationProfileOverrides;
  route?: OptimizationProfileOverrides;
}>;

export type GlobalRenderingConfiguration = Readonly<{
  profile: OptimizationProfile;
  configuration: FoldConfiguration;
  optimization: OptimizationEngineConfiguration;
  hasExplicitRenderingOverrides?: boolean;
  diagnostics?: OptimizationProfileDiagnostics;
}>;

export type FoldBoundaryOptions = Readonly<{
  id?: string;
  configuration?: FoldConfigurationInput;
}>;

export type ComponentRenderingMetadata = Readonly<{
  configuration?: FoldConfigurationInput;
  critical?: boolean;
  preferredStrategy?: FoldStrategy;
  preferredRenderMode?: RenderMode;
  priority?: FoldPriority;
  role?: ComponentSemanticRole;
  componentKind?: ComponentKind;
  expectedInteractionCost?: ExpectedInteractionCost;
  expectedWeightBytes?: number;
  seo?: boolean;
  defaultFoldStrategy?: FoldStrategy;
  defaultRenderMode?: RenderMode;
  criticalResourceHints?: readonly CriticalResourceHint[];
  positionHint?: FoldPositionHint;
  documentOrder?: number;
  dimensions?: ComponentDimensions;
  parentLayout?: ParentLayoutMetadata;
}>;

export type ComponentClassificationConfiguration = Readonly<{
  roleDefaults?: Partial<
    Record<ComponentSemanticRole, Partial<ComponentRenderingMetadata>>
  >;
}>;

export type ComponentClassification = Readonly<{
  role: ComponentSemanticRole;
  priority: FoldPriority;
  metadata: ComponentRenderingMetadata;
  confidence: number;
  reason: string;
}>;

export type FoldPredictionResult =
  | "known-critical"
  | "predicted-above-fold"
  | "predicted-below-fold"
  | "unknown";

export type FoldPredictionSource =
  | "critical-metadata"
  | "component-position-hint"
  | "page-structure"
  | "document-order"
  | "unknown";

export type FoldPrediction = Readonly<{
  result: FoldPredictionResult;
  confidence: number;
  source: FoldPredictionSource;
  reason: string;
  estimatedDocumentOffset?: number;
  estimatedBottomOffset?: number;
}>;

export type FoldPredictionInput = Readonly<{
  component?: ComponentRenderingMetadata;
  positionHint?: FoldPositionHint;
  documentOrder?: number;
  pageStructure?: PageStructureMetadata;
  dimensions?: ComponentDimensions;
  parentLayout?: ParentLayoutMetadata;
}>;

export type FoldConfigurationLayers = Readonly<{
  global?: GlobalRenderingConfiguration;
  boundary?: FoldBoundaryOptions;
  component?: ComponentRenderingMetadata;
  override?: FoldConfigurationInput;
}>;

export type FoldClientVisibility = "unknown" | "outside" | "nearby" | "visible";

export type RenderingConstraints = Readonly<{
  requiresImmediateRendering?: boolean;
  requiresServerRendering?: boolean;
}>;
