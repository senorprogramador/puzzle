import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { GrommetIconsIconName } from "./grommet-icons.types.ts";

const prefix = "grommet-icons" as const;

type SSRGrommetIconsIconProps = Omit<SSRIconProps, "name"> & {
  name: GrommetIconsIconName;
};

const GrommetIconsIcon = ({ name, ...props }: SSRGrommetIconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { GrommetIconsIcon, type SSRGrommetIconsIconProps };
