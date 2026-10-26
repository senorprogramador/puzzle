import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { ArcticonsIconName } from "./arcticons.types.ts";

const prefix = "arcticons" as const;

type SSRArcticonsIconProps = Omit<SSRIconProps, "name"> & {
  name: ArcticonsIconName;
};

const ArcticonsIcon = ({ name, ...props }: SSRArcticonsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { ArcticonsIcon, type SSRArcticonsIconProps };
