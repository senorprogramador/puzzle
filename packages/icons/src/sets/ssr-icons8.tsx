import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { Icons8IconName } from "./icons8.types.ts";

const prefix = "icons8" as const;

type SSRIcons8IconProps = Omit<SSRIconProps, "name"> & {
  name: Icons8IconName;
};

const Icons8Icon = ({ name, ...props }: SSRIcons8IconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { Icons8Icon, type SSRIcons8IconProps };
