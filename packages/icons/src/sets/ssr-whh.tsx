import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { WhhIconName } from "./whh.types.ts";

const prefix = "whh" as const;

type SSRWhhIconProps = Omit<SSRIconProps, "name"> & {
  name: WhhIconName;
};

const WhhIcon = ({ name, ...props }: SSRWhhIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { WhhIcon, type SSRWhhIconProps };
