"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@puzzle-ui/core";
import type {
  ComponentRenderingMetadata,
  FoldConfigurationInput,
  FoldPriority,
  FoldPredictionInput,
  FoldStrategy,
  RenderMode,
  ResourceDescriptor,
  ResourceSchedulerContract,
} from "@puzzle-ui/core/rendering";
import { useFold } from "@puzzle-ui/hooks";
import { Skeleton } from "../../data-display/skeleton";

export type FoldBoundaryProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> &
  Readonly<{
    children: ReactNode;
    strategy?: FoldStrategy;
    mode?: RenderMode;
    priority?: FoldPriority;
    root?: Element | Document | null;
    rootMargin?: string;
    threshold?: number | readonly number[];
    fallback?: ReactNode;
    once?: boolean;
    disabled?: boolean;
    contentVisibility?: "auto" | "visible";
    intrinsicSize?: CSSProperties["containIntrinsicSize"];
    aspectRatio?: CSSProperties["aspectRatio"];
    componentHints?: ComponentRenderingMetadata;
    prediction?: FoldPredictionInput;
    override?: FoldConfigurationInput;
    scheduledResource?: ResourceDescriptor;
    parentId?: string;
  }>;

type CompletedSchedule = Readonly<{
  scheduler: ResourceSchedulerContract;
  resourceKey: string;
  priority: FoldPriority;
}>;

const applyPriority = (
  resource: ResourceDescriptor,
  priority: FoldPriority,
): ResourceDescriptor => {
  switch (resource.type) {
    case "image":
      return { type: "image", url: resource.url, priority };
    case "script":
      return {
        type: "script",
        url: resource.url,
        priority,
        async: resource.async,
      };
    case "stylesheet":
      return {
        type: "stylesheet",
        url: resource.url,
        priority,
        media: resource.media,
      };
    case "font":
      return {
        type: "font",
        url: resource.url,
        priority,
        family: resource.family,
      };
  }
};

const containsTarget = (
  event: FocusEvent<HTMLDivElement>,
  target: EventTarget | null,
) => target !== null && event.currentTarget.contains(target as Node);

