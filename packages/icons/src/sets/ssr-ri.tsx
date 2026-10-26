import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { RiIconName } from "./ri.types.ts";

const prefix = "ri" as const;

type SSRRiIconProps = Omit<SSRIconProps, "name"> & {
  name: RiIconName;
};

const RiIcon = ({ name, ...props }: SSRRiIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { RiIcon, type SSRRiIconProps };
