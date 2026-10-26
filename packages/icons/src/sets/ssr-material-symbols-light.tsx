import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { MaterialSymbolsLightIconName } from "./material-symbols-light.types.ts";

const prefix = "material-symbols-light" as const;

type SSRMaterialSymbolsLightIconProps = Omit<SSRIconProps, "name"> & {
  name: MaterialSymbolsLightIconName;
};

const MaterialSymbolsLightIcon = ({ name, ...props }: SSRMaterialSymbolsLightIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { MaterialSymbolsLightIcon, type SSRMaterialSymbolsLightIconProps };
