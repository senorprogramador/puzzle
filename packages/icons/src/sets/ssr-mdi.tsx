import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { MdiIconName } from "./mdi.types.ts";

const prefix = "mdi" as const;

type SSRMdiIconProps = Omit<SSRIconProps, "name"> & {
  name: MdiIconName;
};

const MdiIcon = ({ name, ...props }: SSRMdiIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { MdiIcon, type SSRMdiIconProps };
