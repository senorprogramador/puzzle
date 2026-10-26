import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { TdesignIconName } from "./tdesign.types.ts";

const prefix = "tdesign" as const;

type SSRTdesignIconProps = Omit<SSRIconProps, "name"> & {
  name: TdesignIconName;
};

const TdesignIcon = ({ name, ...props }: SSRTdesignIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { TdesignIcon, type SSRTdesignIconProps };
