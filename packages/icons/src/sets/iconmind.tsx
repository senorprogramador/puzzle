import { Icon, type IconProps } from "../icon";
import type { IconmindIconName } from "./iconmind.types.ts";

const prefix = "iconmind" as const;

type IconmindIconProps = Omit<IconProps, "name"> & {
  name: IconmindIconName;
};

const IconmindIcon = ({ name, ...props }: IconmindIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { IconmindIcon, type IconmindIconProps };
