import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { UisIconName } from "./uis.types.ts";

const prefix = "uis" as const;

type SSRUisIconProps = Omit<SSRIconProps, "name"> & {
  name: UisIconName;
};

const UisIcon = ({ name, ...props }: SSRUisIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { UisIcon, type SSRUisIconProps };
