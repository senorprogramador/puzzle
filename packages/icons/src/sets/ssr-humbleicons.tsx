import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { HumbleiconsIconName } from "./humbleicons.types.ts";

const prefix = "humbleicons" as const;

type SSRHumbleiconsIconProps = Omit<SSRIconProps, "name"> & {
  name: HumbleiconsIconName;
};

const HumbleiconsIcon = ({ name, ...props }: SSRHumbleiconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { HumbleiconsIcon, type SSRHumbleiconsIconProps };