export const FoldBoundary = ({
  children,
  strategy,
  mode,
  priority,
  root,
  rootMargin,
  threshold,
  fallback = <Skeleton />,
  once = true,
  disabled = false,
  contentVisibility,
  intrinsicSize,
  aspectRatio,
  componentHints,
  prediction,
  override,
  scheduledResource: resource,
  parentId,
  className,
  style,
  id,
  "aria-busy": ariaBusy,
  onFocusCapture,
  onBlurCapture,
  ...attributes
}: FoldBoundaryProps) => {
  const fold = useFold({
    id,
    parentId,
    root,
    rootMargin,
    threshold,
    component: componentHints,
    configuration: { strategy, renderMode: mode, priority },
    prediction,
    override,
    constraints: disabled ? { requiresImmediateRendering: true } : undefined,
    activationMode: once ? "one-shot" : "persistent",
    observe: !disabled && mode !== "static",
  });
  const shouldDefer =
    !disabled &&
    fold.decision.supported &&
    fold.decision.renderMode === "deferred" &&
    fold.decision.strategy !== "eager";
  const resourceKey = resource ? (JSON.stringify(resource) ?? "") : undefined;
  const resourceRef = useRef(resource);
  resourceRef.current = resource;
  const scheduledResource = useMemo(() => {
    const currentResource = resourceRef.current;
    return currentResource
      ? applyPriority(currentResource, fold.decision.priority)
      : undefined;
  }, [fold.decision.priority, resourceKey]);
  const completedScheduleRef = useRef<CompletedSchedule | undefined>(undefined);
  const activatedAtRef = useRef<number | undefined>(undefined);
  const reportedMountRef = useRef(false);
  const [schedulerReady, setSchedulerReady] = useState(false);
  const [hasActivated, setHasActivated] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [fallbackFocusWithin, setFallbackFocusWithin] = useState(false);

  useEffect(() => {
    if (!fold.isActivated) return;
    activatedAtRef.current ??= Date.now();
    setHasActivated(true);
  }, [fold.isActivated]);

  useEffect(() => {
    if (!shouldDefer || !fold.isActivated) {
      setSchedulerReady(false);
      return;
    }

    const scheduler = fold.scheduler;
    if (!scheduler || !scheduledResource || resourceKey === undefined) {
      setSchedulerReady(true);
      return;
    }

    const completed = completedScheduleRef.current;
    if (
      completed?.scheduler === scheduler &&
      completed.resourceKey === resourceKey &&
      completed.priority === fold.decision.priority
    ) {
      setSchedulerReady(true);
      return;
    }

    setSchedulerReady(false);
    let active = true;
    let scheduleCompleted = false;
    fold.reportDiagnosticEvent?.({
      type: "resource-scheduled",
      source: "fold-boundary",
      resource: scheduledResource,
      state: "scheduled",
    });
    const handle = scheduler.schedule({
      resource: scheduledResource,
      load: () => {
        if (!active) return;
        scheduleCompleted = true;
        completedScheduleRef.current = {
          scheduler,
          resourceKey,
          priority: fold.decision.priority,
        };
        setSchedulerReady(true);
      },
    });

    return () => {
      active = false;
      if (!scheduleCompleted) {
        scheduler.cancel(handle);
        fold.reportDiagnosticEvent?.({
          type: "resource-cancelled",
          source: "fold-boundary",
          resource: scheduledResource,
        });
      }
    };
  }, [
    fold.decision.priority,
    fold.isActivated,
    fold.reportDiagnosticEvent,
    fold.scheduler,
    resourceKey,
    scheduledResource,
    shouldDefer,
  ]);

  const schedulerIsReady =
    !fold.scheduler || !resource || schedulerReady;
  const readyToRender = !shouldDefer || (fold.isActivated && schedulerIsReady);
  const showChildren =
    !fallbackFocusWithin &&
    (readyToRender || (hasActivated && focusWithin));
  const displayModeRef = useRef(showChildren);
  displayModeRef.current = showChildren;
  const isPending = shouldDefer && !showChildren;
  const metadataHeight = componentHints?.dimensions?.height;
  const profileIntrinsicSize =
    fold.optimization.intrinsicSize ??
    (fold.optimization.intrinsicSizing === "metadata" &&
    typeof metadataHeight === "number" &&
    Number.isFinite(metadataHeight) &&
    metadataHeight > 0
      ? `auto ${metadataHeight}px`
      : undefined);
  const effectiveIntrinsicSize = intrinsicSize ?? profileIntrinsicSize;
  const useProfileContentVisibility =
    fold.optimization.contentVisibility &&
    fold.decision.priority !== "critical" &&
    componentHints?.seo !== true &&
    (effectiveIntrinsicSize !== undefined || aspectRatio !== undefined);
  const effectiveContentVisibility =
    contentVisibility ??
    (intrinsicSize !== undefined || useProfileContentVisibility
      ? "auto"
      : undefined);
  const boundaryStyle: CSSProperties = {
    ...(effectiveContentVisibility === undefined &&
    effectiveIntrinsicSize === undefined
      ? {}
      : {
          ...(effectiveContentVisibility === undefined
            ? {}
            : { contentVisibility: effectiveContentVisibility }),
          ...(effectiveIntrinsicSize === undefined
            ? {}
            : { containIntrinsicSize: effectiveIntrinsicSize }),
        }),
    ...(aspectRatio === undefined ? {} : { aspectRatio }),
    ...style,
  };

  const handleFocusCapture = (event: FocusEvent<HTMLDivElement>) => {
    onFocusCapture?.(event);
    setFocusWithin(true);
    setFallbackFocusWithin(!displayModeRef.current);
  };
  const handleBlurCapture = (event: FocusEvent<HTMLDivElement>) => {
    onBlurCapture?.(event);
    if (containsTarget(event, event.relatedTarget)) return;
    setFocusWithin(false);
    setFallbackFocusWithin(false);
  };

  useEffect(() => {
    if (!showChildren || reportedMountRef.current) return;
    reportedMountRef.current = true;
    const mountedAt = Date.now();
    fold.reportDiagnosticEvent?.({
      type: "component-mounted",
      source: "fold-boundary",
      mountLatencyMs: Math.max(
        0,
        mountedAt - (activatedAtRef.current ?? mountedAt),
      ),
    });
  }, [fold.reportDiagnosticEvent, showChildren]);

  return (
    <div
      {...attributes}
      id={id}
      ref={fold.ref}
      className={className ? cn(className) : undefined}
      style={boundaryStyle}
      aria-busy={isPending ? true : ariaBusy}
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlurCapture}
    >
      {showChildren ? children : fallback}
    </div>
  );
};
