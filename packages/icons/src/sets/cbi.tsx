import { Icon, type IconProps } from "../icon";
import type { CbiIconName } from "./cbi.types.ts";

const prefix = "cbi" as const;

type CbiIconProps = Omit<IconProps, "name"> & {
  name: CbiIconName;
};

const CbiIcon = ({ name, ...props }: CbiIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { CbiIcon, type CbiIconProps };
