import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { FeIconName } from "./fe.types.ts";

const prefix = "fe" as const;

type SSRFeIconProps = Omit<SSRIconProps, "name"> & {
  name: FeIconName;
};

const FeIcon = ({ name, ...props }: SSRFeIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { FeIcon, type SSRFeIconProps };
