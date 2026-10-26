import { Icon, type IconProps } from "../icon";
import type { OcticonIconName } from "./octicon.types.ts";

const prefix = "octicon" as const;

type OcticonIconProps = Omit<IconProps, "name"> & {
  name: OcticonIconName;
};

const OcticonIcon = ({ name, ...props }: OcticonIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { OcticonIcon, type OcticonIconProps };
