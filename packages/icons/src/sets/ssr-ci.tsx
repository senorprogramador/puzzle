import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { CiIconName } from "./ci.types.ts";

const prefix = "ci" as const;

type SSRCiIconProps = Omit<SSRIconProps, "name"> & {
  name: CiIconName;
};

const CiIcon = ({ name, ...props }: SSRCiIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { CiIcon, type SSRCiIconProps };
