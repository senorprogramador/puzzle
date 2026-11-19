"use client";

import { useCallback, useEffect, useRef } from "react";
import type {
  FoldConfigurationInput,
  OptimizationEngineConfiguration,
  OptimizationDecision,
  RenderingDiagnosticBoundaryContext,
  RenderingDiagnosticEvent,
  RenderingDiagnosticEventInput,
  RenderingPolicy,
  ResourceSchedulerContract,
  VisibilityState,
} from "@puzzle-ui/core/rendering";
import {
  resolveOptimizationDecision,
  resolveOptimizationProfile,
} from "@puzzle-ui/core/rendering";
import { useFoldProviderValue } from "./fold-provider";
import {
  useBoundaryRegistration,
  type BoundaryHookResult,
} from "./use-boundary-registration";
import type {
  FoldActivationMode,
  FoldActivationTrigger,
  VisibilityObserverOptions,
} from "./visibility/types";

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

export type UseFoldOptions = Omit<VisibilityObserverOptions, "priority"> &
  Omit<RenderingPolicy, "boundary" | "capabilities" | "clientVisibility"> &
  Readonly<{
    id?: string;
    parentId?: string;
    configuration?: FoldConfigurationInput;
    activationMode?: FoldActivationMode;
    activationTrigger?: FoldActivationTrigger;
    observe?: boolean;
  }>;

export type UseFoldReturn = BoundaryHookResult &
  Readonly<{
    decision: OptimizationDecision;
    optimization: OptimizationEngineConfiguration;
    scheduler: ResourceSchedulerContract | undefined;
    reportDiagnosticEvent?: (event: RenderingDiagnosticEventInput) => void;
  }>;

