import { cn } from "@puzzle-ui/core";
import type { ReactNode } from "react";
import "./media-frame.css";

type MediaFrameType = "none" | "browser" | "desktop" | "mobile";

type MediaFrameProps = {
  frame?: MediaFrameType;
  title?: ReactNode;
  caption?: ReactNode;
  className?: string;
  children: ReactNode;
};

const MediaFrame = ({
  frame = "none",
  title,
  caption,
  className,
  children,
}: MediaFrameProps) => (
  <figure
    className={cn("puzzle-media-frame", className)}
    data-frame={frame}
  >
    <div className="puzzle-media-frame__shell">
      {frame === "browser" ? (
        <div className="puzzle-media-frame__browser-bar" aria-hidden="true">
          <span className="puzzle-media-frame__browser-dot" />
          <span className="puzzle-media-frame__browser-dot" />
          <span className="puzzle-media-frame__browser-dot" />
          <span className="puzzle-media-frame__browser-title">
            {title ?? "Preview"}
          </span>
        </div>
      ) : null}
      <div className="puzzle-media-frame__viewport">{children}</div>
      {frame === "desktop" ? (
        <span
          className="puzzle-media-frame__desktop-stand"
          aria-hidden="true"
        />
      ) : null}
    </div>
    {caption ? (
      <figcaption className="puzzle-media-frame__caption">
        {caption}
      </figcaption>
    ) : null}
  </figure>
);

export {
  MediaFrame,
  type MediaFrameProps,
  type MediaFrameType,
};
