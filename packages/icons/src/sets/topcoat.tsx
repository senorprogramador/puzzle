import { Icon, type IconProps } from "../icon";
import type { TopcoatIconName } from "./topcoat.types.ts";

const prefix = "topcoat" as const;

type TopcoatIconProps = Omit<IconProps, "name"> & {
  name: TopcoatIconName;
};

const TopcoatIcon = ({ name, ...props }: TopcoatIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { TopcoatIcon, type TopcoatIconProps };
