import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { EpIconName } from "./ep.types.ts";

const prefix = "ep" as const;

type SSREpIconProps = Omit<SSRIconProps, "name"> & {
  name: EpIconName;
};

const EpIcon = ({ name, ...props }: SSREpIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { EpIcon, type SSREpIconProps };
