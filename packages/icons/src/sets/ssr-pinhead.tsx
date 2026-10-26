import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { PinheadIconName } from "./pinhead.types.ts";

const prefix = "pinhead" as const;

type SSRPinheadIconProps = Omit<SSRIconProps, "name"> & {
  name: PinheadIconName;
};

const PinheadIcon = ({ name, ...props }: SSRPinheadIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { PinheadIcon, type SSRPinheadIconProps };
