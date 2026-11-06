import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

type ResizePosition = "left" | "right" | "top" | "bottom";

const KEYBOARD_STEP = 16;
const KEYBOARD_LARGE_STEP = 64;

const isHorizontal = (position: ResizePosition) =>
  position === "left" || position === "right";

// Left and top drawers grow when their bar moves away from the origin edge.
const getDirection = (position: ResizePosition) =>
  position === "left" || position === "top" ? 1 : -1;

const getViewportMax = (position: ResizePosition, margin: number) =>
  Math.max(
    margin,
    (isHorizontal(position) ? window.innerWidth : window.innerHeight) - margin,
  );

type UseResizeBarOptions = {
  /** Smallest size reachable with the keyboard, in px. */
  min?: number;
  /** Space kept free next to the drawer, in px. */
  margin?: number;
};

const useResizeBar = (
  position: ResizePosition,
  active: boolean,
  { min = 100, margin = 40 }: UseResizeBarOptions = {},
) => {
  const resizeRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<number | null>(null);
  const [measured, setMeasured] = useState<number | null>(null);

  const measure = useCallback(() => {
    const panel = resizeRef.current?.parentElement;

    if (!panel) {
      return null;
    }

    const rect = panel.getBoundingClientRect();
    const value = Math.round(isHorizontal(position) ? rect.width : rect.height);

    setMeasured(value);

    return value;
  }, [position]);

  useEffect(() => {
    if (active) {
      setSize(null);
    }
  }, [active, position]);

  useLayoutEffect(() => {
    if (active) {
      measure();
    }
  }, [active, size, position, measure]);

  useEffect(() => {
    if (!active) return;

    const element = resizeRef.current;

    if (!element) return;

    const body = element.ownerDocument.body;
    let activePointerId: number | null = null;
    let startPointer = 0;
    let startSize = 0;
    let previousUserSelect = "";
    let previousTouchAction = "";

    const endDrag = (event?: PointerEvent) => {
      if (activePointerId === null) return;

      if (event && element.hasPointerCapture?.(event.pointerId)) {
        element.releasePointerCapture(event.pointerId);
      }

      activePointerId = null;
      body.style.userSelect = previousUserSelect;
      body.style.touchAction = previousTouchAction;
    };

    const getPointer = (event: PointerEvent) =>
      isHorizontal(position) ? event.clientX : event.clientY;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0 && event.pointerType === "mouse") return;

      event.stopPropagation();

      const panel = element.parentElement;

      if (!panel) return;

      const rect = panel.getBoundingClientRect();

      activePointerId = event.pointerId;
      startPointer = getPointer(event);
      startSize = isHorizontal(position) ? rect.width : rect.height;

      previousUserSelect = body.style.userSelect;
      previousTouchAction = body.style.touchAction;
      body.style.userSelect = "none";
      body.style.touchAction = "none";

      element.setPointerCapture?.(event.pointerId);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerId !== activePointerId) return;

      event.stopPropagation();

      const delta = (getPointer(event) - startPointer) * getDirection(position);

      setSize(
        Math.min(
          Math.max(0, Math.round(startSize + delta)),
          getViewportMax(position, margin),
        ),
      );
    };

    const handlePointerEnd = (event: PointerEvent) => {
      if (event.pointerId !== activePointerId) return;

      endDrag(event);
    };

    element.addEventListener("pointerdown", handlePointerDown);
    element.addEventListener("pointermove", handlePointerMove);
    element.addEventListener("pointerup", handlePointerEnd);
    element.addEventListener("pointercancel", handlePointerEnd);

    return () => {
      element.removeEventListener("pointerdown", handlePointerDown);
      element.removeEventListener("pointermove", handlePointerMove);
      element.removeEventListener("pointerup", handlePointerEnd);
      element.removeEventListener("pointercancel", handlePointerEnd);

      endDrag();
    };
  }, [position, active, margin]);

  const max =
    typeof window === "undefined" ? min : getViewportMax(position, margin);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const current = size ?? measured ?? measure();

    if (current === null) return;

    const step = event.shiftKey ? KEYBOARD_LARGE_STEP : KEYBOARD_STEP;
    const direction = getDirection(position);
    const horizontal = isHorizontal(position);
    let next: number | null = null;

    switch (event.key) {
      case "ArrowRight":
        next = horizontal ? current + step * direction : null;
        break;
      case "ArrowLeft":
        next = horizontal ? current - step * direction : null;
        break;
      case "ArrowDown":
        next = horizontal ? null : current + step * direction;
        break;
      case "ArrowUp":
        next = horizontal ? null : current - step * direction;
        break;
      case "PageUp":
        next = current + KEYBOARD_LARGE_STEP;
        break;
      case "PageDown":
        next = current - KEYBOARD_LARGE_STEP;
        break;
      case "Home":
        next = min;
        break;
      case "End":
        next = max;
        break;
    }

    if (next === null) return;

    event.preventDefault();
    setSize(Math.min(Math.max(next, min), max));
  };

  return {
    size,
    value: size ?? measured,
    min,
    max,
    resizeRef,
    handleKeyDown,
  };
};

export { useResizeBar };
