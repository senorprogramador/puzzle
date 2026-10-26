import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { GravityUiIconName } from "./gravity-ui.types.ts";

const prefix = "gravity-ui" as const;

type SSRGravityUiIconProps = Omit<SSRIconProps, "name"> & {
  name: GravityUiIconName;
};

const GravityUiIcon = ({ name, ...props }: SSRGravityUiIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { GravityUiIcon, type SSRGravityUiIconProps };
