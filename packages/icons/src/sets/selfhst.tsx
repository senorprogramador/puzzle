import { Icon, type IconProps } from "../icon";
import type { SelfhstIconName } from "./selfhst.types.ts";

const prefix = "selfhst" as const;

type SelfhstIconProps = Omit<IconProps, "name"> & {
  name: SelfhstIconName;
};

const SelfhstIcon = ({ name, ...props }: SelfhstIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { SelfhstIcon, type SelfhstIconProps };
