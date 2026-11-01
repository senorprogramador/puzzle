"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@puzzle/core";
import "./preview.css";

type PreviewDevice = "mobile" | "tablet" | "desktop";

type DeviceConfig = {
  label: string;
  width: number;
  height: number;
};

type PreviewProps = {
  children: ReactNode;
  className?: string;
  defaultDevice?: PreviewDevice;
};

const PREVIEW_DEVICES: Record<PreviewDevice, DeviceConfig> = {
  mobile: { label: "Mobile", width: 390, height: 844 },
  tablet: { label: "Tablet", width: 768, height: 1024 },
  desktop: { label: "Desktop", width: 1024, height: 768 },
};

const PREVIEW_DOCUMENT = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <div id="puzzle-preview-root"></div>
  </body>
</html>`;

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const Preview = ({
  children,
  className,
  defaultDevice = "desktop",
}: PreviewProps) => {
  const [device, setDevice] = useState<PreviewDevice>(defaultDevice);
  const [frameRoot, setFrameRoot] = useState<HTMLElement | null>(null);
  const [scale, setScale] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const config = PREVIEW_DEVICES[device];

  const syncStyles = useCallback(() => {
    const frameDocument = iframeRef.current?.contentDocument;

    if (!frameDocument) return;

    const frameHead = frameDocument.head;

    frameHead
      .querySelectorAll("[data-puzzle-preview-style]")
      .forEach((element) => element.remove());

    document.head
      .querySelectorAll('link[rel="stylesheet"], style')
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
    frameDocument
      .getElementById("puzzle-preview-root")
      ?.style.removeProperty("min-height");

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
  }, []);

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
    const observer = new MutationObserver(syncStyles);

    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    });

    return () => observer.disconnect();
  }, [syncStyles]);

  // Initialize the iframe without blocking the React portal on stylesheets.
  const initializeFrame = useCallback(() => {
    const frameDocument = iframeRef.current?.contentDocument;
    const root = frameDocument?.getElementById("puzzle-preview-root");

    if (!root) return;

    syncStyles();
    setFrameRoot(root);
  }, [syncStyles]);

  // Handle both initial loading and an already-loaded iframe.
  useEffect(() => {
    initializeFrame();
  }, [initializeFrame]);

  const frameStyle: CSSProperties = {
    width: config.width,
    height: config.height,
    transform: `scale(${scale})`,
    transformOrigin: "top left",
  };

  const viewportStyle: CSSProperties = {
    width: config.width * scale,
    aspectRatio: `${config.width} / ${config.height}`,
  };

  return (
    <section className={cn("puzzle-preview", className)}>
      <div
        className="puzzle-preview__toolbar"
        role="toolbar"
        aria-label="Preview device"
      >
        <div
          className="puzzle-preview__devices"
          role="group"
          aria-label="Device size"
        >
          {(Object.keys(PREVIEW_DEVICES) as PreviewDevice[]).map((item) => (
            <button
              key={item}
              type="button"
              className={cn(
                "puzzle-preview__device",
                device === item && "puzzle-preview__device--active",
              )}
              aria-pressed={device === item}
              onClick={() => setDevice(item)}
            >
              {PREVIEW_DEVICES[item].label}
            </button>
          ))}
        </div>

        <span className="puzzle-preview__dimensions">
          {config.width} × {config.height}
        </span>
      </div>

      <div ref={containerRef} className="puzzle-preview__stage">
        <div className="puzzle-preview__viewport" style={viewportStyle}>
          <iframe
            ref={iframeRef}
            className="puzzle-preview__frame"
            srcDoc={PREVIEW_DOCUMENT}
            title={`${config.label} component preview`}
            onLoad={initializeFrame}
            style={frameStyle}
          />

          {frameRoot && createPortal(children, frameRoot)}
        </div>
      </div>
    </section>
  );
};

export { Preview, type PreviewProps, type PreviewDevice };
