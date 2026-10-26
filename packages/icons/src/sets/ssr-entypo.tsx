import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { EntypoIconName } from "./entypo.types.ts";

const prefix = "entypo" as const;

type SSREntypoIconProps = Omit<SSRIconProps, "name"> & {
  name: EntypoIconName;
};

const EntypoIcon = ({ name, ...props }: SSREntypoIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { EntypoIcon, type SSREntypoIconProps };
