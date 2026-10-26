import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { RivetIconsIconName } from "./rivet-icons.types.ts";

const prefix = "rivet-icons" as const;

type SSRRivetIconsIconProps = Omit<SSRIconProps, "name"> & {
  name: RivetIconsIconName;
};

const RivetIconsIcon = ({ name, ...props }: SSRRivetIconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { RivetIconsIcon, type SSRRivetIconsIconProps };
