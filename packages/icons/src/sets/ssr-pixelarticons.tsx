import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { PixelarticonsIconName } from "./pixelarticons.types.ts";

const prefix = "pixelarticons" as const;

type SSRPixelarticonsIconProps = Omit<SSRIconProps, "name"> & {
  name: PixelarticonsIconName;
};

const PixelarticonsIcon = ({ name, ...props }: SSRPixelarticonsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { PixelarticonsIcon, type SSRPixelarticonsIconProps };
