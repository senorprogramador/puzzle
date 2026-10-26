import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { CarbonIconName } from "./carbon.types.ts";

const prefix = "carbon" as const;

type SSRCarbonIconProps = Omit<SSRIconProps, "name"> & {
  name: CarbonIconName;
};

const CarbonIcon = ({ name, ...props }: SSRCarbonIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { CarbonIcon, type SSRCarbonIconProps };
