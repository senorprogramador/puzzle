import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { MynauiIconName } from "./mynaui.types.ts";

const prefix = "mynaui" as const;

type SSRMynauiIconProps = Omit<SSRIconProps, "name"> & {
  name: MynauiIconName;
};

const MynauiIcon = ({ name, ...props }: SSRMynauiIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { MynauiIcon, type SSRMynauiIconProps };
