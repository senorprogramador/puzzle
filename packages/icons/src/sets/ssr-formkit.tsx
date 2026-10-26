import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { FormkitIconName } from "./formkit.types.ts";

const prefix = "formkit" as const;

type SSRFormkitIconProps = Omit<SSRIconProps, "name"> & {
  name: FormkitIconName;
};

const FormkitIcon = ({ name, ...props }: SSRFormkitIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { FormkitIcon, type SSRFormkitIconProps };
