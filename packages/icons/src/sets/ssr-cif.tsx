import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { CifIconName } from "./cif.types.ts";

const prefix = "cif" as const;

type SSRCifIconProps = Omit<SSRIconProps, "name"> & {
  name: CifIconName;
};

const CifIcon = ({ name, ...props }: SSRCifIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { CifIcon, type SSRCifIconProps };
