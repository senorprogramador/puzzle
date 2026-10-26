import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { PhIconName } from "./ph.types.ts";

const prefix = "ph" as const;

type SSRPhIconProps = Omit<SSRIconProps, "name"> & {
  name: PhIconName;
};

const PhIcon = ({ name, ...props }: SSRPhIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { PhIcon, type SSRPhIconProps };
