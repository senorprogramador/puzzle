import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { EosIconsIconName } from "./eos-icons.types.ts";

const prefix = "eos-icons" as const;

type SSREosIconsIconProps = Omit<SSRIconProps, "name"> & {
  name: EosIconsIconName;
};

const EosIconsIcon = ({ name, ...props }: SSREosIconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { EosIconsIcon, type SSREosIconsIconProps };
