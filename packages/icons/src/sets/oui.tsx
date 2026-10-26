import { Icon, type IconProps } from "../icon";
import type { OuiIconName } from "./oui.types.ts";

const prefix = "oui" as const;

type OuiIconProps = Omit<IconProps, "name"> & {
  name: OuiIconName;
};

const OuiIcon = ({ name, ...props }: OuiIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { OuiIcon, type OuiIconProps };
