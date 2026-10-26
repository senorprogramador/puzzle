import { Icon, type IconProps } from "../icon";
import type { FeIconName } from "./fe.types.ts";

const prefix = "fe" as const;

type FeIconProps = Omit<IconProps, "name"> & {
  name: FeIconName;
};

const FeIcon = ({ name, ...props }: FeIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { FeIcon, type FeIconProps };
