import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { MaterialSymbolsIconName } from "./material-symbols.types.ts";

const prefix = "material-symbols" as const;

type SSRMaterialSymbolsIconProps = Omit<SSRIconProps, "name"> & {
  name: MaterialSymbolsIconName;
};

const MaterialSymbolsIcon = ({ name, ...props }: SSRMaterialSymbolsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { MaterialSymbolsIcon, type SSRMaterialSymbolsIconProps };
