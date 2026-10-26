import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { MonoIconsIconName } from "./mono-icons.types.ts";

const prefix = "mono-icons" as const;

type SSRMonoIconsIconProps = Omit<SSRIconProps, "name"> & {
  name: MonoIconsIconName;
};

const MonoIconsIcon = ({ name, ...props }: SSRMonoIconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { MonoIconsIcon, type SSRMonoIconsIconProps };
