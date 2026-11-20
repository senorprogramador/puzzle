"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type RefCallback,
} from "react";
import type {
  IdentifiedResourceDescriptor,
  ResourceLoader,
  ResourcePrefetchStrategy,
  ResourceRegistration,
  ResourceRequest,
  ResourceSnapshot,
  ResourceState,
} from "@puzzle-ui/core/resources";
import type {
  RenderingDiagnosticEvent,
  RenderingDiagnosticPrefetchEventInput,
  RenderingDiagnosticResourceContext,
} from "@puzzle-ui/core/rendering";
import { useFoldProviderValue } from "./fold-provider";
import { useBoundaryRegistration } from "./use-boundary-registration";
import type { VisibilityObserverOptions } from "./visibility/types";

export type UseResourcePrefetchOptions<T> = Pick<
  VisibilityObserverOptions,
  "root" | "rootMargin" | "threshold"
> &
  Readonly<{
    resource: IdentifiedResourceDescriptor;
    load: ResourceLoader<T>;
    strategy?: ResourcePrefetchStrategy;
    enabled?: boolean;
    idleTimeoutMs?: number;
  }>;

export type UseResourcePrefetchReturn<T> = Readonly<{
  ref: RefCallback<Element>;
  state: ResourceState;
  error?: unknown;
  isPrefetched: boolean;
  available: boolean;
  prefetch: () => Promise<T>;
  retry: () => Promise<T>;
  cancel: () => void;
}>;

type ResourceNetworkConnection = EventTarget &
  Readonly<{
    effectiveType?: string;
    saveData?: boolean;
  }>;

type NavigatorWithResourceHints = Navigator &
  Readonly<{
    connection?: ResourceNetworkConnection;
    deviceMemory?: number;
  }>;

const isAutomaticPrefetchAllowed = (
  priority: IdentifiedResourceDescriptor["priority"],
  adaptiveScheduling: boolean,
): boolean => {
  if (typeof navigator === "undefined") return true;

  const resourceNavigator = navigator as NavigatorWithResourceHints;
  const connection = resourceNavigator.connection;
  if (connection?.saveData && priority !== "critical" && priority !== "high") {
    return false;
  }

  if (
    adaptiveScheduling &&
    (connection?.effectiveType === "slow-2g" ||
      connection?.effectiveType === "2g") &&
    (priority === "normal" || priority === "low")
  ) {
    return false;
  }

  return !(
    adaptiveScheduling &&
    resourceNavigator.deviceMemory !== undefined &&
    resourceNavigator.deviceMemory <= 1 &&
    priority === "low"
  );
};

const scheduleOnFrame = (callback: () => void): (() => void) => {
  let active = true;
  let timeout: number | undefined;
  const frame =
    typeof window.requestAnimationFrame === "function"
      ? window.requestAnimationFrame(() => {
          if (!active) return;
          timeout = window.setTimeout(() => {
            if (active) callback();
          }, 0);
        })
      : undefined;

  if (frame === undefined) {
    timeout = window.setTimeout(() => {
      if (active) callback();
    }, 0);
  }

  return () => {
    active = false;
    if (frame !== undefined) window.cancelAnimationFrame?.(frame);
    if (timeout !== undefined) window.clearTimeout(timeout);
  };
};

const scheduleWhenIdle = (
  callback: () => void,
  timeoutMs: number,
): (() => void) => {
  let active = true;
  let timeout: number | undefined;
  let idleHandle: number | undefined;
  let frameHandle: number | undefined;
  const run = () => {
    if (!active) return;
    active = false;
    if (timeout !== undefined) window.clearTimeout(timeout);
    callback();
  };

  if (typeof window.requestIdleCallback === "function") {
    idleHandle = window.requestIdleCallback(run, { timeout: timeoutMs });
    timeout = window.setTimeout(run, timeoutMs);
  } else if (typeof window.requestAnimationFrame === "function") {
    frameHandle = window.requestAnimationFrame(() => {
      if (!active) return;
      timeout = window.setTimeout(run, 0);
    });
    timeout = window.setTimeout(run, timeoutMs);
  } else {
    timeout = window.setTimeout(run, 0);
  }

  return () => {
    active = false;
    if (idleHandle !== undefined) window.cancelIdleCallback?.(idleHandle);
    if (frameHandle !== undefined) window.cancelAnimationFrame?.(frameHandle);
    if (timeout !== undefined) window.clearTimeout(timeout);
  };
};

