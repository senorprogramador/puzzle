import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { CatppuccinIconName } from "./catppuccin.types.ts";

const prefix = "catppuccin" as const;

type SSRCatppuccinIconProps = Omit<SSRIconProps, "name"> & {
  name: CatppuccinIconName;
};

const CatppuccinIcon = ({ name, ...props }: SSRCatppuccinIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { CatppuccinIcon, type SSRCatppuccinIconProps };
