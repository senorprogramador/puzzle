import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { BxlIconName } from "./bxl.types.ts";

const prefix = "bxl" as const;

type SSRBxlIconProps = Omit<SSRIconProps, "name"> & {
  name: BxlIconName;
};

const BxlIcon = ({ name, ...props }: SSRBxlIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { BxlIcon, type SSRBxlIconProps };
