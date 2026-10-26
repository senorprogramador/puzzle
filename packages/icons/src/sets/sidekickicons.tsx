import { Icon, type IconProps } from "../icon";
import type { SidekickiconsIconName } from "./sidekickicons.types.ts";

const prefix = "sidekickicons" as const;

type SidekickiconsIconProps = Omit<IconProps, "name"> & {
  name: SidekickiconsIconName;
};

const SidekickiconsIcon = ({ name, ...props }: SidekickiconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { SidekickiconsIcon, type SidekickiconsIconProps };
