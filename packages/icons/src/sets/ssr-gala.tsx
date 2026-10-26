import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { GalaIconName } from "./gala.types.ts";

const prefix = "gala" as const;

type SSRGalaIconProps = Omit<SSRIconProps, "name"> & {
  name: GalaIconName;
};

const GalaIcon = ({ name, ...props }: SSRGalaIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { GalaIcon, type SSRGalaIconProps };
