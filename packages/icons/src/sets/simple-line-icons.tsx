import { Icon, type IconProps } from "../icon";
import type { SimpleLineIconsIconName } from "./simple-line-icons.types.ts";

const prefix = "simple-line-icons" as const;

type SimpleLineIconsIconProps = Omit<IconProps, "name"> & {
  name: SimpleLineIconsIconName;
};

const SimpleLineIconsIcon = ({ name, ...props }: SimpleLineIconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { SimpleLineIconsIcon, type SimpleLineIconsIconProps };
