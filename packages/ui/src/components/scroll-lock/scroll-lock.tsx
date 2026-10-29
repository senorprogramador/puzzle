"use client";

import { useEffect } from "react";

type ScrollLockProps = {
  /** Whether body scrolling should be locked. */
  enabled?: boolean;
};

type InlineStyleSnapshot = {
  value: string;
  priority: string;
};

const BODY_STYLE_PROPERTIES = [
  "overflow",
  "padding-right",
  "position",
  "top",
  "left",
  "width",
] as const;

const HTML_STYLE_PROPERTIES = ["scrollbar-gutter", "scroll-behavior"] as const;

type BodyStyleProperty = (typeof BODY_STYLE_PROPERTIES)[number];
type HtmlStyleProperty = (typeof HTML_STYLE_PROPERTIES)[number];

type ScrollLockState = {
  count: number;
  scrollX: number;
  scrollY: number;
  isIOS: boolean;
  bodyStyles: Record<BodyStyleProperty, InlineStyleSnapshot>;
  htmlStyles: Record<HtmlStyleProperty, InlineStyleSnapshot>;
};

const scrollLocks = new WeakMap<Document, ScrollLockState>();

const getStyleSnapshots = <T extends string>(
  style: CSSStyleDeclaration,
  properties: readonly T[],
): Record<T, InlineStyleSnapshot> => {
  const snapshots = {} as Record<T, InlineStyleSnapshot>;

  for (const property of properties) {
    snapshots[property] = {
      value: style.getPropertyValue(property),
      priority: style.getPropertyPriority(property),
    };
  }

  return snapshots;
};

const restoreInlineStyle = (
  style: CSSStyleDeclaration,
  property: string,
  snapshot: InlineStyleSnapshot,
) => {
  if (snapshot.value) {
    style.setProperty(property, snapshot.value, snapshot.priority);
    return;
  }

  style.removeProperty(property);
};

const restoreStyleSnapshots = <T extends string>(
  style: CSSStyleDeclaration,
  snapshots: Record<T, InlineStyleSnapshot>,
) => {
  for (const property of Object.keys(snapshots) as T[]) {
    restoreInlineStyle(style, property, snapshots[property]);
  }
};

const isIOSDevice = (window: Window) => {
  const { navigator } = window;

  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
};

const getScrollbarWidth = (document: Document) => {
  const window = document.defaultView;

  if (!window) {
    return 0;
  }

  return Math.max(0, window.innerWidth - document.documentElement.clientWidth);
};

const lockScroll = (document: Document) => {
  const body = document.body;
  const html = document.documentElement;
  const window = document.defaultView;

  if (!body || !window) {
    return () => {};
  }

  const existingState = scrollLocks.get(document);

  if (existingState) {
    existingState.count += 1;

    return () => unlockScroll(document);
  }

  const computedBodyStyle = window.getComputedStyle(body);
  const computedGutter = window
    .getComputedStyle(html)
    .getPropertyValue("scrollbar-gutter");

  const supportsStableGutter =
    typeof window.CSS !== "undefined" &&
    window.CSS.supports("scrollbar-gutter: stable");

  const hasStableGutter = computedGutter.split(/\s+/).includes("stable");

  const isIOS = isIOSDevice(window);

  const state: ScrollLockState = {
    count: 1,
    scrollX: window.scrollX,
    scrollY: window.scrollY,
    isIOS,
    bodyStyles: getStyleSnapshots(body.style, BODY_STYLE_PROPERTIES),
    htmlStyles: getStyleSnapshots(html.style, HTML_STYLE_PROPERTIES),
  };

  scrollLocks.set(document, state);

  // Reserve the scrollbar gutter in browsers that support it.
  if (supportsStableGutter && !hasStableGutter) {
    html.style.setProperty("scrollbar-gutter", "stable", "important");
  }

  // Fallback for browsers without scrollbar-gutter.
  if (!supportsStableGutter && !isIOS) {
    const scrollbarWidth = getScrollbarWidth(document);

    if (scrollbarWidth > 0) {
      const paddingRight =
        Number.parseFloat(computedBodyStyle.paddingRight) || 0;

      body.style.setProperty(
        "padding-right",
        `${paddingRight + scrollbarWidth}px`,
        "important",
      );
    }
  }

  body.style.setProperty("overflow", "hidden", "important");

  // iOS Safari needs additional protection against touch scrolling.
  if (isIOS) {
    body.style.setProperty("position", "fixed", "important");
    body.style.setProperty("top", `${-state.scrollY}px`, "important");
    body.style.setProperty("left", `${-state.scrollX}px`, "important");
    body.style.setProperty("width", `${html.clientWidth}px`, "important");
  }

  return () => unlockScroll(document);
};

const unlockScroll = (document: Document) => {
  const state = scrollLocks.get(document);
  const body = document.body;
  const html = document.documentElement;
  const window = document.defaultView;

  if (!state || !body || !window) {
    return;
  }

  state.count -= 1;

  // Keep the lock active while another overlay still needs it.
  if (state.count > 0) {
    return;
  }

  scrollLocks.delete(document);

  // Restore the exact original inline declarations and priorities.
  restoreStyleSnapshots(body.style, state.bodyStyles);

  // Explicitly restore the original scrollbar-gutter value.
  restoreInlineStyle(
    html.style,
    "scrollbar-gutter",
    state.htmlStyles["scrollbar-gutter"],
  );

  // Avoid an animated scroll when restoring the previous position.
  html.style.setProperty("scroll-behavior", "auto", "important");

  try {
    if (state.isIOS) {
      window.scrollTo(state.scrollX, state.scrollY);
    }
  } finally {
    restoreInlineStyle(
      html.style,
      "scroll-behavior",
      state.htmlStyles["scroll-behavior"],
    );
  }
};

const ScrollLock = ({ enabled = true }: ScrollLockProps) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    return lockScroll(window.document);
  }, [enabled]);

  return null;
};

export { ScrollLock };
export type { ScrollLockProps };
