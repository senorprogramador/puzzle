import { Icon, type IconProps } from "../icon";
import type { AndrsrxnIconName } from "./andrsrxn.types.ts";

const prefix = "andrsrxn" as const;

type AndrsrxnIconProps = Omit<IconProps, "name"> & {
  name: AndrsrxnIconName;
};

const AndrsrxnIcon = ({ name, ...props }: AndrsrxnIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { AndrsrxnIcon, type AndrsrxnIconProps };
