import { Icon, type IconProps } from "../icon";
import type { EosIconsIconName } from "./eos-icons.types.ts";

const prefix = "eos-icons" as const;

type EosIconsIconProps = Omit<IconProps, "name"> & {
  name: EosIconsIconName;
};

const EosIconsIcon = ({ name, ...props }: EosIconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { EosIconsIcon, type EosIconsIconProps };
