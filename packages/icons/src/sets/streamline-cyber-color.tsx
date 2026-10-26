import { Icon, type IconProps } from "../icon";
import type { StreamlineCyberColorIconName } from "./streamline-cyber-color.types.ts";

const prefix = "streamline-cyber-color" as const;

type StreamlineCyberColorIconProps = Omit<IconProps, "name"> & {
  name: StreamlineCyberColorIconName;
};

const StreamlineCyberColorIcon = ({ name, ...props }: StreamlineCyberColorIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineCyberColorIcon, type StreamlineCyberColorIconProps };
