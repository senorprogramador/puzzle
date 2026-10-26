import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { ThesvgIconName } from "./thesvg.types.ts";

const prefix = "thesvg" as const;

type SSRThesvgIconProps = Omit<SSRIconProps, "name"> & {
  name: ThesvgIconName;
};

const ThesvgIcon = ({ name, ...props }: SSRThesvgIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { ThesvgIcon, type SSRThesvgIconProps };