const isDocumentVisible = () =>
  typeof document === "undefined" || document.visibilityState !== "hidden";

type PrefetchEnvironmentListener = (available: boolean) => void;

const prefetchEnvironmentListeners = new Set<PrefetchEnvironmentListener>();
let prefetchEnvironmentAttached = false;
let pageSuspended = false;
let documentTarget: Document | undefined;
let windowTarget: Window | undefined;
let connectionTarget: ResourceNetworkConnection | undefined;

const notifyPrefetchEnvironment = () => {
  const available = !pageSuspended && isDocumentVisible();
  for (const listener of prefetchEnvironmentListeners) listener(available);
};

const handlePageHide = () => {
  pageSuspended = true;
  notifyPrefetchEnvironment();
};

const handlePageShow = () => {
  pageSuspended = false;
  notifyPrefetchEnvironment();
};

const attachPrefetchEnvironment = () => {
  if (prefetchEnvironmentAttached) return;
  prefetchEnvironmentAttached = true;

  if (
    typeof document !== "undefined" &&
    typeof document.addEventListener === "function"
  ) {
    documentTarget = document;
    documentTarget.addEventListener(
      "visibilitychange",
      notifyPrefetchEnvironment,
    );
    documentTarget.addEventListener("freeze", handlePageHide);
    documentTarget.addEventListener("resume", handlePageShow);
  }

  if (
    typeof window !== "undefined" &&
    typeof window.addEventListener === "function"
  ) {
    windowTarget = window;
    windowTarget.addEventListener("pagehide", handlePageHide);
    windowTarget.addEventListener("pageshow", handlePageShow);
  }

  const connection =
    typeof navigator === "undefined"
      ? undefined
      : (navigator as NavigatorWithResourceHints).connection;
  if (
    connection &&
    typeof connection.addEventListener === "function" &&
    typeof connection.removeEventListener === "function"
  ) {
    connectionTarget = connection;
    connectionTarget.addEventListener("change", notifyPrefetchEnvironment);
  }
};

const detachPrefetchEnvironment = () => {
  if (!prefetchEnvironmentAttached) return;
  prefetchEnvironmentAttached = false;

  documentTarget?.removeEventListener(
    "visibilitychange",
    notifyPrefetchEnvironment,
  );
  documentTarget?.removeEventListener("freeze", handlePageHide);
  documentTarget?.removeEventListener("resume", handlePageShow);
  windowTarget?.removeEventListener("pagehide", handlePageHide);
  windowTarget?.removeEventListener("pageshow", handlePageShow);
  connectionTarget?.removeEventListener("change", notifyPrefetchEnvironment);
  documentTarget = undefined;
  windowTarget = undefined;
  connectionTarget = undefined;
  pageSuspended = false;
};

const subscribeToPrefetchEnvironment = (
  listener: PrefetchEnvironmentListener,
) => {
  prefetchEnvironmentListeners.add(listener);
  attachPrefetchEnvironment();
  listener(!pageSuspended && isDocumentVisible());

  return () => {
    prefetchEnvironmentListeners.delete(listener);
    if (prefetchEnvironmentListeners.size === 0) {
      detachPrefetchEnvironment();
    }
  };
};

const createInitialSnapshot = (
  resource: IdentifiedResourceDescriptor,
): ResourceSnapshot => ({
  id: resource.id,
  resource,
  state: "registered",
  priority: resource.priority,
  attempts: 0,
});

