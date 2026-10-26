import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { UiwIconName } from "./uiw.types.ts";

const prefix = "uiw" as const;

type SSRUiwIconProps = Omit<SSRIconProps, "name"> & {
  name: UiwIconName;
};

const UiwIcon = ({ name, ...props }: SSRUiwIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { UiwIcon, type SSRUiwIconProps };
