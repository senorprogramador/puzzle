import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { OsmicIconName } from "./osmic.types.ts";

const prefix = "osmic" as const;

type SSROsmicIconProps = Omit<SSRIconProps, "name"> & {
  name: OsmicIconName;
};

const OsmicIcon = ({ name, ...props }: SSROsmicIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { OsmicIcon, type SSROsmicIconProps };
