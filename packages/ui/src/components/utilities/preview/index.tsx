"use client";

import {
  useCallback,
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
import { highlightCode } from "./highlight";

import "./preview.css";

type PreviewDevice = "mobile" | "tablet" | "desktop";
type PreviewTab = "preview" | "code";

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
}: PreviewProps) => {
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

  const contentRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const config = PREVIEW_DEVICES[device];
  const fitsContent = height === undefined && fit === "content";
  const frameHeight = height ?? (fitsContent ? contentHeight : config.height);
  // Keep the content's natural height in the server render until the iframe is measured.
  const showPlaceholder = fitsContent && !contentMeasured;
  const hasCode = code !== undefined;
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
  const [desktopControlsVisible, setDesktopControlsVisible] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const isKeyboardNavigation = useRef(false);

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

    frameHead
      .querySelectorAll("[data-puzzle-preview-style]")
      .forEach((element) => element.remove());

    document
      .querySelectorAll(
        [
          "head link[rel='stylesheet']",
          "head style",
          "style[data-puzzle-theme]",
          "style[data-puzzle-theme-scope-style]",
        ].join(", "),
      )
      .forEach((element) => {
        const clone = element.cloneNode(true) as HTMLElement;

        clone.setAttribute("data-puzzle-preview-style", "");
        frameHead.appendChild(clone);
      });

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

    const scrollbarStyle = frameDocument.createElement("style");

    scrollbarStyle.setAttribute("data-puzzle-preview-style", "");
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
    const isStyleNode = (node: Node) =>
      node instanceof Element &&
      (node.matches("style, link[rel='stylesheet']") ||
        node.querySelector("style, link[rel='stylesheet']") !== null);

    const headObserver = new MutationObserver(syncStyles);

    headObserver.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    });

    const bodyObserver = new MutationObserver((mutations) => {
      const affectsStyles = mutations.some((mutation) => {
        const target =
          mutation.target instanceof Element
            ? mutation.target
            : mutation.target.parentElement;

        return (
          target?.closest(
            "style[data-puzzle-theme], style[data-puzzle-theme-scope-style]",
          ) != null ||
          Array.from(mutation.addedNodes).some(isStyleNode) ||
          Array.from(mutation.removedNodes).some(isStyleNode)
        );
      });

      if (affectsStyles) {
        syncStyles();
      }
    });

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
    };
  }, [syncStyles]);

  const initializeFrame = useCallback(() => {
    const frameDocument = iframeRef.current?.contentDocument;
    const root = frameDocument?.getElementById(frameRootId);

    if (!root) return;

    syncStyles();
    setFrameRoot(root);
  }, [frameRootId, syncStyles]);

  useEffect(() => {
    initializeFrame();
  }, [initializeFrame]);

  useIsomorphicLayoutEffect(() => {
    const content = contentRef.current;

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
  }, [activeTab, fitsContent, frameRoot]);

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
    visibility: showPlaceholder || !deviceResolved ? "hidden" : undefined,
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

      <PreviewBackground {...panelProps} className="puzzle-preview__panel">
        <div
          className="puzzle-preview__stage"
          hidden={activeTab !== "preview"}
        >
          <div className="puzzle-preview__viewport" style={viewportStyle}>
            <iframe
              ref={iframeRef}
              className="puzzle-preview__frame"
              srcDoc={createPreviewDocument(frameRootId)}
              title={`${config.label} component preview`}
              onLoad={initializeFrame}
              style={frameStyle}
            />

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

            {frameRoot &&
              createPortal(
                <ThemeScopeProvider
                  scopeId={themeScope?.scopeId ?? null}
                  theme={themeScope?.theme ?? "system"}
                >
                  <div
                    ref={contentRef}
                    className="puzzle-preview__content"
                    style={contentStyle}
                  >
                    {children}
                  </div>
                </ThemeScopeProvider>,
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
  type PreviewProps,
  type PreviewDevice,
  type PreviewAlign,
  type PreviewJustify,
};
