"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { createResourceScheduler } from "@puzzle-ui/core/resources";
import { mergeComponentClassificationConfigurations } from "@puzzle-ui/core/rendering";
import {
  DEFAULT_FRAMEWORK_ADAPTER_CAPABILITIES,
  DEFAULT_GLOBAL_RENDERING_CONFIGURATION,
  resolveOptimizationProfile,
  type ComponentClassificationConfiguration,
  type OptimizationProfileOverrides,
  type FoldPriority,
  type FoldStrategy,
  type FrameworkAdapterCapabilities,
  type GlobalRenderingConfiguration,
  type GlobalRenderingConfigurationInput,
  type PageStructureMetadata,
  type RenderMode,
  type RenderingDiagnosticEvent,
  type ResourceSchedulerContract,
} from "@puzzle-ui/core/rendering";
import type { ResourceSchedulerOptions } from "@puzzle-ui/core/resources";
import type { VisibilityObserverOptions } from "./visibility/types";

declare const process: Readonly<{
  env?: Readonly<{ NODE_ENV?: string }>;
}>;

type FoldImportMeta = ImportMeta &
  Readonly<{ env?: Readonly<{ DEV?: boolean }> }>;

const isDevelopment = () => {
  const nodeEnvironment =
    typeof process === "undefined" ? undefined : process.env?.NODE_ENV;
  if (nodeEnvironment !== undefined) return nodeEnvironment !== "production";

  return (import.meta as FoldImportMeta).env?.DEV === true;
};

export type FoldProviderVisibilityOptions = Pick<
  VisibilityObserverOptions,
  "root" | "rootMargin" | "threshold"
>;

export type FoldProviderProps = Readonly<{
  children: ReactNode;
  config?: GlobalRenderingConfigurationInput;
  configuration?: GlobalRenderingConfigurationInput;
  defaultStrategy?: FoldStrategy;
  defaultMode?: RenderMode;
  defaultPriority?: FoldPriority;
  visibility?: FoldProviderVisibilityOptions;
  capabilities?: FrameworkAdapterCapabilities;
  classification?: ComponentClassificationConfiguration;
  pageStructure?: PageStructureMetadata;
  diagnostics?: boolean;
  onDiagnosticEvent?: (event: RenderingDiagnosticEvent) => void;
  scheduler?: ResourceSchedulerContract | null;
}>;

type FoldProviderValue = Readonly<{
  configuration: GlobalRenderingConfiguration;
  configurationInput: GlobalRenderingConfigurationInput;
  optimization: GlobalRenderingConfiguration["optimization"];
  visibility: FoldProviderVisibilityOptions;
  visibilityOverrides: FoldProviderVisibilityOptions;
  capabilities: FrameworkAdapterCapabilities;
  classification: ComponentClassificationConfiguration;
  pageStructure: PageStructureMetadata | undefined;
  diagnostics: boolean;
  reportDiagnosticEvent: (event: RenderingDiagnosticEvent) => void;
  scheduler: ResourceSchedulerContract | undefined;
  hasProvider: boolean;
  schedulerDisabled: boolean;
}>;

const REACT_FOLD_CAPABILITIES: FrameworkAdapterCapabilities = Object.freeze({
  ...DEFAULT_FRAMEWORK_ADAPTER_CAPABILITIES,
  supportsDeferredRendering: true,
  supportsVisibility: true,
  supportsIdleScheduling: true,
});

const DEFAULT_CONFIGURATION_INPUT: GlobalRenderingConfigurationInput =
  Object.freeze({
    profile: DEFAULT_GLOBAL_RENDERING_CONFIGURATION.profile,
    configuration: Object.freeze({}),
  });

const EMPTY_VISIBILITY_OPTIONS: FoldProviderVisibilityOptions =
  Object.freeze({});
const ignoreDiagnosticEvent = (_event: RenderingDiagnosticEvent) => undefined;

const DEFAULT_FOLD_PROVIDER_VALUE: FoldProviderValue = Object.freeze({
  configuration: DEFAULT_GLOBAL_RENDERING_CONFIGURATION,
  configurationInput: DEFAULT_CONFIGURATION_INPUT,
  optimization: DEFAULT_GLOBAL_RENDERING_CONFIGURATION.optimization,
  visibility: Object.freeze({
    rootMargin: DEFAULT_GLOBAL_RENDERING_CONFIGURATION.optimization.rootMargin,
    threshold:
      DEFAULT_GLOBAL_RENDERING_CONFIGURATION.optimization.proximityThreshold,
  }),
  visibilityOverrides: EMPTY_VISIBILITY_OPTIONS,
  capabilities: REACT_FOLD_CAPABILITIES,
  classification: Object.freeze({ roleDefaults: Object.freeze({}) }),
  pageStructure: undefined,
  diagnostics: false,
  reportDiagnosticEvent: ignoreDiagnosticEvent,
  scheduler: undefined,
  hasProvider: false,
  schedulerDisabled: false,
});

