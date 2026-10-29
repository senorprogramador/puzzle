"use client";

import {
  useCallback,
  useEffect,
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
</html>` as const;

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

    frameDocument.body.className = document.body.className;
    frameDocument.body.style.cssText = document.body.style.cssText;
  }, []);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;

      const availableWidth = entry.contentRect.width;
      const nextScale = Math.min(1, availableWidth / config.width);

      setScale(nextScale);
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, [config.width]);

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

  const initializeFrame = useCallback(() => {
    const frameDocument = iframeRef.current?.contentDocument;
    const root = frameDocument?.getElementById("puzzle-preview-root");

    if (!root) return;

    syncStyles();

    setFrameRoot((currentRoot) => (currentRoot === root ? currentRoot : root));
  }, [syncStyles]);

  useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe) return;

    const handleLoad = () => {
      initializeFrame();
    };

    iframe.addEventListener("load", handleLoad);

    // Vangt ook het geval op waarin het iframe al geladen is.
    initializeFrame();

    return () => {
      iframe.removeEventListener("load", handleLoad);
    };
  }, [initializeFrame]);

  const frameStyle: CSSProperties = {
    width: config.width,
    height: config.height,
    transform: `scale(${scale})`,
  };

  const viewportStyle: CSSProperties = {
    width: config.width * scale,
    height: config.height * scale,
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
