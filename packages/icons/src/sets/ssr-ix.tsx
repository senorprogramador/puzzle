import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { IxIconName } from "./ix.types.ts";

const prefix = "ix" as const;

type SSRIxIconProps = Omit<SSRIconProps, "name"> & {
  name: IxIconName;
};

const IxIcon = ({ name, ...props }: SSRIxIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { IxIcon, type SSRIxIconProps };
