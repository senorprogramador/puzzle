import { Icon, type IconProps } from "../icon";
import type { KeylineIconsIconName } from "./keyline-icons.types.ts";

const prefix = "keyline-icons" as const;

type KeylineIconsIconProps = Omit<IconProps, "name"> & {
  name: KeylineIconsIconName;
};

const KeylineIconsIcon = ({ name, ...props }: KeylineIconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { KeylineIconsIcon, type KeylineIconsIconProps };
