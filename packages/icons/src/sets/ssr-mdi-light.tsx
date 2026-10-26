import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { MdiLightIconName } from "./mdi-light.types.ts";

const prefix = "mdi-light" as const;

type SSRMdiLightIconProps = Omit<SSRIconProps, "name"> & {
  name: MdiLightIconName;
};

const MdiLightIcon = ({ name, ...props }: SSRMdiLightIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { MdiLightIcon, type SSRMdiLightIconProps };
