import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { CuidaIconName } from "./cuida.types.ts";

const prefix = "cuida" as const;

type SSRCuidaIconProps = Omit<SSRIconProps, "name"> & {
  name: CuidaIconName;
};

const CuidaIcon = ({ name, ...props }: SSRCuidaIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { CuidaIcon, type SSRCuidaIconProps };
