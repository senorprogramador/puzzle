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
  mobile: {
    label: "Mobile",
    width: 390,
    height: 844,
  },
  tablet: {
    label: "Tablet",
    width: 768,
    height: 1024,
  },
  desktop: {
    label: "Desktop",
    width: 1024,
    height: 768,
  },
};

const PREVIEW_DOCUMENT = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1"
    />
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
  const initializationRef = useRef(0);

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

    frameDocument.body.className = document.body.className;
    frameDocument.body.style.cssText = document.body.style.cssText;
  }, []);

  const updateScale = useCallback(() => {
    const container = containerRef.current;

    if (!container) return;

    const availableWidth = container.clientWidth;
    const nextScale = Math.min(1, availableWidth / config.width);

    setScale((current) =>
      Math.abs(current - nextScale) < 0.001 ? current : nextScale,
    );
  }, [config.width]);

  // Determine the initial scale before the browser paints.
  useIsomorphicLayoutEffect(() => {
    updateScale();

    const container = containerRef.current;

    if (!container) return;

    const observer = new ResizeObserver(updateScale);
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

  // Wait until copied stylesheets and fonts are ready.
  const initializeFrame = useCallback(async () => {
    const frameDocument = iframeRef.current?.contentDocument;
    const root = frameDocument?.getElementById("puzzle-preview-root");

    if (!frameDocument || !root) return;

    const initialization = ++initializationRef.current;

    syncStyles();

    const stylesheets = Array.from(
      frameDocument.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'),
    );

    await Promise.all(
      stylesheets.map(
        (stylesheet) =>
          new Promise<void>((resolve) => {
            if (stylesheet.sheet) {
              resolve();
              return;
            }

            stylesheet.addEventListener("load", () => resolve(), {
              once: true,
            });

            stylesheet.addEventListener("error", () => resolve(), {
              once: true,
            });
          }),
      ),
    );

    await frameDocument.fonts.ready;

    if (initialization !== initializationRef.current) return;

    setFrameRoot((currentRoot) => (currentRoot === root ? currentRoot : root));
  }, [syncStyles]);

  useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe) return;

    iframe.addEventListener("load", initializeFrame);

    return () => {
      iframe.removeEventListener("load", initializeFrame);
      initializationRef.current++;
    };
  }, [initializeFrame]);

  // Keep the iframe content synchronized when the viewport changes.
  useEffect(() => {
    if (!frameRoot) return;

    const frameDocument = iframeRef.current?.contentDocument;

    if (!frameDocument) return;

    const measure = () => {
      // Reading the dimensions forces the browser to resolve layout.
      frameRoot.getBoundingClientRect();
    };

    const observer = new ResizeObserver(measure);

    observer.observe(frameRoot);
    observer.observe(frameDocument.documentElement);

    return () => observer.disconnect();
  }, [frameRoot, config.width]);

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
