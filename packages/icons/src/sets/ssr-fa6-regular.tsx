import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { Fa6RegularIconName } from "./fa6-regular.types.ts";

const prefix = "fa6-regular" as const;

type SSRFa6RegularIconProps = Omit<SSRIconProps, "name"> & {
  name: Fa6RegularIconName;
};

const Fa6RegularIcon = ({ name, ...props }: SSRFa6RegularIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { Fa6RegularIcon, type SSRFa6RegularIconProps };