export const useFold = (options: UseFoldOptions = {}): UseFoldReturn => {
  const provider = useFoldProviderValue();
  const diagnosticsEnabled = options.diagnostics ?? provider.diagnostics;
  const eventDiagnosticsEnabled = provider.diagnostics;
  const globalConfiguration =
    options.global ??
    (diagnosticsEnabled && provider.configuration.diagnostics === undefined
      ? resolveOptimizationProfile(provider.configurationInput, {
          capabilities: provider.capabilities,
          diagnostics: true,
        })
      : provider.configuration);
  const predictionInput = {
    ...options.prediction,
    pageStructure: {
      ...provider.pageStructure,
      ...options.prediction?.pageStructure,
    },
  };
  const policy = {
    global: globalConfiguration,
    boundary: {
      id: options.id,
      configuration: options.configuration,
    },
    component: options.component,
    override: options.override,
    constraints: options.constraints,
    capabilities: provider.capabilities,
    classification: provider.classification,
    prediction: predictionInput,
    diagnostics: diagnosticsEnabled,
  } satisfies RenderingPolicy;
  const initialDecision = resolveOptimizationDecision(policy);
  const automaticStrategy =
    initialDecision.sources.strategy === "automatic-classification";
  const initialEffectiveStrategy = initialDecision.supported
    ? initialDecision.strategy
    : "eager";
  const activationTrigger =
    options.activationTrigger ??
    (automaticStrategy
      ? "manual"
      : initialEffectiveStrategy === "visible" ||
          initialEffectiveStrategy === "nearby"
        ? initialEffectiveStrategy
        : "manual");
  const boundary = useBoundaryRegistration({
    id: options.id,
    parentId: options.parentId,
    root:
      options.root === undefined ? provider.visibility.root : options.root,
    rootMargin: options.rootMargin ?? provider.visibility.rootMargin,
    threshold: options.threshold ?? provider.visibility.threshold,
    priority: initialDecision.priority,
    activationMode: options.activationMode ?? "one-shot",
    activationTrigger,
    observe:
      options.observe !== false &&
      initialDecision.renderMode !== "static" &&
      (automaticStrategy ||
        ((initialEffectiveStrategy === "visible" ||
          initialEffectiveStrategy === "nearby") &&
          activationTrigger !== "manual")),
    initiallyActivated: initialEffectiveStrategy === "eager",
  });
  const decision =
    automaticStrategy && boundary.visibility !== "unknown"
      ? resolveOptimizationDecision({
          ...policy,
          clientVisibility: boundary.visibility,
        })
      : initialDecision;
  const effectiveStrategy = decision.supported ? decision.strategy : "eager";
  const diagnosticContextRef = useRef<
    RenderingDiagnosticBoundaryContext | undefined
  >(undefined);
  diagnosticContextRef.current = eventDiagnosticsEnabled
    ? Object.freeze({
        contextType: "boundary",
        boundaryId: boundary.id,
        profile: globalConfiguration.profile,
        effectiveConfiguration: globalConfiguration,
        visibility: boundary.visibility,
        isVisible: boundary.isVisible,
        isNearby: boundary.isNearby,
        isActivated: boundary.isActivated,
        predictedPosition: decision.prediction,
        strategy: effectiveStrategy,
        renderMode: decision.renderMode,
        priority: decision.priority,
        appliedOverrides:
          decision.diagnostics?.appliedOverrides ??
          globalConfiguration.diagnostics?.appliedOverrides ??
          Object.freeze([]),
        disabledOptimizations:
          decision.diagnostics?.disabledOptimizations ??
          globalConfiguration.diagnostics?.disabledOptimizations ??
          Object.freeze([]),
        frameworkRestrictions:
          decision.diagnostics?.frameworkRestrictions ??
          globalConfiguration.diagnostics?.frameworkRestrictions ??
          Object.freeze([]),
      })
    : undefined;
  const reportDiagnosticEvent = useCallback(
    (event: RenderingDiagnosticEventInput) => {
      const context = diagnosticContextRef.current;
      if (!context) return;
      const diagnosticEvent: RenderingDiagnosticEvent = {
        ...event,
        timestamp: Date.now(),
        context,
      };
      provider.reportDiagnosticEvent(diagnosticEvent);
    },
    [provider.reportDiagnosticEvent],
  );
  const diagnosticRegisteredAtRef = useRef<number | undefined>(undefined);
  const previousDiagnosticVisibilityRef = useRef<VisibilityState | undefined>(
    undefined,
  );
  const previousDiagnosticActivationRef = useRef<boolean | undefined>(
    undefined,
  );
  const warningKey = [
    decision.strategy,
    decision.renderMode,
    decision.sources.strategy,
    decision.sources.renderMode,
  ].join("|");
  const warnedConfigurationRef = useRef<string | null>(null);

  useEffect(() => {
    const explicitStrategy =
      decision.sources.strategy === "developer-override" ||
      decision.sources.strategy === "boundary-prop" ||
      decision.sources.strategy === "component-metadata";
    const explicitRenderMode =
      decision.sources.renderMode === "developer-override" ||
      decision.sources.renderMode === "boundary-prop" ||
      decision.sources.renderMode === "component-metadata" ||
      decision.sources.renderMode === "component-functionality";

    if (
      decision.supported ||
      (!explicitStrategy && !explicitRenderMode) ||
      !isDevelopment()
    ) {
      warnedConfigurationRef.current = null;
      return;
    }

    if (warnedConfigurationRef.current === warningKey) return;
    warnedConfigurationRef.current = warningKey;
    console.warn(
      `Fold configuration is unsupported by the active adapter or component metadata (strategy="${decision.strategy}", mode="${decision.renderMode}"). Rendering safely instead.`,
    );
  }, [decision, warningKey]);

  useEffect(() => {
    if (!automaticStrategy || !decision.supported) return;

    const shouldActivate =
      decision.strategy === "eager" ||
      (decision.strategy === "visible" && boundary.isVisible) ||
      (decision.strategy === "nearby" && boundary.isNearby);
    if (shouldActivate) {
      boundary.activate();
    } else if (
      options.activationMode === "persistent" &&
      boundary.isActivated
    ) {
      boundary.deactivate();
    }
  }, [
    automaticStrategy,
    boundary.activate,
    boundary.deactivate,
    boundary.isActivated,
    boundary.isNearby,
    boundary.isVisible,
    decision.strategy,
    decision.supported,
    options.activationMode,
  ]);

  useEffect(() => {
    if (
      effectiveStrategy !== "idle" ||
      options.observe === false ||
      boundary.isActivated ||
      typeof window === "undefined"
    ) {
      return;
    }

    let cancelled = false;
    const activate = () => {
      if (!cancelled) boundary.activate();
    };

    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(activate, {
        timeout: decision.idleTimeoutMs,
      });

      return () => {
        cancelled = true;
        window.cancelIdleCallback(handle);
      };
    }

    const timeout = window.setTimeout(activate, decision.idleTimeoutMs);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [
    boundary.activate,
    boundary.isActivated,
    decision.idleTimeoutMs,
    effectiveStrategy,
    options.observe,
  ]);

  useEffect(() => {
    if (!eventDiagnosticsEnabled) {
      diagnosticRegisteredAtRef.current = undefined;
      previousDiagnosticVisibilityRef.current = undefined;
      previousDiagnosticActivationRef.current = undefined;
      return;
    }

    const timestamp = Date.now();
    const context = diagnosticContextRef.current;
    if (diagnosticRegisteredAtRef.current === undefined) {
      diagnosticRegisteredAtRef.current = timestamp;
      previousDiagnosticVisibilityRef.current = boundary.visibility;
      previousDiagnosticActivationRef.current = boundary.isActivated;
      if (!context) return;

      provider.reportDiagnosticEvent({
        type: "boundary-registered",
        timestamp,
        context,
      });
      if (boundary.isActivated) {
        provider.reportDiagnosticEvent({
          type: "component-activated",
          timestamp,
          context,
          activationLatencyMs: 0,
        });
      }
      return;
    }

    const previousVisibility = previousDiagnosticVisibilityRef.current;
    if (
      context &&
      previousVisibility !== undefined &&
      previousVisibility !== boundary.visibility
    ) {
      provider.reportDiagnosticEvent({
        type: "boundary-visibility-changed",
        timestamp,
        context,
        previousVisibility,
      });
    }
    previousDiagnosticVisibilityRef.current = boundary.visibility;

    const wasActivated = previousDiagnosticActivationRef.current;
    if (context && !wasActivated && boundary.isActivated) {
      provider.reportDiagnosticEvent({
        type: "component-activated",
        timestamp,
        context,
        activationLatencyMs:
          timestamp - (diagnosticRegisteredAtRef.current ?? timestamp),
      });
    }
    previousDiagnosticActivationRef.current = boundary.isActivated;
  }, [
    boundary.isActivated,
    boundary.visibility,
    eventDiagnosticsEnabled,
    provider.reportDiagnosticEvent,
  ]);

  return {
    ...boundary,
    decision,
    optimization: provider.optimization,
    scheduler: provider.scheduler,
    reportDiagnosticEvent: eventDiagnosticsEnabled
      ? reportDiagnosticEvent
      : undefined,
  };
};
