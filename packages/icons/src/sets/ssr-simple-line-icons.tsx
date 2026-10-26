import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { SimpleLineIconsIconName } from "./simple-line-icons.types.ts";

const prefix = "simple-line-icons" as const;

type SSRSimpleLineIconsIconProps = Omit<SSRIconProps, "name"> & {
  name: SimpleLineIconsIconName;
};

const SimpleLineIconsIcon = ({ name, ...props }: SSRSimpleLineIconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { SimpleLineIconsIcon, type SSRSimpleLineIconsIconProps };
