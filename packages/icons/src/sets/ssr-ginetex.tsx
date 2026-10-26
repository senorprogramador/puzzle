import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { GinetexIconName } from "./ginetex.types.ts";

const prefix = "ginetex" as const;

type SSRGinetexIconProps = Omit<SSRIconProps, "name"> & {
  name: GinetexIconName;
};

const GinetexIcon = ({ name, ...props }: SSRGinetexIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { GinetexIcon, type SSRGinetexIconProps };
