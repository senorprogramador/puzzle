import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { OuiIconName } from "./oui.types.ts";

const prefix = "oui" as const;

type SSROuiIconProps = Omit<SSRIconProps, "name"> & {
  name: OuiIconName;
};

const OuiIcon = ({ name, ...props }: SSROuiIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { OuiIcon, type SSROuiIconProps };
