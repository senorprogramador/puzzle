import { Icon, type IconProps } from "../icon";
import type { NimbusIconName } from "./nimbus.types.ts";

const prefix = "nimbus" as const;

type NimbusIconProps = Omit<IconProps, "name"> & {
  name: NimbusIconName;
};

const NimbusIcon = ({ name, ...props }: NimbusIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { NimbusIcon, type NimbusIconProps };