const FoldProviderContext = createContext(DEFAULT_FOLD_PROVIDER_VALUE);

export const FoldProvider = ({
  children,
  config,
  configuration,
  defaultStrategy,
  defaultMode,
  defaultPriority,
  visibility,
  capabilities,
  classification,
  pageStructure,
  diagnostics,
  onDiagnosticEvent,
  scheduler,
}: FoldProviderProps) => {
  const parent = useContext(FoldProviderContext);
  const resolvedCapabilities = capabilities ?? parent.capabilities;
  const resolvedDiagnostics =
    diagnostics ??
    (onDiagnosticEvent === undefined ? parent.diagnostics : true);
  const diagnosticCallbackRef = useRef(onDiagnosticEvent);
  const diagnosticsEnabledRef = useRef(resolvedDiagnostics);
  diagnosticCallbackRef.current = onDiagnosticEvent;
  diagnosticsEnabledRef.current = resolvedDiagnostics;
  const reportDiagnosticEvent = useCallback(
    (event: RenderingDiagnosticEvent) => {
      if (!diagnosticsEnabledRef.current) return;
      const callback = diagnosticCallbackRef.current;
      if (callback) {
        callback(event);
        return;
      }
      parent.reportDiagnosticEvent(event);
    },
    [parent.reportDiagnosticEvent],
  );
  const selectedConfig = config ?? configuration;
  const configurationInput = useMemo(() => {
    if (selectedConfig !== undefined) {
      resolveOptimizationProfile(selectedConfig);
    }

    const mergeOverrides = (
      ...sources: readonly (
        | OptimizationProfileOverrides
        | undefined
      )[]
    ): OptimizationProfileOverrides | undefined => {
      if (sources.every((source) => source === undefined)) {
        return undefined;
      }

      const merged: OptimizationProfileOverrides = Object.assign(
        {},
        ...sources.filter(
          (source): source is OptimizationProfileOverrides =>
            source !== undefined,
        ),
      );
      const priorityQueueLimits = Object.assign(
        {},
        ...sources
          .filter(
            (source): source is OptimizationProfileOverrides =>
              source !== undefined,
          )
          .map((source) => source.priorityQueueLimits ?? {}),
      );

      return Object.freeze({
        ...merged,
        ...(Object.keys(priorityQueueLimits).length === 0
          ? {}
          : { priorityQueueLimits: Object.freeze(priorityQueueLimits) }),
      });
    };

    return Object.freeze({
      profile: selectedConfig?.profile ?? parent.configurationInput.profile,
      configuration: Object.freeze({
        ...parent.configurationInput.configuration,
        ...selectedConfig?.configuration,
        ...(defaultStrategy === undefined ? {} : { strategy: defaultStrategy }),
        ...(defaultMode === undefined ? {} : { renderMode: defaultMode }),
        ...(defaultPriority === undefined ? {} : { priority: defaultPriority }),
      }),
      optimization: mergeOverrides(
        parent.configurationInput.optimization,
        selectedConfig?.optimization,
      ),
      application: mergeOverrides(
        parent.configurationInput.application,
        selectedConfig?.application,
      ),
      route: mergeOverrides(
        parent.configurationInput.route,
        selectedConfig?.route,
        visibility === undefined
          ? undefined
          : {
              ...(visibility.rootMargin === undefined
                ? {}
                : { rootMargin: visibility.rootMargin }),
              ...(visibility.threshold === undefined
                ? {}
                : { proximityThreshold: visibility.threshold }),
            },
      ),
    });
  }, [
    defaultMode,
    defaultPriority,
    defaultStrategy,
    parent.configurationInput,
    selectedConfig,
    visibility,
  ]);
  const normalizedConfiguration = useMemo(
    () =>
      resolveOptimizationProfile(configurationInput, {
        capabilities: resolvedCapabilities,
        diagnostics: resolvedDiagnostics,
      }),
    [configurationInput, resolvedCapabilities, resolvedDiagnostics],
  );
  const visibilityOverrides = useMemo(
    () =>
      Object.freeze({
        ...parent.visibilityOverrides,
        ...visibility,
      }),
    [parent.visibilityOverrides, visibility],
  );
  const visibilityOptions = useMemo(
    () =>
      Object.freeze({
        root:
          visibilityOverrides.root === undefined
            ? parent.visibility.root
            : visibilityOverrides.root,
        rootMargin: normalizedConfiguration.optimization.rootMargin,
        threshold: normalizedConfiguration.optimization.proximityThreshold,
      }),
    [
      normalizedConfiguration.optimization,
      parent.visibility.root,
      visibilityOverrides,
    ],
  );
  const schedulerOptions = useMemo<ResourceSchedulerOptions>(
    () => ({
      maxConcurrent:
        normalizedConfiguration.optimization.resourceConcurrency,
      maxConcurrentPrefetch:
        normalizedConfiguration.optimization.maxConcurrentPrefetch,
      maxQueuedResources:
        normalizedConfiguration.optimization.resourceQueueLimit,
      maxQueuedByPriority:
        normalizedConfiguration.optimization.priorityQueueLimits,
      maxPrefetchResources:
        normalizedConfiguration.optimization.prefetchBudget,
      maxRetries: normalizedConfiguration.optimization.maxRetries,
      maxCachedResources:
        normalizedConfiguration.optimization.maxCachedResources,
    }),
    [normalizedConfiguration.optimization],
  );
  const shouldCreateScheduler =
    scheduler === undefined &&
    !parent.scheduler &&
    !parent.schedulerDisabled &&
    !parent.hasProvider;
  const localScheduler = useMemo(
    () =>
      shouldCreateScheduler
        ? createResourceScheduler(schedulerOptions)
        : undefined,
    [schedulerOptions, shouldCreateScheduler],
  );
  const localSchedulerRef = useRef(localScheduler);
  const providerMountedRef = useRef(false);
  localSchedulerRef.current = localScheduler;
  useEffect(() => {
    providerMountedRef.current = true;
    return () => {
      providerMountedRef.current = false;
      if (!localScheduler) return;
      queueMicrotask(() => {
        if (
          !providerMountedRef.current ||
          localSchedulerRef.current !== localScheduler
        ) {
          localScheduler.dispose?.();
        }
      });
    };
  }, [localScheduler]);
  const resolvedClassification = useMemo(
    () =>
      mergeComponentClassificationConfigurations(
        parent.classification,
        classification,
      ),
    [classification, parent.classification],
  );
  const resolvedPageStructure = useMemo(
    () =>
      pageStructure === undefined
        ? parent.pageStructure
        : Object.freeze({ ...parent.pageStructure, ...pageStructure }),
    [pageStructure, parent.pageStructure],
  );
  const resolvedScheduler =
    scheduler === undefined
      ? (parent.scheduler ??
        (parent.hasProvider || parent.schedulerDisabled
          ? undefined
          : localScheduler))
      : (scheduler ?? undefined);
  const schedulerDisabled =
    scheduler === null ||
    (scheduler === undefined && parent.schedulerDisabled);
  const value = useMemo(
    () =>
      Object.freeze({
        configuration: normalizedConfiguration,
        configurationInput,
        optimization: normalizedConfiguration.optimization,
        visibility: visibilityOptions,
        visibilityOverrides,
        capabilities: resolvedCapabilities,
        classification: resolvedClassification,
        pageStructure: resolvedPageStructure,
        diagnostics: resolvedDiagnostics,
        reportDiagnosticEvent,
        scheduler: resolvedScheduler,
        hasProvider: true,
        schedulerDisabled,
      }),
    [
      configurationInput,
      normalizedConfiguration,
      visibilityOverrides,
      resolvedClassification,
      resolvedCapabilities,
      resolvedDiagnostics,
      resolvedPageStructure,
      reportDiagnosticEvent,
      resolvedScheduler,
      schedulerDisabled,
      visibilityOptions,
    ],
  );

  useEffect(() => {
    if (config === undefined || configuration === undefined) return;
    if (isDevelopment()) {
      console.warn(
        'FoldProvider received both "config" and the legacy "configuration" prop; "config" takes precedence.',
      );
    }
  }, [config, configuration]);

  return (
    <FoldProviderContext.Provider value={value}>
      {children}
    </FoldProviderContext.Provider>
  );
};

export const useFoldProviderValue = (): FoldProviderValue =>
  useContext(FoldProviderContext);

export const useFoldOptimization = ():
  GlobalRenderingConfiguration["optimization"] =>
  useFoldProviderValue().optimization;
