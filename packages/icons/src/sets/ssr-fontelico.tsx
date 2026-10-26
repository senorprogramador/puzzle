import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { FontelicoIconName } from "./fontelico.types.ts";

const prefix = "fontelico" as const;

type SSRFontelicoIconProps = Omit<SSRIconProps, "name"> & {
  name: FontelicoIconName;
};

const FontelicoIcon = ({ name, ...props }: SSRFontelicoIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { FontelicoIcon, type SSRFontelicoIconProps };
