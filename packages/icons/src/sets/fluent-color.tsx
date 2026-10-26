import { Icon, type IconProps } from "../icon";
import type { FluentColorIconName } from "./fluent-color.types.ts";

const prefix = "fluent-color" as const;

type FluentColorIconProps = Omit<IconProps, "name"> & {
  name: FluentColorIconName;
};

const FluentColorIcon = ({ name, ...props }: FluentColorIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { FluentColorIcon, type FluentColorIconProps };
