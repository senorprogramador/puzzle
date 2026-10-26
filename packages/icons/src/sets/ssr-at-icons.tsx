import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { AtIconsIconName } from "./at-icons.types.ts";

const prefix = "at-icons" as const;

type SSRAtIconsIconProps = Omit<SSRIconProps, "name"> & {
  name: AtIconsIconName;
};

const AtIconsIcon = ({ name, ...props }: SSRAtIconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { AtIconsIcon, type SSRAtIconsIconProps };
