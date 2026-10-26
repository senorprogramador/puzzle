import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { MeteoconsIconName } from "./meteocons.types.ts";

const prefix = "meteocons" as const;

type SSRMeteoconsIconProps = Omit<SSRIconProps, "name"> & {
  name: MeteoconsIconName;
};

const MeteoconsIcon = ({ name, ...props }: SSRMeteoconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { MeteoconsIcon, type SSRMeteoconsIconProps };
