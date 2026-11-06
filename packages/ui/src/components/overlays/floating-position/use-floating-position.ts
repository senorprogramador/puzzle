"use client";

import { useLayoutEffect, useState, type CSSProperties } from "react";

import { calculatePosition } from "./calculate-position";

import type {
  FloatingPosition,
  UseFloatingPositionOptions,
} from "./floating-position.types";

type FloatingPositionState = {
  placement: FloatingPosition;
  style: CSSProperties;
};

const useFloatingPosition = ({
  anchor,
  content,
  enabled,
  position,
  align,
  offset,
  collisionPadding,
  matchTriggerWidth = false,
}: UseFloatingPositionOptions) => {
  const [result, setResult] = useState<FloatingPositionState | null>(null);

  useLayoutEffect(() => {
    if (!enabled || !anchor || !content) {
      setResult(null);
      return;
    }

    const ownerDocument = anchor.ownerDocument;
    const ownerWindow = ownerDocument.defaultView;

    if (!ownerWindow || content.ownerDocument !== ownerDocument) {
      setResult(null);
      return;
    }

    let animationFrame = 0;
    let disposed = false;

    const updatePosition = () => {
      if (
        disposed ||
        !anchor.isConnected ||
        !content.isConnected ||
        anchor.ownerDocument !== ownerDocument ||
        content.ownerDocument !== ownerDocument ||
        anchor.getClientRects().length === 0 ||
        content.getClientRects().length === 0
      ) {
        return;
      }

      const anchorRect = anchor.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();

      if (
        (anchorRect.width === 0 && anchorRect.height === 0) ||
        (contentRect.width === 0 && contentRect.height === 0)
      ) {
        return;
      }

      const placement = calculatePosition(anchorRect, contentRect, {
        position,
        align,
        offset,
        collisionPadding,
        viewportWidth: ownerDocument.documentElement.clientWidth,
        viewportHeight: ownerDocument.documentElement.clientHeight,
      });

      setResult({
        placement: placement.position,
        style: {
          position: "fixed",
          top: placement.coordinates.top,
          left: placement.coordinates.left,
          ...(matchTriggerWidth ? { minWidth: anchorRect.width } : {}),
        },
      });
    };

    const requestFrame =
      ownerWindow.requestAnimationFrame?.bind(ownerWindow) ??
      ((callback: FrameRequestCallback) =>
        ownerWindow.setTimeout(() => callback(Date.now()), 16));

    const cancelFrame =
      ownerWindow.cancelAnimationFrame?.bind(ownerWindow) ??
      ownerWindow.clearTimeout.bind(ownerWindow);

    const scheduleUpdate = () => {
      cancelFrame(animationFrame);
      animationFrame = requestFrame(updatePosition);
    };

    setResult(null);
    updatePosition();

    const ResizeObserverConstructor =
      ownerWindow.ResizeObserver ?? globalThis.ResizeObserver;

    const resizeObserver = ResizeObserverConstructor
      ? new ResizeObserverConstructor(scheduleUpdate)
      : null;

    resizeObserver?.observe(anchor);
    resizeObserver?.observe(content);

    const handleResize = () => scheduleUpdate();
    const handleScroll = () => scheduleUpdate();

    ownerWindow.addEventListener("resize", handleResize);
    ownerWindow.addEventListener("scroll", handleScroll, true);

    const visualViewport = ownerWindow.visualViewport;

    visualViewport?.addEventListener("resize", handleResize);
    visualViewport?.addEventListener("scroll", handleScroll);

    return () => {
      disposed = true;

      ownerWindow.cancelAnimationFrame(animationFrame);

      resizeObserver?.disconnect();

      ownerWindow.removeEventListener("resize", handleResize);
      ownerWindow.removeEventListener("scroll", handleScroll, true);

      visualViewport?.removeEventListener("resize", handleResize);
      visualViewport?.removeEventListener("scroll", handleScroll);
    };
  }, [
    anchor,
    content,
    enabled,
    position,
    align,
    offset,
    collisionPadding,
    matchTriggerWidth,
  ]);

  return {
    style: result?.style ?? null,
    placement: result?.placement ?? position,
    isPositioned: result !== null,
  };
};

export { useFloatingPosition };
