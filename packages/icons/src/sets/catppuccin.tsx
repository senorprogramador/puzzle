import { Icon, type IconProps } from "../icon";
import type { CatppuccinIconName } from "./catppuccin.types.ts";

const prefix = "catppuccin" as const;

type CatppuccinIconProps = Omit<IconProps, "name"> & {
  name: CatppuccinIconName;
};

const CatppuccinIcon = ({ name, ...props }: CatppuccinIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { CatppuccinIcon, type CatppuccinIconProps };
