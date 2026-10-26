import { Icon, type IconProps } from "../icon";
import type { SubwayIconName } from "./subway.types.ts";

const prefix = "subway" as const;

type SubwayIconProps = Omit<IconProps, "name"> & {
  name: SubwayIconName;
};

const SubwayIcon = ({ name, ...props }: SubwayIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { SubwayIcon, type SubwayIconProps };
