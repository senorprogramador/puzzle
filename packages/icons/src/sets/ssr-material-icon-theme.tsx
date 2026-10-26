import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { MaterialIconThemeIconName } from "./material-icon-theme.types.ts";

const prefix = "material-icon-theme" as const;

type SSRMaterialIconThemeIconProps = Omit<SSRIconProps, "name"> & {
  name: MaterialIconThemeIconName;
};

const MaterialIconThemeIcon = ({ name, ...props }: SSRMaterialIconThemeIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { MaterialIconThemeIcon, type SSRMaterialIconThemeIconProps };
