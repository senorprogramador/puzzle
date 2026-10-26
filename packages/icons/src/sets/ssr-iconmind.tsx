import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { IconmindIconName } from "./iconmind.types.ts";

const prefix = "iconmind" as const;

type SSRIconmindIconProps = Omit<SSRIconProps, "name"> & {
  name: IconmindIconName;
};

const IconmindIcon = ({ name, ...props }: SSRIconmindIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { IconmindIcon, type SSRIconmindIconProps };
