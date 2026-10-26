import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { MeteorIconsIconName } from "./meteor-icons.types.ts";

const prefix = "meteor-icons" as const;

type SSRMeteorIconsIconProps = Omit<SSRIconProps, "name"> & {
  name: MeteorIconsIconName;
};

const MeteorIconsIcon = ({ name, ...props }: SSRMeteorIconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { MeteorIconsIcon, type SSRMeteorIconsIconProps };
