import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { StreamlineCyberIconName } from "./streamline-cyber.types.ts";

const prefix = "streamline-cyber" as const;

type SSRStreamlineCyberIconProps = Omit<SSRIconProps, "name"> & {
  name: StreamlineCyberIconName;
};

const StreamlineCyberIcon = ({ name, ...props }: SSRStreamlineCyberIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineCyberIcon, type SSRStreamlineCyberIconProps };
