import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { SubwayIconName } from "./subway.types.ts";

const prefix = "subway" as const;

type SSRSubwayIconProps = Omit<SSRIconProps, "name"> & {
  name: SubwayIconName;
};

const SubwayIcon = ({ name, ...props }: SSRSubwayIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { SubwayIcon, type SSRSubwayIconProps };
