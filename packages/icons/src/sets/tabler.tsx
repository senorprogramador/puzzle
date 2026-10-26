import { Icon, type IconProps } from "../icon";
import type { TablerIconName } from "./tabler.types.ts";

const prefix = "tabler" as const;

type TablerIconProps = Omit<IconProps, "name"> & {
  name: TablerIconName;
};

const TablerIcon = ({ name, ...props }: TablerIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { TablerIcon, type TablerIconProps };
