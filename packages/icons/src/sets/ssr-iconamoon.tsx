import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { IconamoonIconName } from "./iconamoon.types.ts";

const prefix = "iconamoon" as const;

type SSRIconamoonIconProps = Omit<SSRIconProps, "name"> & {
  name: IconamoonIconName;
};

const IconamoonIcon = ({ name, ...props }: SSRIconamoonIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { IconamoonIcon, type SSRIconamoonIconProps };
