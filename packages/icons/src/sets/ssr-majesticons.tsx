import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { MajesticonsIconName } from "./majesticons.types.ts";

const prefix = "majesticons" as const;

type SSRMajesticonsIconProps = Omit<SSRIconProps, "name"> & {
  name: MajesticonsIconName;
};

const MajesticonsIcon = ({ name, ...props }: SSRMajesticonsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { MajesticonsIcon, type SSRMajesticonsIconProps };
