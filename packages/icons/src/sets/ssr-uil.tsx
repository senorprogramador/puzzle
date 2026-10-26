import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { UilIconName } from "./uil.types.ts";

const prefix = "uil" as const;

type SSRUilIconProps = Omit<SSRIconProps, "name"> & {
  name: UilIconName;
};

const UilIcon = ({ name, ...props }: SSRUilIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { UilIcon, type SSRUilIconProps };
