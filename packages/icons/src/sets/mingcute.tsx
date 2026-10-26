import { Icon, type IconProps } from "../icon";
import type { MingcuteIconName } from "./mingcute.types.ts";

const prefix = "mingcute" as const;

type MingcuteIconProps = Omit<IconProps, "name"> & {
  name: MingcuteIconName;
};

const MingcuteIcon = ({ name, ...props }: MingcuteIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { MingcuteIcon, type MingcuteIconProps };
