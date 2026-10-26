import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { FoundationIconName } from "./foundation.types.ts";

const prefix = "foundation" as const;

type SSRFoundationIconProps = Omit<SSRIconProps, "name"> & {
  name: FoundationIconName;
};

const FoundationIcon = ({ name, ...props }: SSRFoundationIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { FoundationIcon, type SSRFoundationIconProps };
