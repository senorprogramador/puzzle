import { Icon, type IconProps } from "../icon";
import type { PiconIconName } from "./picon.types.ts";

const prefix = "picon" as const;

type PiconIconProps = Omit<IconProps, "name"> & {
  name: PiconIconName;
};

const PiconIcon = ({ name, ...props }: PiconIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { PiconIcon, type PiconIconProps };
