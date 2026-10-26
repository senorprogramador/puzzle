import { Icon, type IconProps } from "../icon";
import type { MaterialSymbolsLightIconName } from "./material-symbols-light.types.ts";

const prefix = "material-symbols-light" as const;

type MaterialSymbolsLightIconProps = Omit<IconProps, "name"> & {
  name: MaterialSymbolsLightIconName;
};

const MaterialSymbolsLightIcon = ({ name, ...props }: MaterialSymbolsLightIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { MaterialSymbolsLightIcon, type MaterialSymbolsLightIconProps };
