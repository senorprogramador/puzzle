import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { SolarIconName } from "./solar.types.ts";

const prefix = "solar" as const;

type SSRSolarIconProps = Omit<SSRIconProps, "name"> & {
  name: SolarIconName;
};

const SolarIcon = ({ name, ...props }: SSRSolarIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { SolarIcon, type SSRSolarIconProps };
