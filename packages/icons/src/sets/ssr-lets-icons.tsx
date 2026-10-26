import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { LetsIconsIconName } from "./lets-icons.types.ts";

const prefix = "lets-icons" as const;

type SSRLetsIconsIconProps = Omit<SSRIconProps, "name"> & {
  name: LetsIconsIconName;
};

const LetsIconsIcon = ({ name, ...props }: SSRLetsIconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { LetsIconsIcon, type SSRLetsIconsIconProps };
