import { Icon, type IconProps } from "../icon";
import type { CovidIconName } from "./covid.types.ts";

const prefix = "covid" as const;

type CovidIconProps = Omit<IconProps, "name"> & {
  name: CovidIconName;
};

const CovidIcon = ({ name, ...props }: CovidIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { CovidIcon, type CovidIconProps };
