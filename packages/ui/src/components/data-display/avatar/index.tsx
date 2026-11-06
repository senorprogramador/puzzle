"use client";

import { cn, nameToInitials } from "@puzzle/core";
import { useState, type ComponentPropsWithRef } from "react";
import "./avatar.css";

type AvatarShape = "circle" | "square";
type AvatarProps = Omit<
  ComponentPropsWithRef<"img">,
  "src" | "alt" | "width" | "height"
> & {
  src?: string;
  alt?: string;
  size?: number;
  shape?: AvatarShape;
};

const Avatar = ({
  src,
  alt,
  size: propsSize = 32,
  shape = "circle",
  className,
  onError,
  ...rest
}: AvatarProps) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const classes = cn("puzzle-avatar", `puzzle-avatar-${shape}`, className);
  const size = Math.max(propsSize, 1);
  if (src && failedSrc !== src) {
    return (
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={classes}
        {...rest}
        onError={(event) => {
          onError?.(event);
          setFailedSrc(src);
        }}
      />
    );
  }
  return (
    <span
      role="img"
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={classes}
      style={{ width: size, height: size }}
      {...(rest as object)}
    >
      <span aria-hidden="true" className="puzzle-avatar-initials">
        {nameToInitials(alt ?? "")}
      </span>
    </span>
  );
};

export { Avatar, type AvatarProps, type AvatarShape };