export const useResourcePrefetch = <T,>({
  resource,
  load,
  enabled: requestedEnabled,
  idleTimeoutMs = 2000,
  root,
  rootMargin,
  threshold,
  strategy: requestedStrategy,
}: UseResourcePrefetchOptions<T>): UseResourcePrefetchReturn<T> => {
  const provider = useFoldProviderValue();
  const enabled = requestedEnabled ?? provider.optimization.prefetch;
  const strategy =
    requestedStrategy ??
    (resource.loadingStrategy === "on-demand"
      ? "explicit"
      : (resource.prefetchStrategy ??
        (provider.optimization.deferredLoadingBehavior === "proximity"
          ? "proximity"
          : provider.optimization.deferredLoadingBehavior === "idle"
            ? "idle"
            : "explicit")));
  const generatedId = useId();
  const boundary = useBoundaryRegistration({
    id: `resource-prefetch-${generatedId}`,
    root: root === undefined ? provider.visibility.root : root,
    rootMargin: rootMargin ?? provider.visibility.rootMargin,
    threshold: threshold ?? provider.visibility.threshold,
    priority: resource.priority,
    activationMode: "persistent",
    activationTrigger: strategy === "proximity" ? "nearby" : "visible",
    observe: strategy === "proximity" || strategy === "visibility",
  });
  const scheduler = provider.scheduler;
  const [registration, setRegistration] =
    useState<ResourceRegistration<T> | undefined>(undefined);
  const [snapshot, setSnapshot] = useState<ResourceSnapshot>(() =>
    createInitialSnapshot(resource),
  );
  const currentRequestRef = useRef<ResourceRequest<T> | undefined>(undefined);
  const automaticAttemptedRef = useRef(false);
  const requestStartedAtRef = useRef<number | undefined>(undefined);
  const previousResourceStateRef = useRef(snapshot.state);
  const reportedSkipReasonRef = useRef<
    "disabled" | "page-hidden" | "network-policy" | undefined
  >(undefined);
  const reportDiagnosticEventImpl = useCallback(
    (event: RenderingDiagnosticPrefetchEventInput) => {
      const context: RenderingDiagnosticResourceContext = Object.freeze({
        contextType: "resource-prefetch",
        boundaryId: boundary.id,
        profile: provider.configuration.profile,
        effectiveConfiguration: provider.configuration,
        visibility: boundary.visibility,
        isVisible: boundary.isVisible,
        isNearby: boundary.isNearby,
        priority: resource.priority,
        strategy,
      });
      const diagnosticEvent: RenderingDiagnosticEvent = {
        ...event,
        timestamp: Date.now(),
        context,
      };
      provider.reportDiagnosticEvent(diagnosticEvent);
    },
    [
      boundary.id,
      boundary.isNearby,
      boundary.isVisible,
      boundary.visibility,
      provider.configuration,
      provider.diagnostics,
      provider.reportDiagnosticEvent,
      resource,
      strategy,
    ],
  );
  const reportDiagnosticEvent = provider.diagnostics
    ? reportDiagnosticEventImpl
    : undefined;
  const reportPrefetchSkipped = useCallback(
    (reason: "disabled" | "page-hidden" | "network-policy") => {
      if (!reportDiagnosticEvent) return;
      if (reportedSkipReasonRef.current === reason) return;
      reportedSkipReasonRef.current = reason;
      reportDiagnosticEvent({
        type: "prefetch-skipped",
        resource,
        reason,
      });
    },
    [reportDiagnosticEvent, resource],
  );

  useEffect(() => {
    if (enabled && strategy !== "none") {
      reportedSkipReasonRef.current = undefined;
      return;
    }
    reportPrefetchSkipped("disabled");
  }, [enabled, reportPrefetchSkipped, strategy]);

  useEffect(() => {
    automaticAttemptedRef.current = false;
    currentRequestRef.current = undefined;
    setSnapshot(createInitialSnapshot(resource));
    if (!scheduler?.register) {
      setRegistration(undefined);
      return;
    }

    const nextRegistration = scheduler.register({ resource, load });
    const unsubscribe = nextRegistration.subscribe(setSnapshot);
    setRegistration(nextRegistration);
    setSnapshot(nextRegistration.getSnapshot());

    return () => {
      currentRequestRef.current?.cancel();
      currentRequestRef.current = undefined;
      unsubscribe();
      nextRegistration.unregister();
    };
  }, [load, resource, scheduler]);

  const prefetch = useCallback(() => {
    if (!registration) {
      return Promise.reject(
        new Error(
          "useResourcePrefetch requires a FoldProvider with a resource scheduler.",
        ),
      );
    }

    automaticAttemptedRef.current = true;
    reportedSkipReasonRef.current = undefined;
    const request = registration.prefetch();
    requestStartedAtRef.current = Date.now();
    currentRequestRef.current = request;
    reportDiagnosticEvent?.({
      type: "prefetch-started",
      resource,
      state: registration.getSnapshot().state,
    });
    return request.promise;
  }, [registration, reportDiagnosticEvent, resource]);

  const retry = useCallback(() => {
    if (!registration) {
      return Promise.reject(
        new Error(
          "useResourcePrefetch requires a FoldProvider with a resource scheduler.",
        ),
      );
    }

    automaticAttemptedRef.current = true;
    reportedSkipReasonRef.current = undefined;
    const request = registration.retry();
    requestStartedAtRef.current = Date.now();
    currentRequestRef.current = request;
    reportDiagnosticEvent?.({
      type: "prefetch-started",
      resource,
      state: registration.getSnapshot().state,
    });
    return request.promise;
  }, [registration, reportDiagnosticEvent, resource]);

  const cancel = useCallback(() => {
    const request = currentRequestRef.current;
    request?.cancel();
    if (request) {
      reportDiagnosticEvent?.({
        type: "resource-cancelled",
        source: "prefetch",
        resource,
      });
    }
    currentRequestRef.current = undefined;
    automaticAttemptedRef.current = true;
  }, [reportDiagnosticEvent, resource]);

  useEffect(() => {
    const previousState = previousResourceStateRef.current;
    previousResourceStateRef.current = snapshot.state;
    if (snapshot.state === previousState) return;

    if (snapshot.state === "loaded") {
      const completedAt = Date.now();
      reportDiagnosticEvent?.({
        type: "resource-loaded",
        source: "prefetch",
        resource,
        state: "loaded",
        durationMs: Math.max(
          0,
          completedAt - (requestStartedAtRef.current ?? completedAt),
        ),
      });
    } else if (snapshot.state === "failed") {
      reportDiagnosticEvent?.({
        type: "loading-failed",
        source: "resource-scheduler",
        resource,
        error: snapshot.error,
        attempts: snapshot.attempts,
      });
    }
  }, [
    reportDiagnosticEvent,
    resource,
    snapshot.attempts,
    snapshot.error,
    snapshot.state,
  ]);

  useEffect(() => {
    if (
      !enabled ||
      !registration ||
      strategy === "none" ||
      strategy === "explicit" ||
      automaticAttemptedRef.current ||
      snapshot.state === "loaded"
    ) {
      return;
    }

    let cancelScheduled: () => void = () => undefined;
    const attempt = () => {
      if (automaticAttemptedRef.current) return;
      if (!isDocumentVisible()) {
        reportPrefetchSkipped("page-hidden");
        return;
      }
      if (
        !isAutomaticPrefetchAllowed(
          resource.priority,
          provider.optimization.adaptiveScheduling,
        )
      ) {
        reportPrefetchSkipped("network-policy");
        return;
      }

      automaticAttemptedRef.current = true;
      reportedSkipReasonRef.current = undefined;
      const request = registration.prefetch();
      requestStartedAtRef.current = Date.now();
      currentRequestRef.current = request;
      reportDiagnosticEvent?.({
        type: "prefetch-started",
        resource,
        state: registration.getSnapshot().state,
      });
      void request.promise.catch(() => {
        setSnapshot(registration.getSnapshot());
      });
    };
    const schedule = () => {
      cancelScheduled();
      cancelScheduled =
        strategy === "idle"
          ? scheduleWhenIdle(attempt, idleTimeoutMs)
          : scheduleOnFrame(attempt);
    };
    const isEligible =
      strategy === "idle" ||
      (strategy === "visibility" && boundary.isVisible) ||
      (strategy === "proximity" && boundary.isNearby);

    if (!isEligible) return;

    const unsubscribeEnvironment = subscribeToPrefetchEnvironment((available) => {
      if (available) schedule();
      else cancelScheduled();
    });

    return () => {
      cancelScheduled();
      unsubscribeEnvironment();
    };
  }, [
    boundary.isNearby,
    boundary.isVisible,
    enabled,
    idleTimeoutMs,
    provider.optimization.adaptiveScheduling,
    registration,
    resource.priority,
    reportDiagnosticEvent,
    reportPrefetchSkipped,
    snapshot.state,
    strategy,
  ]);

  const error =
    snapshot.state === "failed" ? snapshot.error : undefined;

  return {
    ref: boundary.ref,
    state: snapshot.state,
    ...(error === undefined ? {} : { error }),
    isPrefetched: snapshot.state === "loaded",
    available: registration !== undefined,
    prefetch,
    retry,
    cancel,
  };
};
