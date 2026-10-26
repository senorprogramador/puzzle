import { Icon, type IconProps } from "../icon";
import type { StreamlineCyberIconName } from "./streamline-cyber.types.ts";

const prefix = "streamline-cyber" as const;

type StreamlineCyberIconProps = Omit<IconProps, "name"> & {
  name: StreamlineCyberIconName;
};

const StreamlineCyberIcon = ({ name, ...props }: StreamlineCyberIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineCyberIcon, type StreamlineCyberIconProps };
