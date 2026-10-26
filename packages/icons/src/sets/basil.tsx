import { Icon, type IconProps } from "../icon";
import type { BasilIconName } from "./basil.types.ts";

const prefix = "basil" as const;

type BasilIconProps = Omit<IconProps, "name"> & {
  name: BasilIconName;
};

const BasilIcon = ({ name, ...props }: BasilIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { BasilIcon, type BasilIconProps };
