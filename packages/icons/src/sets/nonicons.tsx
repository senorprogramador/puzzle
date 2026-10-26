import { Icon, type IconProps } from "../icon";
import type { NoniconsIconName } from "./nonicons.types.ts";

const prefix = "nonicons" as const;

type NoniconsIconProps = Omit<IconProps, "name"> & {
  name: NoniconsIconName;
};

const NoniconsIcon = ({ name, ...props }: NoniconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { NoniconsIcon, type NoniconsIconProps };
