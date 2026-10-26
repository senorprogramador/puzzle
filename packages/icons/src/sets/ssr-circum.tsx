import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { CircumIconName } from "./circum.types.ts";

const prefix = "circum" as const;

type SSRCircumIconProps = Omit<SSRIconProps, "name"> & {
  name: CircumIconName;
};

const CircumIcon = ({ name, ...props }: SSRCircumIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { CircumIcon, type SSRCircumIconProps };
