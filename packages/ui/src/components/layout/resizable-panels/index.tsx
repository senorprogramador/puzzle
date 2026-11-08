"use client";

import { cn } from "@puzzle-ui/core";

import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
} from "react";

import {
  getPanelPairBounds,
  normalizePanelSizes,
  resizePanelPair,
  type PanelSizeConstraint,
} from "./resizable-panels.utils";

import "./resizable-panels.css";

type ResizablePanelsOrientation = "horizontal" | "vertical";

type ResizablePanelsProps = Omit<ComponentPropsWithRef<"div">, "children"> & {
  /** Layout direction. Defaults to horizontal. */
  orientation?: ResizablePanelsOrientation;

  /** Controlled panel sizes, expressed as percentages. */
  sizes?: readonly number[];

  /** Initial panel sizes for uncontrolled usage. */
  defaultSizes?: readonly number[];

  /** Called whenever the panel layout changes. */
  onSizesChange?: (sizes: number[]) => void;

  /** Disables all resizing interactions. */
  disabled?: boolean;

  /** Percentage change per keyboard interaction. Defaults to 1. */
  keyboardStep?: number;

  /** Panels and handles that make up the group. */
  children: ReactNode;
};

type ResizablePanelProps = ComponentPropsWithRef<"div"> & {
  /** Minimum panel size in percentages. Defaults to 0. */
  minSize?: number;

  /** Maximum panel size in percentages. Defaults to 100. */
  maxSize?: number;
};

type ResizableHandleProps = ComponentPropsWithRef<"div"> & {
  /** Renders a visible grip inside the resize handle. */
  withGrip?: boolean;

  /** Disables resizing through this handle. */
  disabled?: boolean;
};

type ResizePointerHandler = (
  event: ReactPointerEvent<HTMLDivElement>,
  handleIndex: number,
) => void;

type ResizeKeyboardHandler = (
  event: ReactKeyboardEvent<HTMLDivElement>,
  handleIndex: number,
) => void;

type InternalResizablePanelProps = {
  panelIndex?: number;
  panelSize?: number;
  panelId?: string;
};

type InternalResizableHandleProps = {
  handleIndex?: number;
  orientation?: ResizablePanelsOrientation;
  value?: number;
  minValue?: number;
  maxValue?: number;
  panelIds?: [string, string];
  inheritedDisabled?: boolean;

  onResizeStart?: ResizePointerHandler;
  onResizeMove?: ResizePointerHandler;
  onResizeEnd?: ResizePointerHandler;
  onResizeKeyDown?: ResizeKeyboardHandler;
};

type PointerDragState = {
  handleIndex: number;
  pointerId: number;
  startCoordinate: number;
  availableSize: number;
  direction: number;
  sizes: number[];
};

const isResizablePanelElement = (
  child: ReactNode,
): child is ReactElement<ResizablePanelProps> =>
  isValidElement(child) && child.type === ResizablePanel;

const isResizableHandleElement = (
  child: ReactNode,
): child is ReactElement<ResizableHandleProps> =>
  isValidElement(child) && child.type === ResizableHandle;

const parsePixels = (value: string | undefined) =>
  Number.parseFloat(value ?? "") || 0;

const getAvailableSize = (
  group: HTMLDivElement,
  orientation: ResizablePanelsOrientation,
) => {
  const computedStyle =
    group.ownerDocument.defaultView?.getComputedStyle(group);

  const isHorizontal = orientation === "horizontal";

  const totalSize = isHorizontal ? group.clientWidth : group.clientHeight;

  const paddingSize = computedStyle
    ? isHorizontal
      ? parsePixels(computedStyle.paddingLeft) +
        parsePixels(computedStyle.paddingRight)
      : parsePixels(computedStyle.paddingTop) +
        parsePixels(computedStyle.paddingBottom)
    : 0;

  const handleSize = Array.from(group.children).reduce((total, child) => {
    const element = child as HTMLElement;

    if (!element.hasAttribute("data-puzzle-resizable-handle")) {
      return total;
    }

    const rect = element.getBoundingClientRect();

    return total + (isHorizontal ? rect.width : rect.height);
  }, 0);

  return Math.max(0, totalSize - paddingSize - handleSize);
};

