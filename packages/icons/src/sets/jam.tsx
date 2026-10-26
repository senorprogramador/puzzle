import { Icon, type IconProps } from "../icon";
import type { JamIconName } from "./jam.types.ts";

const prefix = "jam" as const;

type JamIconProps = Omit<IconProps, "name"> & {
  name: JamIconName;
};

const JamIcon = ({ name, ...props }: JamIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { JamIcon, type JamIconProps };
