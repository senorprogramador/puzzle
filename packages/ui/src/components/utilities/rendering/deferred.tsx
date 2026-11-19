"use client";

import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type ReactNode,
} from "react";

import type {
  FoldPriority,
  FoldStrategy,
} from "@puzzle-ui/core/rendering";
import { useFold, useFoldOptimization } from "@puzzle-ui/hooks";
import {
  transitionDeferredLifecycle,
  type DeferredLifecycleEvent,
  type DeferredLifecycleState,
} from "@puzzle-ui/core/rendering";
import type { FoldActivationMode } from "@puzzle-ui/hooks";

export type DeferredComponentModule<Props extends object> = Readonly<{
  default: ComponentType<Props>;
}>;

export type DeferredComponentLoader<Props extends object> = (
  signal: AbortSignal,
) => Promise<DeferredComponentModule<Props>>;

export type DeferredActivationStrategy =
  | Exclude<FoldStrategy, "eager">
  | "manual";

export type DeferredErrorFallback = (
  error: unknown,
  retry: () => void,
) => ReactNode;

export type DeferredBoundaryProps<Props extends object> = Readonly<{
  load: DeferredComponentLoader<Props>;
  componentProps: Props;
  strategy?: DeferredActivationStrategy;
  active?: boolean;
  activationMode?: FoldActivationMode;
  id?: string;
  parentId?: string;
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | readonly number[];
  priority?: FoldPriority;
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
  errorFallback?: ReactNode | DeferredErrorFallback;
  suspenseFallback?: ReactNode;
  aspectRatio?: CSSProperties["aspectRatio"];
  minBlockSize?: CSSProperties["minBlockSize"];
  className?: string;
  style?: CSSProperties;
}>;

type LoadRequest = {
  controller: AbortController;
  consumers: number;
  settled: boolean;
};

type ErrorBoundaryProps = Readonly<{
  children: ReactNode;
  renderError: (error: Error) => ReactNode;
  onError: (error: Error) => void;
}>;

type ErrorBoundaryState = Readonly<{ error: Error | null }>;

class DeferredErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  override state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error) {
    this.props.onError(error);
  }

  override render() {
    return this.state.error
      ? this.props.renderError(this.state.error)
      : this.props.children;
  }
}

const DEFAULT_LOADING_FALLBACK = <div role="status">Loading…</div>;

