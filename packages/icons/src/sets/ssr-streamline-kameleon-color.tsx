import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { StreamlineKameleonColorIconName } from "./streamline-kameleon-color.types.ts";

const prefix = "streamline-kameleon-color" as const;

type SSRStreamlineKameleonColorIconProps = Omit<SSRIconProps, "name"> & {
  name: StreamlineKameleonColorIconName;
};

const StreamlineKameleonColorIcon = ({ name, ...props }: SSRStreamlineKameleonColorIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineKameleonColorIcon, type SSRStreamlineKameleonColorIconProps };
