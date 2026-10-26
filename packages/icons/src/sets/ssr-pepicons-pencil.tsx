import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { PepiconsPencilIconName } from "./pepicons-pencil.types.ts";

const prefix = "pepicons-pencil" as const;

type SSRPepiconsPencilIconProps = Omit<SSRIconProps, "name"> & {
  name: PepiconsPencilIconName;
};

const PepiconsPencilIcon = ({ name, ...props }: SSRPepiconsPencilIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { PepiconsPencilIcon, type SSRPepiconsPencilIconProps };
