import { Icon, type IconProps } from "../icon";
import type { MeteoconsIconName } from "./meteocons.types.ts";

const prefix = "meteocons" as const;

type MeteoconsIconProps = Omit<IconProps, "name"> & {
  name: MeteoconsIconName;
};

const MeteoconsIcon = ({ name, ...props }: MeteoconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { MeteoconsIcon, type MeteoconsIconProps };
