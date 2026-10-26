import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { FaSolidIconName } from "./fa-solid.types.ts";

const prefix = "fa-solid" as const;

type SSRFaSolidIconProps = Omit<SSRIconProps, "name"> & {
  name: FaSolidIconName;
};

const FaSolidIcon = ({ name, ...props }: SSRFaSolidIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { FaSolidIcon, type SSRFaSolidIconProps };
