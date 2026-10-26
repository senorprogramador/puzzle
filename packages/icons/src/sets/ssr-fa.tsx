import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { FaIconName } from "./fa.types.ts";

const prefix = "fa" as const;

type SSRFaIconProps = Omit<SSRIconProps, "name"> & {
  name: FaIconName;
};

const FaIcon = ({ name, ...props }: SSRFaIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { FaIcon, type SSRFaIconProps };
