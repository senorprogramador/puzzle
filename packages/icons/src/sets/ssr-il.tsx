import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { IlIconName } from "./il.types.ts";

const prefix = "il" as const;

type SSRIlIconProps = Omit<SSRIconProps, "name"> & {
  name: IlIconName;
};

const IlIcon = ({ name, ...props }: SSRIlIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { IlIcon, type SSRIlIconProps };
