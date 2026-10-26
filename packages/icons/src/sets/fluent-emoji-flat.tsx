import { Icon, type IconProps } from "../icon";
import type { FluentEmojiFlatIconName } from "./fluent-emoji-flat.types.ts";

const prefix = "fluent-emoji-flat" as const;

type FluentEmojiFlatIconProps = Omit<IconProps, "name"> & {
  name: FluentEmojiFlatIconName;
};

const FluentEmojiFlatIcon = ({ name, ...props }: FluentEmojiFlatIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { FluentEmojiFlatIcon, type FluentEmojiFlatIconProps };
