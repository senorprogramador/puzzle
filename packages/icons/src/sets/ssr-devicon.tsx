import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { DeviconIconName } from "./devicon.types.ts";

const prefix = "devicon" as const;

type SSRDeviconIconProps = Omit<SSRIconProps, "name"> & {
  name: DeviconIconName;
};

const DeviconIcon = ({ name, ...props }: SSRDeviconIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { DeviconIcon, type SSRDeviconIconProps };
