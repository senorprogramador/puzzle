import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { AndrsrxnIconName } from "./andrsrxn.types.ts";

const prefix = "andrsrxn" as const;

type SSRAndrsrxnIconProps = Omit<SSRIconProps, "name"> & {
  name: AndrsrxnIconName;
};

const AndrsrxnIcon = ({ name, ...props }: SSRAndrsrxnIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { AndrsrxnIcon, type SSRAndrsrxnIconProps };
