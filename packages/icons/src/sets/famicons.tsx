import { Icon, type IconProps } from "../icon";
import type { FamiconsIconName } from "./famicons.types.ts";

const prefix = "famicons" as const;

type FamiconsIconProps = Omit<IconProps, "name"> & {
  name: FamiconsIconName;
};

const FamiconsIcon = ({ name, ...props }: FamiconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { FamiconsIcon, type FamiconsIconProps };
