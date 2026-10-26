import { Icon, type IconProps } from "../icon";
import type { MdiLightIconName } from "./mdi-light.types.ts";

const prefix = "mdi-light" as const;

type MdiLightIconProps = Omit<IconProps, "name"> & {
  name: MdiLightIconName;
};

const MdiLightIcon = ({ name, ...props }: MdiLightIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { MdiLightIcon, type MdiLightIconProps };
