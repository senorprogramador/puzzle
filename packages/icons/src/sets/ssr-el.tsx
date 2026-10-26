import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { ElIconName } from "./el.types.ts";

const prefix = "el" as const;

type SSRElIconProps = Omit<SSRIconProps, "name"> & {
  name: ElIconName;
};

const ElIcon = ({ name, ...props }: SSRElIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { ElIcon, type SSRElIconProps };
