import { Icon, type IconProps } from "../icon";
import type { WhhIconName } from "./whh.types.ts";

const prefix = "whh" as const;

type WhhIconProps = Omit<IconProps, "name"> & {
  name: WhhIconName;
};

const WhhIcon = ({ name, ...props }: WhhIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { WhhIcon, type WhhIconProps };
