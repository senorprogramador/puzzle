import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { UimIconName } from "./uim.types.ts";

const prefix = "uim" as const;

type SSRUimIconProps = Omit<SSRIconProps, "name"> & {
  name: UimIconName;
};

const UimIcon = ({ name, ...props }: SSRUimIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { UimIcon, type SSRUimIconProps };
