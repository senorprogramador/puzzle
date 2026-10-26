import { Icon, type IconProps } from "../icon";
import type { PepiconsPopIconName } from "./pepicons-pop.types.ts";

const prefix = "pepicons-pop" as const;

type PepiconsPopIconProps = Omit<IconProps, "name"> & {
  name: PepiconsPopIconName;
};

const PepiconsPopIcon = ({ name, ...props }: PepiconsPopIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { PepiconsPopIcon, type PepiconsPopIconProps };
