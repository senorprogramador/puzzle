import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { TypcnIconName } from "./typcn.types.ts";

const prefix = "typcn" as const;

type SSRTypcnIconProps = Omit<SSRIconProps, "name"> & {
  name: TypcnIconName;
};

const TypcnIcon = ({ name, ...props }: SSRTypcnIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { TypcnIcon, type SSRTypcnIconProps };
