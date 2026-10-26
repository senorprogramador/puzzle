import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { CovidIconName } from "./covid.types.ts";

const prefix = "covid" as const;

type SSRCovidIconProps = Omit<SSRIconProps, "name"> & {
  name: CovidIconName;
};

const CovidIcon = ({ name, ...props }: SSRCovidIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { CovidIcon, type SSRCovidIconProps };
