import { Icon, type IconProps } from "../icon";
import type { CarbonIconName } from "./carbon.types.ts";

const prefix = "carbon" as const;

type CarbonIconProps = Omit<IconProps, "name"> & {
  name: CarbonIconName;
};

const CarbonIcon = ({ name, ...props }: CarbonIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { CarbonIcon, type CarbonIconProps };
