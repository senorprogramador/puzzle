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
import { cn } from "@puzzle/core";
import { useRovingFocus } from "@puzzle/hooks";
import { Icon } from "@puzzle/icons";
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
type PreviewJustify =
  "start" | "center" | "end" | "between" | "around" | "evenly";

type PreviewProps = {
  children: ReactNode;
  className?: string;
  defaultDevice?: PreviewDevice;
  code?: string;
  /** Frame height in pixels. Defaults to the selected device's height. */
  height?: number;
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
  defaultDevice = "mobile",
  code,
  height,
  align,
  justify,
  hideDevices = false,
}: PreviewProps) => {
  const generatedId = useId();
  const frameRootId = `${generatedId}-root`;
  const previewTabId = `${generatedId}-tab-preview`;
  const codeTabId = `${generatedId}-tab-code`;
  const panelId = `${generatedId}-panel`;
  const [device, setDevice] = useState<PreviewDevice>(defaultDevice);
  const [activeTab, setActiveTab] = useState<PreviewTab>("preview");
  const [frameRoot, setFrameRoot] = useState<HTMLElement | null>(null);
  const [scale, setScale] = useState(1);
  const [copied, setCopied] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const config = PREVIEW_DEVICES[device];
  const frameHeight = height ?? config.height;
  const hasCode = code !== undefined;
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
  const sectionRef = useRef<HTMLElement>(null);
  const isKeyboardNavigation = useRef(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (section) {
      // Computed style covers CSS `direction`; the attribute covers
      // environments that don't inherit it (such as jsdom).
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

  // Arrow keys only move focus between devices; Enter/Space selects one.
  const deviceFocus = useRovingFocus<HTMLButtonElement>({
    items: PREVIEW_DEVICE_ITEMS,
    dir: direction,
    initialActiveId: device,
  });

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

  // Tabs use automatic activation: keyboard focus also selects the tab.
  const handleTabFocus = (tab: PreviewTab) => {
    rovingFocus.onItemFocus(tab);

    if (isKeyboardNavigation.current) {
      setActiveTab(tab);
    }
  };

  const syncStyles = useCallback(() => {
    const frameDocument = iframeRef.current?.contentDocument;

    if (!frameDocument) return;

    const frameHead = frameDocument.head;

    frameHead
      .querySelectorAll("[data-puzzle-preview-style]")
      .forEach((element) => element.remove());

    // Theme renders its <style> where it is mounted (often inside <body>).
    document
      .querySelectorAll(
        'head link[rel="stylesheet"], head style, style[data-puzzle-theme]',
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

    // The document element is the only scroll container.
    targetRoot.style.setProperty("box-sizing", "border-box", "important");
    targetRoot.style.setProperty("width", "100%", "important");
    targetRoot.style.setProperty("height", "100%", "important");
    targetRoot.style.setProperty("min-height", "100%", "important");
    targetRoot.style.setProperty("margin", "0", "important");
    targetRoot.style.setProperty("overflow-x", "hidden", "important");
    targetRoot.style.setProperty("overflow-y", "auto", "important");
    targetRoot.style.setProperty("scrollbar-width", "none", "important");
    targetRoot.style.setProperty("-ms-overflow-style", "none", "important");

    // Keep the body in normal document flow.
    body.style.setProperty("display", "block", "important");
    body.style.setProperty("position", "static", "important");
    body.style.setProperty("box-sizing", "border-box", "important");
    body.style.setProperty("width", "100%", "important");
    body.style.setProperty("height", "auto", "important");
    body.style.setProperty("min-height", "100%", "important");
    body.style.setProperty("margin", "0", "important");
    body.style.setProperty("overflow", "visible", "important");

    // Remove the previous artificial minimum height.
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

  const updateScale = useCallback(
    (availableWidth: number) => {
      const nextScale = Math.min(1, Math.max(0, availableWidth) / config.width);

      setScale((current) =>
        Math.abs(current - nextScale) < 0.001 ? current : nextScale,
      );
    },
    [config.width],
  );

  // Calculate the initial scale and keep it synchronized with the container.
  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const measure = () => {
      const styles = window.getComputedStyle(container);
      const horizontalPadding =
        parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);

      updateScale(container.clientWidth - horizontalPadding);
    };

    measure();

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (entry) {
        updateScale(entry.contentRect.width);
      }
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, [updateScale]);

  // Keep application styles synchronized with the iframe.
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

    // Only react to style changes in the body, not to all page updates.
    const bodyObserver = new MutationObserver((mutations) => {
      const affectsStyles = mutations.some((mutation) => {
        const target =
          mutation.target instanceof Element
            ? mutation.target
            : mutation.target.parentElement;

        return (
          target?.closest("style[data-puzzle-theme]") != null ||
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

  // Initialize the iframe without blocking the React portal on stylesheets.
  const initializeFrame = useCallback(() => {
    const frameDocument = iframeRef.current?.contentDocument;
    const root = frameDocument?.getElementById(frameRootId);

    if (!root) return;

    syncStyles();
    setFrameRoot(root);
  }, [frameRootId, syncStyles]);

  // Handle both initial loading and an already-loaded iframe.
  useEffect(() => {
    initializeFrame();
  }, [initializeFrame]);

  // Copy the provided code to the clipboard.
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

  // If code is removed while selected, return to the preview.
  useEffect(() => {
    if (!hasCode && activeTab === "code") {
      setActiveTab("preview");
    }
  }, [activeTab, hasCode]);

  const frameStyle: CSSProperties = {
    width: config.width,
    height: frameHeight,
    transform: `scale(${scale})`,
    transformOrigin: "top left",
  };

  const contentStyle: CSSProperties = {
    display: "flex",
    boxSizing: "border-box",
    // The frame height is the iframe's viewport height.
    minHeight: "100vh",
    alignItems: align ? ALIGN_VALUES[align] : undefined,
    justifyContent: justify ? JUSTIFY_VALUES[justify] : undefined,
  };

  const viewportStyle: CSSProperties = {
    width: config.width * scale,
    aspectRatio: `${config.width} / ${frameHeight}`,
  };

  const panelProps = {
    id: panelId,
    role: "tabpanel",
    "aria-labelledby": activeTab === "preview" ? previewTabId : codeTabId,
  };

  return (
    <section ref={sectionRef} className={cn("puzzle-preview", className)}>
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
                      onClick={() => setDevice(item)}
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
          ref={containerRef}
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

            {frameRoot &&
              createPortal(
                <div style={contentStyle}>{children}</div>,
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
