import { Icon, type IconProps } from "../icon";
import type { FlagpackIconName } from "./flagpack.types.ts";

const prefix = "flagpack" as const;

type FlagpackIconProps = Omit<IconProps, "name"> & {
  name: FlagpackIconName;
};

const FlagpackIcon = ({ name, ...props }: FlagpackIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { FlagpackIcon, type FlagpackIconProps };
