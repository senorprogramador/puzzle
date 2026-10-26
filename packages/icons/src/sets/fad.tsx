import { Icon, type IconProps } from "../icon";
import type { FadIconName } from "./fad.types.ts";

const prefix = "fad" as const;

type FadIconProps = Omit<IconProps, "name"> & {
  name: FadIconName;
};

const FadIcon = ({ name, ...props }: FadIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { FadIcon, type FadIconProps };
