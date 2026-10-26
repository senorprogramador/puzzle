import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { FaRegularIconName } from "./fa-regular.types.ts";

const prefix = "fa-regular" as const;

type SSRFaRegularIconProps = Omit<SSRIconProps, "name"> & {
  name: FaRegularIconName;
};

const FaRegularIcon = ({ name, ...props }: SSRFaRegularIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { FaRegularIcon, type SSRFaRegularIconProps };
