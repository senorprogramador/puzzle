import { Icon, type IconProps } from "../icon";
import type { PhIconName } from "./ph.types.ts";

const prefix = "ph" as const;

type PhIconProps = Omit<IconProps, "name"> & {
  name: PhIconName;
};

const PhIcon = ({ name, ...props }: PhIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { PhIcon, type PhIconProps };
