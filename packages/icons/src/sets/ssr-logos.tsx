import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { LogosIconName } from "./logos.types.ts";

const prefix = "logos" as const;

type SSRLogosIconProps = Omit<SSRIconProps, "name"> & {
  name: LogosIconName;
};

const LogosIcon = ({ name, ...props }: SSRLogosIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { LogosIcon, type SSRLogosIconProps };
