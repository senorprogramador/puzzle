import { Icon, type IconProps } from "../icon";
import type { MdiIconName } from "./mdi.types.ts";

const prefix = "mdi" as const;

type MdiIconProps = Omit<IconProps, "name"> & {
  name: MdiIconName;
};

const MdiIcon = ({ name, ...props }: MdiIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { MdiIcon, type MdiIconProps };
