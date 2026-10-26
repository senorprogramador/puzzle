import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { ThesvgColorIconName } from "./thesvg-color.types.ts";

const prefix = "thesvg-color" as const;

type SSRThesvgColorIconProps = Omit<SSRIconProps, "name"> & {
  name: ThesvgColorIconName;
};

const ThesvgColorIcon = ({ name, ...props }: SSRThesvgColorIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { ThesvgColorIcon, type SSRThesvgColorIconProps };
