import { Icon, type IconProps } from "../icon";
import type { EvaIconName } from "./eva.types.ts";

const prefix = "eva" as const;

type EvaIconProps = Omit<IconProps, "name"> & {
  name: EvaIconName;
};

const EvaIcon = ({ name, ...props }: EvaIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { EvaIcon, type EvaIconProps };
