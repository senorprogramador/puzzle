import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { DuoIconsIconName } from "./duo-icons.types.ts";

const prefix = "duo-icons" as const;

type SSRDuoIconsIconProps = Omit<SSRIconProps, "name"> & {
  name: DuoIconsIconName;
};

const DuoIconsIcon = ({ name, ...props }: SSRDuoIconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { DuoIconsIcon, type SSRDuoIconsIconProps };
