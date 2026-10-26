import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { SiIconName } from "./si.types.ts";

const prefix = "si" as const;

type SSRSiIconProps = Omit<SSRIconProps, "name"> & {
  name: SiIconName;
};

const SiIcon = ({ name, ...props }: SSRSiIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { SiIcon, type SSRSiIconProps };
