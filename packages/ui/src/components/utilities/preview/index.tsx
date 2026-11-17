"use client";

import {
  createContext,
  startTransition,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "@puzzle-ui/core";
import { useRovingFocus } from "@puzzle-ui/hooks";
import { Icon } from "@puzzle-ui/icons";
import { BREAKPOINTS } from "@puzzle-ui/theme";
import {
  ThemeScopeProvider,
  useThemeScope,
} from "@puzzle-ui/theme/scope-context";

import { Background } from "../../layout/background";
import { CircularProgress } from "../../data-display/progress/circular-progress";
import { highlightCode } from "./highlight";

import "./preview.css";

type PreviewDevice = "mobile" | "tablet" | "desktop";
type PreviewTab = "preview" | "code";
type PreviewLoading = "eager" | "lazy";

type PreviewProviderProps = {
  children: ReactNode;
  loading: PreviewLoading;
};

const PreviewLoadingContext = createContext<PreviewLoading>("eager");

const PreviewProvider = ({ children, loading }: PreviewProviderProps) => (
  <PreviewLoadingContext value={loading}>{children}</PreviewLoadingContext>
);

type DeviceConfig = {
  label: string;
  width: number;
  height: number;
};

type PreviewAlign = "start" | "center" | "end" | "stretch";
type PreviewCSSProperties = CSSProperties & {
  [property: `--${string}`]: string | number | undefined;
};
type PreviewJustify =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";

type PreviewProps = {
  children: ReactNode;
  className?: string;
  defaultDevice?: PreviewDevice;
  code?: string;
  /** Size to content (capped at mobile height) or the selected device. */
  fit?: "content" | "device";
  /** Frame height in pixels. Overrides fit. */
  height?: number;
  /** Space inside the preview frame, around the content. Numbers are pixels. */
  padding?: number | string;
  /** Vertical alignment of the content within the frame. */
  align?: PreviewAlign;
  /** Horizontal distribution of the content within the frame. */
  justify?: PreviewJustify;
  /** Hides the device selector. The default device is still used. */
  hideDevices?: boolean;
  /** Lazy previews mount near the viewport after page load and reserve device height. */
  loading?: PreviewLoading;
};

const PREVIEW_DEVICES: Record<PreviewDevice, DeviceConfig> = {
  mobile: { label: "Mobile", width: 390, height: 844 },
  tablet: { label: "Tablet", width: 768, height: 1024 },
  desktop: { label: "Desktop", width: 1024, height: 768 },
};

const getPreviewDevice = (): PreviewDevice => {
  if (window.innerWidth >= BREAKPOINTS.desktop) return "desktop";
  if (window.innerWidth >= BREAKPOINTS.tablet) return "tablet";
  return "mobile";
};

const PREVIEW_DEVICE_ITEMS = (
  Object.keys(PREVIEW_DEVICES) as PreviewDevice[]
).map((id) => ({ id }));

const ALIGN_VALUES: Record<PreviewAlign, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
};

const JUSTIFY_VALUES: Record<PreviewJustify, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
};

const createPreviewDocument = (rootId: string) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <div id="${rootId}"></div>
  </body>
