import { Icon, type IconProps } from "../icon";
import type { OsmicIconName } from "./osmic.types.ts";

const prefix = "osmic" as const;

type OsmicIconProps = Omit<IconProps, "name"> & {
  name: OsmicIconName;
};

const OsmicIcon = ({ name, ...props }: OsmicIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { OsmicIcon, type OsmicIconProps };
