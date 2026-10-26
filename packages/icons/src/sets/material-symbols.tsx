import { Icon, type IconProps } from "../icon";
import type { MaterialSymbolsIconName } from "./material-symbols.types.ts";

const prefix = "material-symbols" as const;

type MaterialSymbolsIconProps = Omit<IconProps, "name"> & {
  name: MaterialSymbolsIconName;
};

const MaterialSymbolsIcon = ({ name, ...props }: MaterialSymbolsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { MaterialSymbolsIcon, type MaterialSymbolsIconProps };