</html>`;

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const PreviewBackground = (props: ComponentProps<"div">) => (
  <Background
    pattern="blueprint"
    size={20}
    majorSize={100}
    lineWidth={1}
    patternOpacity={0.25}
    {...props}
  />
);

const Preview = ({
  children,
  className,
  defaultDevice,
  code,
  fit = "content",
  height,
  padding = "var(--puzzle-space-8, 2rem)",
  align = "center",
  justify = "center",
  hideDevices = false,
  loading: loadingProp,
}: PreviewProps) => {
  const defaultLoading = useContext(PreviewLoadingContext);
  const loading = loadingProp ?? defaultLoading;
  const generatedId = useId();
  const frameRootId = `${generatedId}-root`;
  const previewTabId = `${generatedId}-tab-preview`;
  const codeTabId = `${generatedId}-tab-code`;
  const panelId = `${generatedId}-panel`;

  const themeScope = useThemeScope();

  const [device, setDevice] = useState<PreviewDevice>(defaultDevice ?? "mobile");
  const [automaticDevice, setAutomaticDevice] = useState(
    defaultDevice === undefined,
  );
  const [deviceResolved, setDeviceResolved] = useState(
    defaultDevice !== undefined,
  );
  const [activeTab, setActiveTab] = useState<PreviewTab>("preview");
  const [frameRoot, setFrameRoot] = useState<HTMLElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [contentHeight, setContentHeight] = useState(PREVIEW_DEVICES.mobile.height);
  const [contentMeasured, setContentMeasured] = useState(false);
  const [shouldRender, setShouldRender] = useState(loading === "eager");
  const [frameReady, setFrameReady] = useState(false);
  const [frameError, setFrameError] = useState(false);
  const [content, setContent] = useState<HTMLDivElement | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const styleClonesRef = useRef(new Map<Element, HTMLElement>());
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const config = PREVIEW_DEVICES[device];
  const fitsContent = height === undefined && fit === "content" && loading !== "lazy";
  const frameHeight = height ?? (fitsContent ? contentHeight : config.height);
  // Keep the content's natural height in the server render until the iframe is measured.
  const showPlaceholder = fitsContent && !contentMeasured;
  const hasCode = code !== undefined;
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
  const [desktopControlsVisible, setDesktopControlsVisible] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const isKeyboardNavigation = useRef(false);

  useEffect(() => {
    if (shouldRender) return;

    if (loading === "eager") {
      setShouldRender(true);
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    let nearViewport = false;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const cancel = () => {
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      clearTimeout(timeoutId);
      idleId = undefined;
      timeoutId = undefined;
    };
    const schedule = () => {
      cancel();
      if (!nearViewport || document.readyState !== "complete") return;

      const mount = () => startTransition(() => setShouldRender(true));
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(mount, { timeout: 1000 });
      } else {
        timeoutId = setTimeout(mount, 0);
      }
    };
    const observer = typeof IntersectionObserver === "undefined"
      ? undefined
      : new IntersectionObserver(([entry]) => {
          nearViewport = entry?.isIntersecting ?? false;
          schedule();
        }, { rootMargin: "200px" });

    if (observer) {
      observer.observe(section);
    } else {
      nearViewport = true;
      schedule();
    }
    window.addEventListener("load", schedule);

    return () => {
      cancel();
      observer?.disconnect();
      window.removeEventListener("load", schedule);
    };
  }, [loading, shouldRender]);

  useEffect(() => {
    const query = window.matchMedia(`(min-width: ${BREAKPOINTS.desktop}px)`);
    const update = () => setDesktopControlsVisible(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (section) {
      const isRtl =
        getComputedStyle(section).direction === "rtl" ||
        section.closest("[dir]")?.getAttribute("dir")?.toLowerCase() === "rtl";

      setDirection(isRtl ? "rtl" : "ltr");
    }
  }, []);

  const rovingFocus = useRovingFocus<HTMLButtonElement>({
    items: hasCode ? [{ id: "preview" }, { id: "code" }] : [{ id: "preview" }],
    dir: direction,
    initialActiveId: activeTab,
  });

  const deviceFocus = useRovingFocus<HTMLButtonElement>({
    items: PREVIEW_DEVICE_ITEMS.map((item) => ({
      ...item,
      disabled: item.id === "desktop" && !desktopControlsVisible,
    })),
    dir: direction,
    initialActiveId: device,
  });

  useIsomorphicLayoutEffect(() => {
    if (!automaticDevice) return;

    const updateDevice = () => {
      setDevice(getPreviewDevice());
    };

    updateDevice();
    setDeviceResolved(true);
    window.addEventListener("resize", updateDevice);
    return () => window.removeEventListener("resize", updateDevice);
  }, [automaticDevice]);

  useIsomorphicLayoutEffect(() => {
    deviceFocus.onItemFocus(device);
  }, [device, deviceFocus.onItemFocus, desktopControlsVisible]);

  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    tab: PreviewTab,
  ) => {
    isKeyboardNavigation.current = true;

    try {
      rovingFocus.onItemKeyDown(event, tab);
    } finally {
      isKeyboardNavigation.current = false;
    }
  };

  const handleTabFocus = (tab: PreviewTab) => {
    rovingFocus.onItemFocus(tab);

    if (isKeyboardNavigation.current) {
      setActiveTab(tab);
    }
  };

  const handleDeviceSelect = (nextDevice: PreviewDevice) => {
    setAutomaticDevice(false);
    setDevice(nextDevice);
    setDeviceResolved(true);
  };

  const syncStyles = useCallback(() => {
    const frameDocument = iframeRef.current?.contentDocument;

    if (!frameDocument) return;

    const frameHead = frameDocument.head;

    const sourceStyles = document.querySelectorAll(
      [
        "head link[rel='stylesheet']",
        "head style",
        "style[data-puzzle-theme]",
        "style[data-puzzle-theme-scope-style]",
      ].join(", "),
    );
    const nextClones = new Map<Element, HTMLElement>();
    let previousClone: HTMLElement | null = null;

    sourceStyles.forEach((element) => {
      const candidate = element.cloneNode(true) as HTMLElement;
      candidate.setAttribute("data-puzzle-preview-style", "");
      const previous = styleClonesRef.current.get(element);
      const clone = previous?.ownerDocument === frameDocument && previous.isEqualNode(candidate)
        ? previous
        : candidate;
      const insertionPoint = previousClone
        ? previousClone.nextSibling
        : frameHead.querySelector("[data-puzzle-preview-style], [data-puzzle-preview-scrollbars]");

      if (clone !== insertionPoint) frameHead.insertBefore(clone, insertionPoint);
      if (previous !== clone) previous?.remove();
      nextClones.set(element, clone);
      previousClone = clone;
    });
    styleClonesRef.current.forEach((clone, source) => {
      if (!nextClones.has(source)) clone.remove();
    });
    styleClonesRef.current = nextClones;

    const sourceRoot = document.documentElement;
    const targetRoot = frameDocument.documentElement;

    targetRoot.style.cssText = sourceRoot.style.cssText;
    targetRoot.className = sourceRoot.className;

    Array.from(sourceRoot.attributes).forEach((attribute) => {
      if (attribute.name === "style" || attribute.name === "class") {
        return;
      }

      targetRoot.setAttribute(attribute.name, attribute.value);
    });

    const body = frameDocument.body;

    body.className = document.body.className;
    body.style.cssText = document.body.style.cssText;

    targetRoot.style.setProperty("box-sizing", "border-box", "important");
    targetRoot.style.setProperty("width", "100%", "important");
    targetRoot.style.setProperty("height", "100%", "important");
    targetRoot.style.setProperty("min-height", "100%", "important");
    targetRoot.style.setProperty("margin", "0", "important");
    targetRoot.style.setProperty("padding", "0", "important");
    targetRoot.style.setProperty("overflow-x", "hidden", "important");
    targetRoot.style.setProperty("overflow-y", "auto", "important");
    targetRoot.style.setProperty("scrollbar-width", "none", "important");
    targetRoot.style.setProperty("-ms-overflow-style", "none", "important");

    body.style.setProperty("display", "block", "important");
    body.style.setProperty("position", "static", "important");
    body.style.setProperty("box-sizing", "border-box", "important");
    body.style.setProperty("width", "100%", "important");
    body.style.setProperty("height", "auto", "important");
    body.style.setProperty("min-height", "100%", "important");
    body.style.setProperty("margin", "0", "important");
    body.style.setProperty("padding", "0", "important");
    body.style.setProperty("overflow", "visible", "important");

    const previewRoot = frameDocument.getElementById(frameRootId);

    previewRoot?.style.removeProperty("min-height");

    if (frameHead.querySelector("[data-puzzle-preview-scrollbars]")) return;

    const scrollbarStyle = frameDocument.createElement("style");
    scrollbarStyle.setAttribute("data-puzzle-preview-scrollbars", "");
    scrollbarStyle.textContent = `
      html,
      body {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }

      html::-webkit-scrollbar,
      body::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }
    `;

    frameHead.appendChild(scrollbarStyle);
  }, [frameRootId]);

  useEffect(() => {
    if (!frameRoot) return;

    const isStyleNode = (node: Node) =>
      node instanceof Element &&
      (node.matches("style, link[rel='stylesheet']") ||
        node.querySelector("style, link[rel='stylesheet']") !== null);

    let syncId: number | undefined;
    const scheduleSync = () => {
      if (syncId !== undefined) return;
      syncId = requestAnimationFrame(() => {
        syncId = undefined;
        syncStyles();
      });
    };
    const handleMutations = (mutations: MutationRecord[]) => {
      const affectsStyles = mutations.some((mutation) => {
        const target =
          mutation.target instanceof Element
            ? mutation.target
            : mutation.target.parentElement;

        return (
          target?.closest("style, link[rel='stylesheet']") != null ||
          Array.from(mutation.addedNodes).some(isStyleNode) ||
          Array.from(mutation.removedNodes).some(isStyleNode)
        );
      });

      if (affectsStyles) {
        scheduleSync();
      }
    };
    const headObserver = new MutationObserver(handleMutations);
    headObserver.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    });

    const bodyObserver = new MutationObserver(handleMutations);

    bodyObserver.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      headObserver.disconnect();
      bodyObserver.disconnect();
      if (syncId !== undefined) cancelAnimationFrame(syncId);
    };
  }, [frameRoot, syncStyles]);

  const initializeFrame = useCallback(() => {
    const frameDocument = iframeRef.current?.contentDocument;
    const root = frameDocument?.getElementById(frameRootId);

    if (!root) return;

    syncStyles();
    setFrameRoot(root);
  }, [frameRootId, syncStyles]);

  useEffect(() => {
    if (shouldRender) initializeFrame();
  }, [initializeFrame, shouldRender]);

  useIsomorphicLayoutEffect(() => {
    if (!fitsContent || !frameRoot || !content || activeTab !== "preview") return;

    const measure = () => {
      const measuredHeight = Math.ceil(
        Math.max(content.getBoundingClientRect().height, content.scrollHeight),
      );

      setContentHeight(
        Math.min(PREVIEW_DEVICES.mobile.height, Math.max(1, measuredHeight)),
      );
      setContentMeasured(true);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(content);

    const mutations = new MutationObserver(measure);
    mutations.observe(content, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
    });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [activeTab, content, fitsContent, frameRoot]);

  useEffect(() => {
    if (!content) return;

    const frameDocument = content.ownerDocument;
    let cancelled = false;
    let paintId: number | undefined;
    let revision = 0;
    const reportError = (error: unknown) => {
      if (cancelled) return;
      console.error("Unable to load component preview.", error);
      setFrameError(true);
    };
    const checkReady = () => {
      const currentRevision = ++revision;
      if (paintId !== undefined) cancelAnimationFrame(paintId);
      const links = frameDocument.querySelectorAll<HTMLLinkElement>("link[rel='stylesheet']");
      if (Array.from(links).some((link) => !link.sheet)) return;

      Promise.resolve(frameDocument.fonts?.ready).then(() => {
        if (cancelled || revision !== currentRevision) return;
        paintId = requestAnimationFrame(() => setFrameReady(true));
      }).catch(reportError);
    };
    const handleError = (event: Event) => {
      const link = Array.from(
        frameDocument.querySelectorAll<HTMLLinkElement>("link[rel='stylesheet']"),
      ).find((element) => element === event.target);
      if (link) {
        reportError(new Error(`Unable to load preview stylesheet: ${link.href}`));
      }
    };
    // Theme changes and HMR can replace stylesheet links before they finish loading.
    const observer = new MutationObserver(checkReady);
    observer.observe(frameDocument.head, { childList: true, subtree: true, attributes: true, characterData: true });
    frameDocument.head.addEventListener("load", checkReady, true);
    frameDocument.head.addEventListener("error", handleError, true);
    checkReady();

    return () => {
      cancelled = true;
      observer.disconnect();
      frameDocument.head.removeEventListener("load", checkReady, true);
      frameDocument.head.removeEventListener("error", handleError, true);
      if (paintId !== undefined) cancelAnimationFrame(paintId);
    };
  }, [content]);

  const handleCopyCode = useCallback(async () => {
    if (code === undefined) return;

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);

      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  }, [code]);

  useEffect(
    () => () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!hasCode && activeTab === "code") {
      setActiveTab("preview");
    }
  }, [activeTab, hasCode]);

  const frameStyle: CSSProperties = {
    height: fitsContent ? frameHeight : "var(--_puzzle-preview-device-height)",
    visibility: showPlaceholder || !deviceResolved || !frameReady ? "hidden" : undefined,
  };

  const contentStyle: CSSProperties = {
    display: "flex",
    boxSizing: "border-box",
    padding,
    minHeight: fitsContent ? undefined : "100vh",
    alignItems: align ? ALIGN_VALUES[align] : undefined,
    justifyContent: justify ? JUSTIFY_VALUES[justify] : undefined,
  };

  const viewportStyle: CSSProperties = {
    height: fitsContent
      ? showPlaceholder
        ? undefined
        : `calc(${frameHeight}px * var(--_puzzle-preview-scale))`
      : "calc(var(--_puzzle-preview-device-height) * var(--_puzzle-preview-scale))",
    maxHeight: fitsContent
      ? `calc(${PREVIEW_DEVICES.mobile.height}px * var(--_puzzle-preview-scale))`
      : undefined,
  };

  const sectionStyle: PreviewCSSProperties = {
    "--_puzzle-preview-device-width": automaticDevice
      ? undefined
      : `${config.width}px`,
    "--_puzzle-preview-device-height": height !== undefined
      ? `${height}px`
      : automaticDevice ? undefined : `${config.height}px`,
  };

  const panelProps = {
    id: panelId,
    role: "tabpanel",
    "aria-labelledby": activeTab === "preview" ? previewTabId : codeTabId,
  };

  return (
    <section
      ref={sectionRef}
      className={cn("puzzle-preview", "not-prose", className)}
      data-auto-device={automaticDevice ? "" : undefined}
      style={sectionStyle}
    >
      <div className="puzzle-preview__toolbar">
        <div
          className="puzzle-preview__tabs"
          role="tablist"
          aria-label="Preview view"
        >
          <button
            type="button"
            role="tab"
            id={previewTabId}
            ref={rovingFocus.getItemRef("preview")}
            tabIndex={activeTab === "preview" ? 0 : -1}
            onFocus={() => handleTabFocus("preview")}
            onKeyDown={(event) => handleTabKeyDown(event, "preview")}
            aria-selected={activeTab === "preview"}
            aria-controls={panelId}
            className={cn(
              "puzzle-preview__tab",
              activeTab === "preview" && "puzzle-preview__tab--active",
            )}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </button>

          {hasCode && (
            <button
              type="button"
              role="tab"
              id={codeTabId}
              ref={rovingFocus.getItemRef("code")}
              tabIndex={activeTab === "code" ? 0 : -1}
              onFocus={() => handleTabFocus("code")}
              onKeyDown={(event) => handleTabKeyDown(event, "code")}
              aria-selected={activeTab === "code"}
              aria-controls={panelId}
              className={cn(
                "puzzle-preview__tab",
                activeTab === "code" && "puzzle-preview__tab--active",
              )}
              onClick={() => setActiveTab("code")}
            >
              Code
            </button>
          )}
        </div>

        {activeTab === "preview" ? (
          <div className="puzzle-preview__toolbar-actions">
            {!hideDevices && (
              <div
                className="puzzle-preview__devices"
                role="group"
                aria-label="Device size"
              >
                {(Object.keys(PREVIEW_DEVICES) as PreviewDevice[]).map(
                  (item) => (
                    <button
                      key={item}
                      data-device={item}
                      ref={deviceFocus.getItemRef(item)}
                      type="button"
                      className={cn(
                        "puzzle-preview__device",
                        device === item && "puzzle-preview__device--active",
                      )}
                      aria-pressed={device === item}
                      tabIndex={deviceFocus.getItemTabIndex(item)}
                      onFocus={() => deviceFocus.onItemFocus(item)}
                      onKeyDown={(event) =>
                        deviceFocus.onItemKeyDown(event, item)
                      }
                      onClick={() => handleDeviceSelect(item)}
                    >
                      {PREVIEW_DEVICES[item].label}
                    </button>
                  ),
                )}
              </div>
            )}

            <span className="puzzle-preview__dimensions">
              {config.width} × {frameHeight}
            </span>
          </div>
        ) : (
          <button
            type="button"
            className="puzzle-preview__copy"
            onClick={handleCopyCode}
            aria-label={copied ? "Code copied" : "Copy code"}
          >
            <Icon
              name={copied ? "tabler:check" : "tabler:copy"}
              size={16}
              aria-hidden="true"
            />
            <span>{copied ? "Copied" : "Copy code"}</span>
          </button>
        )}
      </div>

      <PreviewBackground
        {...panelProps}
        className="puzzle-preview__panel"
        aria-busy={activeTab === "preview" && !frameReady && !frameError}
      >
        <div
          className="puzzle-preview__stage"
          hidden={activeTab !== "preview"}
        >
          <div className="puzzle-preview__viewport" style={viewportStyle}>
            {shouldRender && <iframe
              ref={iframeRef}
              className="puzzle-preview__frame"
              srcDoc={createPreviewDocument(frameRootId)}
              title={`${config.label} component preview`}
              onLoad={initializeFrame}
              style={frameStyle}
              loading={loading}
            />}

            {showPlaceholder && (
              <div
                className="puzzle-preview__content puzzle-preview__placeholder"
                style={contentStyle}
                aria-hidden="true"
                inert
                data-preview-placeholder=""
              >
                {children}
              </div>
            )}

            {!frameReady && (
              <div className="puzzle-preview__loading">
                {frameError ? (
                  <span role="alert">Unable to load preview.</span>
                ) : (
                  <CircularProgress aria-label="Loading preview" />
                )}
              </div>
            )}

            {frameRoot &&
              createPortal(
                <Suspense fallback={null}>
                  <ThemeScopeProvider
                    scopeId={themeScope?.scopeId ?? null}
                    theme={themeScope?.theme ?? "system"}
                  >
                    <div
                      ref={setContent}
                      className="puzzle-preview__content"
                      style={contentStyle}
                    >
                      {children}
                    </div>
                  </ThemeScopeProvider>
                </Suspense>,
                frameRoot,
              )}
          </div>
        </div>

        {activeTab === "code" && (
          <div className="puzzle-preview__code">
            <pre>
              <code className="language-tsx">
                {code === undefined ? null : highlightCode(code)}
              </code>
            </pre>
          </div>
        )}
      </PreviewBackground>

      <span
        className="puzzle-preview__copy-status"
        role="status"
        aria-live="polite"
      >
        {copied ? "Code copied to clipboard." : ""}
      </span>
    </section>
  );
};

export {
  Preview,
  PreviewProvider,
  type PreviewProps,
  type PreviewProviderProps,
  type PreviewDevice,
  type PreviewAlign,
  type PreviewJustify,
};
