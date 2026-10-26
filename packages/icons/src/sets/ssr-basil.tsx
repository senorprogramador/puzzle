import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { BasilIconName } from "./basil.types.ts";

const prefix = "basil" as const;

type SSRBasilIconProps = Omit<SSRIconProps, "name"> & {
  name: BasilIconName;
};

const BasilIcon = ({ name, ...props }: SSRBasilIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { BasilIcon, type SSRBasilIconProps };
