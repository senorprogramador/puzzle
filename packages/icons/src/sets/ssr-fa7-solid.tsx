import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { Fa7SolidIconName } from "./fa7-solid.types.ts";

const prefix = "fa7-solid" as const;

type SSRFa7SolidIconProps = Omit<SSRIconProps, "name"> & {
  name: Fa7SolidIconName;
};

const Fa7SolidIcon = ({ name, ...props }: SSRFa7SolidIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { Fa7SolidIcon, type SSRFa7SolidIconProps };
