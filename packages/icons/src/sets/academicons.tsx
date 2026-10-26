import { Icon, type IconProps } from "../icon";
import type { AcademiconsIconName } from "./academicons.types.ts";

const prefix = "academicons" as const;

type AcademiconsIconProps = Omit<IconProps, "name"> & {
  name: AcademiconsIconName;
};

const AcademiconsIcon = ({ name, ...props }: AcademiconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { AcademiconsIcon, type AcademiconsIconProps };
