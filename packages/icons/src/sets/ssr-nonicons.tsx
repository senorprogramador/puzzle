import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { NoniconsIconName } from "./nonicons.types.ts";

const prefix = "nonicons" as const;

type SSRNoniconsIconProps = Omit<SSRIconProps, "name"> & {
  name: NoniconsIconName;
};

const NoniconsIcon = ({ name, ...props }: SSRNoniconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { NoniconsIcon, type SSRNoniconsIconProps };
