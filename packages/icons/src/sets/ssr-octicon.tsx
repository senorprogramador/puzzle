import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { OcticonIconName } from "./octicon.types.ts";

const prefix = "octicon" as const;

type SSROcticonIconProps = Omit<SSRIconProps, "name"> & {
  name: OcticonIconName;
};

const OcticonIcon = ({ name, ...props }: SSROcticonIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { OcticonIcon, type SSROcticonIconProps };
