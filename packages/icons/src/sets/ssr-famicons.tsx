import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { FamiconsIconName } from "./famicons.types.ts";

const prefix = "famicons" as const;

type SSRFamiconsIconProps = Omit<SSRIconProps, "name"> & {
  name: FamiconsIconName;
};

const FamiconsIcon = ({ name, ...props }: SSRFamiconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { FamiconsIcon, type SSRFamiconsIconProps };
