import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { IcIconName } from "./ic.types.ts";

const prefix = "ic" as const;

type SSRIcIconProps = Omit<SSRIconProps, "name"> & {
  name: IcIconName;
};

const IcIcon = ({ name, ...props }: SSRIcIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { IcIcon, type SSRIcIconProps };
