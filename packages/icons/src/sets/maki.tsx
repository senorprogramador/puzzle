import { Icon, type IconProps } from "../icon";
import type { MakiIconName } from "./maki.types.ts";

const prefix = "maki" as const;

type MakiIconProps = Omit<IconProps, "name"> & {
  name: MakiIconName;
};

const MakiIcon = ({ name, ...props }: MakiIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { MakiIcon, type MakiIconProps };
