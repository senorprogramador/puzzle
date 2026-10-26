import { Icon, type IconProps } from "../icon";
import type { MaterialIconThemeIconName } from "./material-icon-theme.types.ts";

const prefix = "material-icon-theme" as const;

type MaterialIconThemeIconProps = Omit<IconProps, "name"> & {
  name: MaterialIconThemeIconName;
};

const MaterialIconThemeIcon = ({ name, ...props }: MaterialIconThemeIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { MaterialIconThemeIcon, type MaterialIconThemeIconProps };