const getResizeDirection = (
  element: HTMLElement,
  orientation: ResizablePanelsOrientation,
) => {
  if (orientation !== "horizontal") {
    return 1;
  }

  const direction =
    element.ownerDocument.defaultView?.getComputedStyle(element).direction;

  return direction === "rtl" ? -1 : 1;
};

const getPointerCoordinate = (
  event: ReactPointerEvent<HTMLDivElement>,
  orientation: ResizablePanelsOrientation,
) => (orientation === "horizontal" ? event.clientX : event.clientY);

const ResizablePanel = ({
  id,
  minSize = 0,
  maxSize = 100,
  panelIndex = 0,
  panelSize = 1,
  panelId,
  className,
  style,
  ...props
}: ResizablePanelProps & InternalResizablePanelProps) => (
  <div
    {...props}
    id={panelId ?? id}
    className={cn("puzzle-resizable-panels__panel", className)}
    style={{
      ...style,
      flex: `${panelSize} 1 0%`,
    }}
    data-panel-index={panelIndex}
    data-panel-size={panelSize}
    data-panel-min-size={minSize}
    data-panel-max-size={maxSize}
  />
);

const ResizableHandle = ({
  withGrip = false,
  disabled = false,
  handleIndex = -1,
  orientation = "horizontal",
  value,
  minValue,
  maxValue,
  panelIds,
  inheritedDisabled = false,
  onResizeStart,
  onResizeMove,
  onResizeEnd,
  onResizeKeyDown,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onLostPointerCapture,
  onKeyDown,
  className,
  children,
  tabIndex,
  "aria-label": ariaLabel,
  ...props
}: ResizableHandleProps & InternalResizableHandleProps) => {
  const isDisabled = disabled || inheritedDisabled;

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    onPointerDown?.(event);

    if (!event.defaultPrevented && !isDisabled) {
      onResizeStart?.(event, handleIndex);
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);

    if (!event.defaultPrevented && !isDisabled) {
      onResizeMove?.(event, handleIndex);
    }
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    onResizeEnd?.(event, handleIndex);
    onPointerUp?.(event);
  };

  const handlePointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    onResizeEnd?.(event, handleIndex);
    onPointerCancel?.(event);
  };

  const handleLostPointerCapture = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    onResizeEnd?.(event, handleIndex);
    onLostPointerCapture?.(event);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);

    if (!event.defaultPrevented && !isDisabled) {
      onResizeKeyDown?.(event, handleIndex);
    }
  };

  return (
    <div
      {...props}
      className={cn("puzzle-resizable-panels__handle", className)}
      role="separator"
      tabIndex={isDisabled ? -1 : (tabIndex ?? 0)}
      aria-label={ariaLabel ?? "Resize panels"}
      aria-orientation={
        orientation === "horizontal" ? "vertical" : "horizontal"
      }
      aria-controls={panelIds?.join(" ")}
      aria-valuenow={value}
      aria-valuemin={minValue}
      aria-valuemax={maxValue}
      aria-valuetext={
        value === undefined ? undefined : `${Math.round(value * 100) / 100}%`
      }
      aria-disabled={isDisabled || undefined}
      data-puzzle-resizable-handle=""
      data-orientation={orientation}
      data-disabled={isDisabled ? "true" : undefined}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onLostPointerCapture={handleLostPointerCapture}
      onKeyDown={handleKeyDown}
    >
      {withGrip ? (
        <span
          className="puzzle-resizable-panels__handle-grip"
          aria-hidden="true"
        />
      ) : (
        children
      )}
    </div>
  );
};

