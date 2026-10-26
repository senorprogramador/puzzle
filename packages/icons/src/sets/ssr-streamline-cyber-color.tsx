import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { StreamlineCyberColorIconName } from "./streamline-cyber-color.types.ts";

const prefix = "streamline-cyber-color" as const;

type SSRStreamlineCyberColorIconProps = Omit<SSRIconProps, "name"> & {
  name: StreamlineCyberColorIconName;
};

const StreamlineCyberColorIcon = ({ name, ...props }: SSRStreamlineCyberColorIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineCyberColorIcon, type SSRStreamlineCyberColorIconProps };
