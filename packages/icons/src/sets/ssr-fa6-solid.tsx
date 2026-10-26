import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { Fa6SolidIconName } from "./fa6-solid.types.ts";

const prefix = "fa6-solid" as const;

type SSRFa6SolidIconProps = Omit<SSRIconProps, "name"> & {
  name: Fa6SolidIconName;
};

const Fa6SolidIcon = ({ name, ...props }: SSRFa6SolidIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { Fa6SolidIcon, type SSRFa6SolidIconProps };
