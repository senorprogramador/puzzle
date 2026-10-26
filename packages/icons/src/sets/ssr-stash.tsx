import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { StashIconName } from "./stash.types.ts";

const prefix = "stash" as const;

type SSRStashIconProps = Omit<SSRIconProps, "name"> & {
  name: StashIconName;
};

const StashIcon = ({ name, ...props }: SSRStashIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { StashIcon, type SSRStashIconProps };
