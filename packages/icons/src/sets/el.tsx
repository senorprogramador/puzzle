import { Icon, type IconProps } from "../icon";
import type { ElIconName } from "./el.types.ts";

const prefix = "el" as const;

type ElIconProps = Omit<IconProps, "name"> & {
  name: ElIconName;
};

const ElIcon = ({ name, ...props }: ElIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { ElIcon, type ElIconProps };
