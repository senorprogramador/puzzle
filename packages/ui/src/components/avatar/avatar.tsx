import { cn, nameToInitials } from "@puzzle/core";
import { type ComponentPropsWithRef } from "react";
import "./avatar.css";

type AvatarProps = Omit<
  ComponentPropsWithRef<"img">,
  "src" | "alt" | "width" | "height"
> & {
  src?: string;
  alt?: string;
  size?: number;
  shape?: "circle" | "square";
};

const Avatar = ({
  src,
  alt,
  size: propsSize = 32,
  shape = "circle",
  className,
  ...rest
}: AvatarProps) => {
  const classes = cn("puzzle-avatar", `puzzle-avatar-${shape}`, className);
  const size = Math.max(propsSize, 32);
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={classes}
        {...rest}
      />
    );
  }
  return (
    <span
      aria-label={alt}
      className={classes}
      style={{ width: size, height: size }}
      {...rest}
    >
      <span className="puzzle-avatar-initials">
        {nameToInitials(alt ?? "")}
      </span>
    </span>
  );
};

export { Avatar, type AvatarProps };
