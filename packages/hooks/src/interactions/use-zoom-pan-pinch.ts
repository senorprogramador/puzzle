import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type RefCallback,
} from "react";

/** A 2D pan/zoom transform in viewport CSS pixels. */
export interface ZoomPanPinchTransform {
  /** Horizontal translation in CSS pixels. */
  x: number;
  /** Vertical translation in CSS pixels. */
  y: number;
  /** Scale factor; 1 means 100%. */
  scale: number;
}

export type ZoomPanPinchSource = "wheel" | "pinch" | "pan" | "programmatic";

export interface UseZoomPanPinchOptions {
  /** Used only on the first render. Defaults to { x: 0, y: 0, scale: 1 }. */
  initialTransform?: Partial<ZoomPanPinchTransform>;
  minScale?: number;
  maxScale?: number;
  /** Exponential wheel sensitivity. Larger values zoom faster. Defaults to 0.0015. */
  wheelSensitivity?: number;
  enabled?: boolean;
  /**
   * Feed this from your existing keyboard hook. It may be a boolean or a getter
   * if your keyboard hook exposes its state through a function.
   */
  isSpacePressed?: boolean | (() => boolean);
  onTransformChange?: (
    transform: ZoomPanPinchTransform,
    source: ZoomPanPinchSource,
  ) => void;
}

export interface UseZoomPanPinchResult<T extends HTMLElement> {
  /** Attach to the untransformed viewport that receives input events. */
  ref: RefCallback<T>;
  transform: ZoomPanPinchTransform;
  /** Convenience CSS transform for the content inside the viewport. */
  contentStyle: CSSProperties;
  /** Useful for cursor feedback, e.g. `cursor: isPanning ? "grabbing" : "grab"`. */
  isPanning: boolean;
  /** Set a transform programmatically; scale is clamped to minScale/maxScale. */
  setTransform: (
    next:
      | ZoomPanPinchTransform
      | ((current: ZoomPanPinchTransform) => ZoomPanPinchTransform),
  ) => void;
  reset: () => void;
}

interface Point {
  x: number;
  y: number;
}

interface TouchPoint extends Point {
  pointerId: number;
}

interface TouchMetrics {
  center: Point;
  /** Mean distance from the center. For two touches this is half their distance. */
  radius: number;
}

interface MousePanGesture {
  pointerId: number;
  last: Point;
}

