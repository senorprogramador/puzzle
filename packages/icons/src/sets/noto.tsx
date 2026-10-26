import { Icon, type IconProps } from "../icon";
import type { NotoIconName } from "./noto.types.ts";

const prefix = "noto" as const;

type NotoIconProps = Omit<IconProps, "name"> & {
  name: NotoIconName;
};

const NotoIcon = ({ name, ...props }: NotoIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { NotoIcon, type NotoIconProps };
