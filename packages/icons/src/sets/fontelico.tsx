import { Icon, type IconProps } from "../icon";
import type { FontelicoIconName } from "./fontelico.types.ts";

const prefix = "fontelico" as const;

type FontelicoIconProps = Omit<IconProps, "name"> & {
  name: FontelicoIconName;
};

const FontelicoIcon = ({ name, ...props }: FontelicoIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { FontelicoIcon, type FontelicoIconProps };
