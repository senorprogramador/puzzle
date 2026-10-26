import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { CibIconName } from "./cib.types.ts";

const prefix = "cib" as const;

type SSRCibIconProps = Omit<SSRIconProps, "name"> & {
  name: CibIconName;
};

const CibIcon = ({ name, ...props }: SSRCibIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { CibIcon, type SSRCibIconProps };
