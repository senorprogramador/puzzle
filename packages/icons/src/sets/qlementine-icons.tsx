import { Icon, type IconProps } from "../icon";
import type { QlementineIconsIconName } from "./qlementine-icons.types.ts";

const prefix = "qlementine-icons" as const;

type QlementineIconsIconProps = Omit<IconProps, "name"> & {
  name: QlementineIconsIconName;
};

const QlementineIconsIcon = ({ name, ...props }: QlementineIconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { QlementineIconsIcon, type QlementineIconsIconProps };
