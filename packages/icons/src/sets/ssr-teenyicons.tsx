import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { TeenyiconsIconName } from "./teenyicons.types.ts";

const prefix = "teenyicons" as const;

type SSRTeenyiconsIconProps = Omit<SSRIconProps, "name"> & {
  name: TeenyiconsIconName;
};

const TeenyiconsIcon = ({ name, ...props }: SSRTeenyiconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { TeenyiconsIcon, type SSRTeenyiconsIconProps };
