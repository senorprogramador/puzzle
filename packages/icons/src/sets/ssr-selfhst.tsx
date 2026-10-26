import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { SelfhstIconName } from "./selfhst.types.ts";

const prefix = "selfhst" as const;

type SSRSelfhstIconProps = Omit<SSRIconProps, "name"> & {
  name: SelfhstIconName;
};

const SelfhstIcon = ({ name, ...props }: SSRSelfhstIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { SelfhstIcon, type SSRSelfhstIconProps };
