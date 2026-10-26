import { Icon, type IconProps } from "../icon";
import type { CharmIconName } from "./charm.types.ts";

const prefix = "charm" as const;

type CharmIconProps = Omit<IconProps, "name"> & {
  name: CharmIconName;
};

const CharmIcon = ({ name, ...props }: CharmIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { CharmIcon, type CharmIconProps };
