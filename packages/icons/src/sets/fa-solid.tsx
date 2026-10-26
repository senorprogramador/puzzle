import { Icon, type IconProps } from "../icon";
import type { FaSolidIconName } from "./fa-solid.types.ts";

const prefix = "fa-solid" as const;

type FaSolidIconProps = Omit<IconProps, "name"> & {
  name: FaSolidIconName;
};

const FaSolidIcon = ({ name, ...props }: FaSolidIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { FaSolidIcon, type FaSolidIconProps };
