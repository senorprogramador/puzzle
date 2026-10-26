import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { JamIconName } from "./jam.types.ts";

const prefix = "jam" as const;

type SSRJamIconProps = Omit<SSRIconProps, "name"> & {
  name: JamIconName;
};

const JamIcon = ({ name, ...props }: SSRJamIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { JamIcon, type SSRJamIconProps };
