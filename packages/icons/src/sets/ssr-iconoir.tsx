import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { IconoirIconName } from "./iconoir.types.ts";

const prefix = "iconoir" as const;

type SSRIconoirIconProps = Omit<SSRIconProps, "name"> & {
  name: IconoirIconName;
};

const IconoirIcon = ({ name, ...props }: SSRIconoirIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { IconoirIcon, type SSRIconoirIconProps };
