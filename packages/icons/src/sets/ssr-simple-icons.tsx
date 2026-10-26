import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { SimpleIconsIconName } from "./simple-icons.types.ts";

const prefix = "simple-icons" as const;

type SSRSimpleIconsIconProps = Omit<SSRIconProps, "name"> & {
  name: SimpleIconsIconName;
};

const SimpleIconsIcon = ({ name, ...props }: SSRSimpleIconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { SimpleIconsIcon, type SSRSimpleIconsIconProps };
