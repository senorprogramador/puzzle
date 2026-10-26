import { Icon, type IconProps } from "../icon";
import type { CodiconIconName } from "./codicon.types.ts";

const prefix = "codicon" as const;

type CodiconIconProps = Omit<IconProps, "name"> & {
  name: CodiconIconName;
};

const CodiconIcon = ({ name, ...props }: CodiconIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { CodiconIcon, type CodiconIconProps };
