import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { NrkIconName } from "./nrk.types.ts";

const prefix = "nrk" as const;

type SSRNrkIconProps = Omit<SSRIconProps, "name"> & {
  name: NrkIconName;
};

const NrkIcon = ({ name, ...props }: SSRNrkIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { NrkIcon, type SSRNrkIconProps };
