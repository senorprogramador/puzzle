import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { AcademiconsIconName } from "./academicons.types.ts";

const prefix = "academicons" as const;

type SSRAcademiconsIconProps = Omit<SSRIconProps, "name"> & {
  name: AcademiconsIconName;
};

const AcademiconsIcon = ({ name, ...props }: SSRAcademiconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { AcademiconsIcon, type SSRAcademiconsIconProps };
