import { Icon, type IconProps } from "../icon";
import type { CuidaIconName } from "./cuida.types.ts";

const prefix = "cuida" as const;

type CuidaIconProps = Omit<IconProps, "name"> & {
  name: CuidaIconName;
};

const CuidaIcon = ({ name, ...props }: CuidaIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { CuidaIcon, type CuidaIconProps };
