import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { MingcuteIconName } from "./mingcute.types.ts";

const prefix = "mingcute" as const;

type SSRMingcuteIconProps = Omit<SSRIconProps, "name"> & {
  name: MingcuteIconName;
};

const MingcuteIcon = ({ name, ...props }: SSRMingcuteIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { MingcuteIcon, type SSRMingcuteIconProps };