const DEFAULT_TRANSFORM: ZoomPanPinchTransform = { x: 0, y: 0, scale: 1 };
const MIN_PINCH_RADIUS = 0.5;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function distance(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function getTouchMetrics(
  touches: Map<number, TouchPoint>,
): TouchMetrics | null {
  if (touches.size < 2) return null;

  const points = [...touches.values()];
  const center = points.reduce(
    (result, point) => ({
      x: result.x + point.x / points.length,
      y: result.y + point.y / points.length,
    }),
    { x: 0, y: 0 },
  );
  const radius =
    points.reduce((sum, point) => sum + distance(center, point), 0) /
    points.length;

  return { center, radius };
}

export function useZoomPanPinch<T extends HTMLElement = HTMLDivElement>(
  options: UseZoomPanPinchOptions = {},
): UseZoomPanPinchResult<T> {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const getScaleBounds = useCallback(() => {
    const rawMin = optionsRef.current.minScale ?? 0.1;
    const min = Number.isFinite(rawMin) && rawMin > 0 ? rawMin : 0.1;
    const rawMax = optionsRef.current.maxScale ?? 8;
    const max =
      Number.isFinite(rawMax) && rawMax >= min ? rawMax : Math.max(8, min);
    return { min, max };
  }, []);

  const normalizeTransform = useCallback(
    (transform: ZoomPanPinchTransform): ZoomPanPinchTransform => {
      const { min, max } = getScaleBounds();
      return {
        x: Number.isFinite(transform.x) ? transform.x : 0,
        y: Number.isFinite(transform.y) ? transform.y : 0,
        scale: clamp(
          Number.isFinite(transform.scale) ? transform.scale : 1,
          min,
          max,
        ),
      };
    },
    [getScaleBounds],
  );

  const initialTransformRef = useRef<ZoomPanPinchTransform>(
    normalizeTransform({ ...DEFAULT_TRANSFORM, ...options.initialTransform }),
  );
  const [transform, setTransformState] = useState(initialTransformRef.current);
  const transformRef = useRef(transform);
  transformRef.current = transform;

  const [viewport, setViewport] = useState<T | null>(null);
  const ref = useCallback<RefCallback<T>>((node) => setViewport(node), []);

  const [isPanning, setIsPanningState] = useState(false);
  const isPanningRef = useRef(false);
  const updatePanning = useCallback((next: boolean) => {
    if (isPanningRef.current === next) return;
    isPanningRef.current = next;
    setIsPanningState(next);
  }, []);

  const commitTransform = useCallback(
    (next: ZoomPanPinchTransform, source: ZoomPanPinchSource) => {
      const normalized = normalizeTransform(next);
      transformRef.current = normalized;
      setTransformState(normalized);
      optionsRef.current.onTransformChange?.(normalized, source);
    },
    [normalizeTransform],
  );

  const setTransform = useCallback<UseZoomPanPinchResult<T>["setTransform"]>(
    (next) => {
      const value =
        typeof next === "function" ? next(transformRef.current) : next;
      commitTransform(value, "programmatic");
    },
    [commitTransform],
  );

  const reset = useCallback(() => {
    commitTransform(initialTransformRef.current, "programmatic");
  }, [commitTransform]);

  const getSpacePressed = useCallback((): boolean => {
    const value = optionsRef.current.isSpacePressed;
    return typeof value === "function" ? value() : value === true;
  }, []);

  const panBy = useCallback(
    (dx: number, dy: number) => {
      if (dx === 0 && dy === 0) return;
      const current = transformRef.current;
      commitTransform(
        { ...current, x: current.x + dx, y: current.y + dy },
        "pan",
      );
    },
    [commitTransform],
  );

  const zoomAt = useCallback(
    (point: Point, requestedScale: number, source: "wheel" | "pinch") => {
      const current = transformRef.current;
      const { min, max } = getScaleBounds();
      const nextScale = clamp(requestedScale, min, max);
      if (Math.abs(nextScale - current.scale) < 1e-9) return;

      const ratio = nextScale / current.scale;
      commitTransform(
        {
          x: point.x - (point.x - current.x) * ratio,
          y: point.y - (point.y - current.y) * ratio,
          scale: nextScale,
        },
        source,
      );
    },
    [commitTransform, getScaleBounds],
  );

  const applyPinch = useCallback(
    (previous: TouchMetrics, current: TouchMetrics) => {
      if (
        previous.radius < MIN_PINCH_RADIUS ||
        current.radius < MIN_PINCH_RADIUS
      )
        return;

      const currentTransform = transformRef.current;
      const requestedScale =
        currentTransform.scale * (current.radius / previous.radius);
      const { min, max } = getScaleBounds();
      const nextScale = clamp(requestedScale, min, max);
      const ratio = nextScale / currentTransform.scale;

      // Keep the content point under the previous finger center under the new center.
      // This combines two-finger panning and pinching in a single transform update.
      commitTransform(
        {
          x:
            current.center.x - (previous.center.x - currentTransform.x) * ratio,
          y:
            current.center.y - (previous.center.y - currentTransform.y) * ratio,
          scale: nextScale,
        },
        "pinch",
      );
    },
    [commitTransform, getScaleBounds],
  );

  useEffect(() => {
    if (!viewport) return;

    const isEnabled = options.enabled !== false;
    const previousTouchAction = viewport.style.touchAction;
    const previousUserSelect = viewport.style.userSelect;
    if (isEnabled) {
      // Required to receive touch pinch/pan gestures instead of browser page gestures.
      viewport.style.touchAction = "none";
      viewport.style.userSelect = "none";
    }

    const touchPoints = new Map<number, TouchPoint>();
    const touchMetricsRef = { current: null as TouchMetrics | null };
    const mousePanRef = { current: null as MousePanGesture | null };

    const onPointerDown = (event: PointerEvent) => {
      if (optionsRef.current.enabled === false) return;

      if (event.pointerType === "touch") {
        const point = {
          x: event.clientX,
          y: event.clientY,
          pointerId: event.pointerId,
        };
        touchPoints.set(event.pointerId, point);
        try {
          viewport.setPointerCapture(event.pointerId);
        } catch {
          // Pointer capture can fail if the browser has already cancelled the pointer.
        }

        touchMetricsRef.current = getTouchMetrics(touchPoints);
        if (touchPoints.size >= 2) {
          updatePanning(true);
          event.preventDefault();
        }
        return;
      }

      // Left mouse button pans only while Space is held; middle-click always pans.
      const shouldPan =
        event.button === 1 || (event.button === 0 && getSpacePressed());
      if (!shouldPan) return;

      event.preventDefault();
      mousePanRef.current = {
        pointerId: event.pointerId,
        last: { x: event.clientX, y: event.clientY },
      };
      try {
        viewport.setPointerCapture(event.pointerId);
      } catch {
        // Pointer capture can fail if the browser has already cancelled the pointer.
      }
      updatePanning(true);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (optionsRef.current.enabled === false) return;

      if (event.pointerType === "touch") {
        const previousPoint = touchPoints.get(event.pointerId);
        if (!previousPoint) return;

        const previousMetrics = touchMetricsRef.current;
        touchPoints.set(event.pointerId, {
          x: event.clientX,
          y: event.clientY,
          pointerId: event.pointerId,
        });

        if (touchPoints.size >= 2) {
          const currentMetrics = getTouchMetrics(touchPoints);
          if (previousMetrics && currentMetrics)
            applyPinch(previousMetrics, currentMetrics);
          touchMetricsRef.current = currentMetrics;
          updatePanning(true);
          event.preventDefault();
          return;
        }

        // A single touch pans only if the Space key is currently held.
        touchMetricsRef.current = null;
        if (getSpacePressed()) {
          panBy(
            event.clientX - previousPoint.x,
            event.clientY - previousPoint.y,
          );
          updatePanning(true);
          event.preventDefault();
        } else {
          updatePanning(false);
        }
        return;
      }

      const mouseGesture = mousePanRef.current;
      if (!mouseGesture || mouseGesture.pointerId !== event.pointerId) return;

      const dx = event.clientX - mouseGesture.last.x;
      const dy = event.clientY - mouseGesture.last.y;
      mouseGesture.last = { x: event.clientX, y: event.clientY };
      panBy(dx, dy);
      event.preventDefault();
    };

    const finishPointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        touchPoints.delete(event.pointerId);
        touchMetricsRef.current = getTouchMetrics(touchPoints);
        if (touchPoints.size < 2 && !getSpacePressed()) updatePanning(false);
      }

      if (mousePanRef.current?.pointerId === event.pointerId) {
        mousePanRef.current = null;
        updatePanning(false);
      }

      try {
        if (viewport.hasPointerCapture(event.pointerId)) {
          viewport.releasePointerCapture(event.pointerId);
        }
      } catch {
        // Ignore browsers that no longer consider this pointer active.
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (optionsRef.current.enabled === false) return;
      event.preventDefault();

      const rect = viewport.getBoundingClientRect();
      const unit =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? 16
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? Math.max(rect.height, 1)
            : 1;
      const deltaY = event.deltaY * unit;
      const sensitivity = optionsRef.current.wheelSensitivity ?? 0.0015;
      const factor = Math.exp(-deltaY * sensitivity);
      const current = transformRef.current;
      const localPoint = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      zoomAt(localPoint, current.scale * factor, "wheel");
    };

    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", finishPointer);
    viewport.addEventListener("pointercancel", finishPointer);
    viewport.addEventListener("lostpointercapture", finishPointer);
    viewport.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerup", finishPointer);
      viewport.removeEventListener("pointercancel", finishPointer);
      viewport.removeEventListener("lostpointercapture", finishPointer);
      viewport.removeEventListener("wheel", onWheel);
      viewport.style.touchAction = previousTouchAction;
      viewport.style.userSelect = previousUserSelect;
      updatePanning(false);
    };
  }, [
    viewport,
    options.enabled,
    applyPinch,
    getSpacePressed,
    panBy,
    updatePanning,
    zoomAt,
  ]);

  const contentStyle = useMemo<CSSProperties>(
    () => ({
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`,
      transformOrigin: "0 0",
      willChange: "transform",
    }),
    [transform.x, transform.y, transform.scale],
  );

  return { ref, transform, contentStyle, isPanning, setTransform, reset };
}
