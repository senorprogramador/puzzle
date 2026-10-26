import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { EvaIconName } from "./eva.types.ts";

const prefix = "eva" as const;

type SSREvaIconProps = Omit<SSRIconProps, "name"> & {
  name: EvaIconName;
};

const EvaIcon = ({ name, ...props }: SSREvaIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { EvaIcon, type SSREvaIconProps };
