import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { PepiconsPrintIconName } from "./pepicons-print.types.ts";

const prefix = "pepicons-print" as const;

type SSRPepiconsPrintIconProps = Omit<SSRIconProps, "name"> & {
  name: PepiconsPrintIconName;
};

const PepiconsPrintIcon = ({ name, ...props }: SSRPepiconsPrintIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { PepiconsPrintIcon, type SSRPepiconsPrintIconProps };
