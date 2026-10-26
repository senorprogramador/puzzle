import { Icon, type IconProps } from "../icon";
import type { MageIconName } from "./mage.types.ts";

const prefix = "mage" as const;

type MageIconProps = Omit<IconProps, "name"> & {
  name: MageIconName;
};

const MageIcon = ({ name, ...props }: MageIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { MageIcon, type MageIconProps };
