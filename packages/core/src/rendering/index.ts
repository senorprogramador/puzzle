export {
  classifyComponent,
  mergeComponentClassificationConfigurations,
  selectAutomaticFoldStrategy,
  DEFAULT_COMPONENT_ROLE_METADATA,
  type AutomaticFoldStrategyDecision,
  type AutomaticFoldStrategyInput,
} from "./classification";
export {
  DEFAULT_FOLD_CONFIGURATION,
  DEFAULT_GLOBAL_RENDERING_CONFIGURATION,
  normalizeFoldConfiguration,
  normalizeGlobalRenderingConfiguration,
  resolveOptimizationProfile,
  resolveFoldConfiguration,
} from "./configuration";
export { predictFoldPosition } from "./prediction";
export {
  compareFoldPriority,
  FOLD_PRIORITY_ORDER,
  getFoldPriorityRank,
  type ResourcePriority,
} from "./priority";
export { transitionDeferredLifecycle } from "./deferred-lifecycle";
export {
  resolveOptimizationDecision,
  type OptimizationDecision,
  type OptimizationDecisionDiagnostics,
  type OptimizationDecisionSource,
  type RenderingPolicy,
} from "./policies";
export type { RenderingStrategyContract } from "./rendering-strategy";
export type {
  ResourceDescriptor,
  ResourceScheduleHandle,
  ResourceSchedulerContract,
  ScheduledResourceTask,
} from "./scheduler";
export type {
  ComponentClassification,
  ComponentClassificationConfiguration,
  ComponentDimensions,
  ComponentKind,
  ComponentRenderingMetadata,
  ComponentSemanticRole,
  CriticalResourceHint,
  DeferredLifecycleEvent,
  DeferredLifecycleState,
  DeferredLoadingBehavior,
  ExpectedInteractionCost,
  FoldClientVisibility,
  FoldBoundaryOptions,
  FoldConfiguration,
  FoldConfigurationInput,
  FoldConfigurationLayers,
  FoldPrediction,
  FoldPredictionInput,
  FoldPredictionResult,
  FoldPredictionSource,
  FoldPositionHint,
  FoldPriority,
  FoldStrategy,
  GlobalRenderingConfiguration,
  GlobalRenderingConfigurationInput,
  OptimizationProfile,
  OptimizationEngineConfiguration,
  OptimizationProfileDiagnostics,
  OptimizationProfileOverrides,
  OptimizationProfileResolutionOptions,
  PageStructureMetadata,
  ParentLayoutMetadata,
  RenderMode,
  RenderingConstraints,
  RenderingDiagnosticBoundaryContext,
  RenderingDiagnosticContext,
  RenderingDiagnosticEvent,
  RenderingDiagnosticEventInput,
  RenderingDiagnosticPrefetchEventInput,
  RenderingDiagnosticResourceContext,
  ResolvedFoldStrategy,
  VisibilityState,
} from "./types";
export {
  DEFAULT_FRAMEWORK_ADAPTER_CAPABILITIES,
  type FrameworkAdapterCapabilities,
} from "./framework-adapter";
export type {
  VisibilityChangeHandler,
  VisibilityObserverContract,
} from "./visibility";