const ResizablePanelsRoot = ({
  children,
  orientation = "horizontal",
  sizes,
  defaultSizes,
  onSizesChange,
  disabled = false,
  keyboardStep = 1,
  id,
  role,
  className,
  style,
  ref: forwardedRef,
  ...rootProps
}: ResizablePanelsProps) => {
  const generatedId = useId();

  const groupId = id ?? `puzzle-resizable-panels-${generatedId}`;

  if (!Number.isFinite(keyboardStep) || keyboardStep <= 0) {
    throw new RangeError("keyboardStep must be a positive finite number.");
  }

  const childrenArray = Children.toArray(children);

  const validChildren =
    childrenArray.length >= 3 &&
    childrenArray.length % 2 === 1 &&
    childrenArray.every((child, index) =>
      index % 2 === 0
        ? isResizablePanelElement(child)
        : isResizableHandleElement(child),
    );

  if (!validChildren) {
    throw new Error(
      "ResizablePanels requires alternating Panel and Handle children, starting and ending with a Panel. At least two panels are required.",
    );
  }

  const panelElements = childrenArray.filter(isResizablePanelElement);

  const panelCount = panelElements.length;

  const panelConstraints: PanelSizeConstraint[] = panelElements.map(
    (panel) => ({
      minSize: panel.props.minSize,
      maxSize: panel.props.maxSize,
    }),
  );

  const panelIds = panelElements.map(
    (panel, index) => panel.props.id ?? `${groupId}-panel-${index}`,
  );

  if (new Set(panelIds).size !== panelIds.length) {
    throw new Error("ResizablePanels requires unique panel IDs.");
  }

  const [uncontrolledSizes, setUncontrolledSizes] = useState<number[]>(() =>
    normalizePanelSizes(
      sizes === undefined ? defaultSizes : undefined,
      panelConstraints,
    ),
  );

  const layoutInput =
    sizes ??
    (uncontrolledSizes.length === panelCount ? uncontrolledSizes : undefined);

  const currentSizes = normalizePanelSizes(layoutInput, panelConstraints);

  const [isResizing, setIsResizing] = useState(false);

  const groupRef = useRef<HTMLDivElement | null>(null);

  const pointerDragRef = useRef<PointerDragState | null>(null);

  const updateSizes = (nextSizes: readonly number[]) => {
    const normalized = normalizePanelSizes(nextSizes, panelConstraints);

    const hasChanged = normalized.some(
      (size, index) => Math.abs(size - currentSizes[index]) > 0.000001,
    );

    if (!hasChanged) {
      return;
    }

    if (sizes === undefined) {
      setUncontrolledSizes(normalized);
    }

    onSizesChange?.(normalized);
  };

  const handlePointerDown: ResizePointerHandler = (event, handleIndex) => {
    const group = groupRef.current;

    if (!group || disabled) {
      return;
    }

    if (
      event.button !== 0 &&
      event.pointerType !== "touch" &&
      event.pointerType !== "pen"
    ) {
      return;
    }

    const availableSize = getAvailableSize(group, orientation);

    if (availableSize <= 0) {
      return;
    }

    pointerDragRef.current = {
      handleIndex,
      pointerId: event.pointerId,
      startCoordinate: getPointerCoordinate(event, orientation),
      availableSize,
      direction: getResizeDirection(group, orientation),
      sizes: [...currentSizes],
    };

    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Synthetic pointer events and detached elements may not
      // support pointer capture.
    }

    event.preventDefault();
    setIsResizing(true);
  };

  const handlePointerMove: ResizePointerHandler = (event, handleIndex) => {
    const drag = pointerDragRef.current;

    if (
      !drag ||
      drag.pointerId !== event.pointerId ||
      drag.handleIndex !== handleIndex
    ) {
      return;
    }

    const currentCoordinate = getPointerCoordinate(event, orientation);

    const delta =
      ((currentCoordinate - drag.startCoordinate) / drag.availableSize) *
      100 *
      drag.direction;

    const nextSizes = resizePanelPair(
      drag.sizes,
      panelConstraints,
      handleIndex,
      delta,
    );

    event.preventDefault();
    updateSizes(nextSizes);
  };

  const handlePointerEnd: ResizePointerHandler = (event, handleIndex) => {
    const drag = pointerDragRef.current;

    if (
      !drag ||
      drag.pointerId !== event.pointerId ||
      drag.handleIndex !== handleIndex
    ) {
      return;
    }

    pointerDragRef.current = null;
    setIsResizing(false);
  };

  const handleKeyDown: ResizeKeyboardHandler = (event, handleIndex) => {
    if (disabled) {
      return;
    }

    const currentSize = currentSizes[handleIndex];

    const bounds = getPanelPairBounds(
      currentSizes,
      panelConstraints,
      handleIndex,
    );

    const group = groupRef.current;

    const direction = group ? getResizeDirection(group, orientation) : 1;

    const step = keyboardStep * (event.shiftKey ? 10 : 1);

    let nextSize: number | undefined;

    if (event.key === "Home") {
      nextSize = bounds.minSize;
    } else if (event.key === "End") {
      nextSize = bounds.maxSize;
    } else if (orientation === "horizontal") {
      if (event.key === "ArrowRight") {
        nextSize = currentSize + step * direction;
      } else if (event.key === "ArrowLeft") {
        nextSize = currentSize - step * direction;
      }
    } else {
      if (event.key === "ArrowDown") {
        nextSize = currentSize + step;
      } else if (event.key === "ArrowUp") {
        nextSize = currentSize - step;
      }
    }

    if (nextSize === undefined) {
      return;
    }

    event.preventDefault();

    updateSizes(
      resizePanelPair(
        currentSizes,
        panelConstraints,
        handleIndex,
        nextSize - currentSize,
      ),
    );
  };

  let panelIndex = 0;

  const enhancedChildren = childrenArray.map((child) => {
    if (isResizablePanelElement(child)) {
      const index = panelIndex++;

      return cloneElement(
        child as ReactElement<
          ResizablePanelProps & InternalResizablePanelProps
        >,
        {
          panelIndex: index,
          panelSize: currentSizes[index],
          panelId: panelIds[index],
        },
      );
    }

    const handleIndex = panelIndex - 1;

    const bounds = getPanelPairBounds(
      currentSizes,
      panelConstraints,
      handleIndex,
    );

    return cloneElement(
      child as ReactElement<
        ResizableHandleProps & InternalResizableHandleProps
      >,
      {
        handleIndex,
        orientation,
        value: currentSizes[handleIndex],
        minValue: bounds.minSize,
        maxValue: bounds.maxSize,
        panelIds: [panelIds[handleIndex], panelIds[handleIndex + 1]],
        inheritedDisabled: disabled,
        onResizeStart: handlePointerDown,
        onResizeMove: handlePointerMove,
        onResizeEnd: handlePointerEnd,
        onResizeKeyDown: handleKeyDown,
      },
    );
  });

  return (
    <div
      {...rootProps}
      ref={(node) => {
        groupRef.current = node;

        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      }}
      id={groupId}
      role={role ?? "group"}
      className={cn("puzzle-resizable-panels", className)}
      style={style}
      data-orientation={orientation}
      data-disabled={disabled ? "true" : undefined}
      data-resizing={isResizing ? "true" : undefined}
    >
      {enhancedChildren}
    </div>
  );
};

type ResizablePanelsComponent = typeof ResizablePanelsRoot & {
  Panel: typeof ResizablePanel;
  Handle: typeof ResizableHandle;
};

const ResizablePanels = Object.assign(ResizablePanelsRoot, {
  Panel: ResizablePanel,
  Handle: ResizableHandle,
}) as ResizablePanelsComponent;

export {
  ResizablePanels,
  ResizablePanel,
  ResizableHandle,
  type ResizablePanelsProps,
  type ResizablePanelProps,
  type ResizableHandleProps,
  type ResizablePanelsOrientation,
};