const DeferredBoundary = <Props extends object>({
  load,
  componentProps,
  strategy: requestedStrategy,
  active = false,
  activationMode = "one-shot",
  id,
  parentId,
  root,
  rootMargin,
  threshold,
  priority,
  fallback = null,
  loadingFallback = DEFAULT_LOADING_FALLBACK,
  errorFallback,
  suspenseFallback,
  aspectRatio,
  minBlockSize,
  className,
  style,
}: DeferredBoundaryProps<Props>) => {
  const optimization = useFoldOptimization();
  const strategy =
    requestedStrategy ??
    (optimization.deferredLoadingBehavior === "proximity"
      ? "nearby"
      : optimization.deferredLoadingBehavior === "idle"
        ? "idle"
        : "visible");
  if (strategy !== "manual" && active) {
    throw new TypeError("The active prop is only supported with manual strategy.");
  }

  const foldStrategy = strategy === "manual" ? "nearby" : strategy;
  const fold = useFold({
    id,
    parentId,
    root,
    rootMargin,
    threshold,
    configuration: { strategy: foldStrategy },
    component: priority === undefined ? undefined : { priority },
    activationMode,
    activationTrigger: strategy === "manual" ? "manual" : undefined,
  });
  const isActivated = strategy === "manual" ? active : fold.isActivated;
  const [lifecycleState, setLifecycleState] =
    useState<DeferredLifecycleState>("idle");
  const [retryCount, setRetryCount] = useState(0);
  const lifecycleRef = useRef(lifecycleState);
  const loadRef = useRef(load);
  const loadedComponentRef = useRef<ComponentType<Props> | null>(null);
  const errorRef = useRef<unknown>(undefined);
  const requestRef = useRef<LoadRequest | null>(null);
  const mountedRef = useRef(false);
  const requestStartedAtRef = useRef<number | undefined>(undefined);
  const resourceLoadedAtRef = useRef<number | undefined>(undefined);
  const diagnosticResourceId = id ?? fold.id;

  lifecycleRef.current = lifecycleState;
  loadRef.current = load;

  const transition = useCallback((event: DeferredLifecycleEvent) => {
    const next = transitionDeferredLifecycle(lifecycleRef.current, event);
    lifecycleRef.current = next;
    setLifecycleState(next);
  }, []);

  const retry = useCallback(() => {
    loadedComponentRef.current = null;
    errorRef.current = undefined;
    transition({ type: "retry" });
    setRetryCount((count) => count + 1);
  }, [transition]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (strategy !== "manual") return;
    if (active) {
      fold.activate();
    } else {
      fold.deactivate();
    }
  }, [active, fold.activate, fold.deactivate, strategy]);

  useEffect(() => {
    if (!isActivated) {
      if (
        lifecycleRef.current === "scheduled" ||
        lifecycleRef.current === "loading"
      ) {
        transition({ type: "cancel" });
      }
      return;
    }

    if (
      lifecycleRef.current === "failed" ||
      lifecycleRef.current === "ready" ||
      lifecycleRef.current === "mounted"
    ) {
      return;
    }

    let request = requestRef.current;
    if (!request || request.controller.signal.aborted || request.settled) {
      if (lifecycleRef.current === "cancelled") {
        transition({ type: "retry" });
      } else if (lifecycleRef.current === "idle") {
        transition({ type: "schedule" });
      }

      if (lifecycleRef.current === "scheduled") {
        fold.reportDiagnosticEvent?.({
          type: "resource-scheduled",
          source: "deferred-loader",
          resourceId: diagnosticResourceId,
          state: "scheduled",
        });
        transition({ type: "start" });
      }

      request = {
        controller: new AbortController(),
        consumers: 0,
        settled: false,
      };
      requestRef.current = request;
      const createdRequest = request;
      requestStartedAtRef.current = Date.now();

      let result: Promise<DeferredComponentModule<Props>>;
      try {
        result = Promise.resolve(
          loadRef.current(createdRequest.controller.signal),
        );
      } catch (error) {
        result = Promise.reject(error);
      }

      void result.then(
        (module) => {
          if (
            requestRef.current !== createdRequest ||
            createdRequest.controller.signal.aborted ||
            createdRequest.consumers === 0
          ) {
            return;
          }

          createdRequest.settled = true;
          requestRef.current = null;
          loadedComponentRef.current = module.default;
          resourceLoadedAtRef.current = Date.now();
          fold.reportDiagnosticEvent?.({
            type: "resource-loaded",
            source: "deferred-loader",
            resourceId: diagnosticResourceId,
            state: "loaded",
            durationMs: Math.max(
              0,
              resourceLoadedAtRef.current -
                (requestStartedAtRef.current ?? resourceLoadedAtRef.current),
            ),
          });
          transition({ type: "resolve" });
        },
        (error: unknown) => {
          if (
            requestRef.current !== createdRequest ||
            createdRequest.controller.signal.aborted ||
            createdRequest.consumers === 0
          ) {
            return;
          }

          createdRequest.settled = true;
          requestRef.current = null;
          errorRef.current = error;
          fold.reportDiagnosticEvent?.({
            type: "loading-failed",
            source: "deferred-loader",
            resourceId: diagnosticResourceId,
            error,
            attempts: retryCount + 1,
          });
          transition({ type: "fail" });
        },
      );
    } else if (lifecycleRef.current === "cancelled") {
      transition({ type: "retry" });
      transition({ type: "start" });
    }

    if (!request) return;
    request.consumers += 1;
    const currentRequest = request;

    return () => {
      currentRequest.consumers -= 1;
      queueMicrotask(() => {
        if (currentRequest.consumers > 0 || currentRequest.settled) return;

        currentRequest.controller.abort();
        fold.reportDiagnosticEvent?.({
          type: "resource-cancelled",
          source: "deferred-loader",
          resourceId: diagnosticResourceId,
        });
        if (requestRef.current === currentRequest) {
          requestRef.current = null;
        }
        if (mountedRef.current && lifecycleRef.current === "loading") {
          transition({ type: "cancel" });
        }
      });
    };
  }, [
    diagnosticResourceId,
    fold.reportDiagnosticEvent,
    isActivated,
    retryCount,
    strategy,
    transition,
  ]);

  useEffect(() => {
    if (
      lifecycleState === "ready" &&
      loadedComponentRef.current &&
      isActivated
    ) {
      const mountedAt = Date.now();
      transition({ type: "mount" });
      fold.reportDiagnosticEvent?.({
        type: "component-mounted",
        source: "deferred-boundary",
        mountLatencyMs: Math.max(
          0,
          mountedAt - (resourceLoadedAtRef.current ?? mountedAt),
        ),
      });
    }
  }, [
    fold.reportDiagnosticEvent,
    isActivated,
    lifecycleState,
    transition,
  ]);

  const LoadedComponent = loadedComponentRef.current;
  const shouldRenderLoaded =
    LoadedComponent !== null &&
    (strategy === "manual" ? active : activationMode === "one-shot" || isActivated);
  const boundaryStyle: CSSProperties = {
    aspectRatio,
    minBlockSize,
    ...style,
  };
  const renderError = (error: unknown) => {
    if (typeof errorFallback === "function") {
      return errorFallback(error, retry);
    }
    if (errorFallback !== undefined) return errorFallback;

    return (
      <div role="alert">
        <span>Unable to load this component.</span>
        <button type="button" onClick={retry}>
          Retry
        </button>
      </div>
    );
  };

  let content: ReactNode = fallback ?? null;
  if (lifecycleState === "loading") {
    content = loadingFallback;
  } else if (lifecycleState === "failed") {
    content = renderError(errorRef.current);
  } else if (shouldRenderLoaded && LoadedComponent) {
    const loadedContent = <LoadedComponent {...componentProps} />;
    content =
      suspenseFallback === undefined ? (
        <DeferredErrorBoundary
          key={retryCount}
          onError={(error) => {
            errorRef.current = error;
            fold.reportDiagnosticEvent?.({
              type: "loading-failed",
              source: "deferred-render",
              resourceId: diagnosticResourceId,
              error,
              attempts: retryCount + 1,
            });
            transition({ type: "fail" });
          }}
          renderError={renderError}
        >
          {loadedContent}
        </DeferredErrorBoundary>
      ) : (
        <DeferredErrorBoundary
          key={retryCount}
          onError={(error) => {
            errorRef.current = error;
            fold.reportDiagnosticEvent?.({
              type: "loading-failed",
              source: "deferred-render",
              resourceId: diagnosticResourceId,
              error,
              attempts: retryCount + 1,
            });
            transition({ type: "fail" });
          }}
          renderError={renderError}
        >
          <Suspense fallback={suspenseFallback}>{loadedContent}</Suspense>
        </DeferredErrorBoundary>
      );
  }

  return (
    <div
      ref={fold.ref}
      id={id ?? fold.id}
      className={className}
      style={boundaryStyle}
      aria-busy={lifecycleState === "loading"}
    >
      {content}
    </div>
  );
};

export { DeferredBoundary };
