import { Icon, type IconProps } from "../icon";
import type { ProiconsIconName } from "./proicons.types.ts";

const prefix = "proicons" as const;

type ProiconsIconProps = Omit<IconProps, "name"> & {
  name: ProiconsIconName;
};

const ProiconsIcon = ({ name, ...props }: ProiconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { ProiconsIcon, type ProiconsIconProps };
