import { Icon, type IconProps } from "../icon";
import type { FoundationIconName } from "./foundation.types.ts";

const prefix = "foundation" as const;

type FoundationIconProps = Omit<IconProps, "name"> & {
  name: FoundationIconName;
};

const FoundationIcon = ({ name, ...props }: FoundationIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { FoundationIcon, type FoundationIconProps };
