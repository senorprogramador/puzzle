import { Icon, type IconProps } from "../icon";
import type { HugeiconsIconName } from "./hugeicons.types.ts";

const prefix = "hugeicons" as const;

type HugeiconsIconProps = Omit<IconProps, "name"> & {
  name: HugeiconsIconName;
};

const HugeiconsIcon = ({ name, ...props }: HugeiconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { HugeiconsIcon, type HugeiconsIconProps };
