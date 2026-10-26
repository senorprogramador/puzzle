import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { TemakiIconName } from "./temaki.types.ts";

const prefix = "temaki" as const;

type SSRTemakiIconProps = Omit<SSRIconProps, "name"> & {
  name: TemakiIconName;
};

const TemakiIcon = ({ name, ...props }: SSRTemakiIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { TemakiIcon, type SSRTemakiIconProps };
