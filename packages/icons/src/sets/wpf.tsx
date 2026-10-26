import { Icon, type IconProps } from "../icon";
import type { WpfIconName } from "./wpf.types.ts";

const prefix = "wpf" as const;

type WpfIconProps = Omit<IconProps, "name"> & {
  name: WpfIconName;
};

const WpfIcon = ({ name, ...props }: WpfIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { WpfIcon, type WpfIconProps };
