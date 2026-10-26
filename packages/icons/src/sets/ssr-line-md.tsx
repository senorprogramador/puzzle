import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { LineMdIconName } from "./line-md.types.ts";

const prefix = "line-md" as const;

type SSRLineMdIconProps = Omit<SSRIconProps, "name"> & {
  name: LineMdIconName;
};

const LineMdIcon = ({ name, ...props }: SSRLineMdIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { LineMdIcon, type SSRLineMdIconProps };
