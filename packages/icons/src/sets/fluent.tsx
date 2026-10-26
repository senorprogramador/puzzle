import { Icon, type IconProps } from "../icon";
import type { FluentIconName } from "./fluent.types.ts";

const prefix = "fluent" as const;

type FluentIconProps = Omit<IconProps, "name"> & {
  name: FluentIconName;
};

const FluentIcon = ({ name, ...props }: FluentIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { FluentIcon, type FluentIconProps };
