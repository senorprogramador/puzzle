import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { FlatUiIconName } from "./flat-ui.types.ts";

const prefix = "flat-ui" as const;

type SSRFlatUiIconProps = Omit<SSRIconProps, "name"> & {
  name: FlatUiIconName;
};

const FlatUiIcon = ({ name, ...props }: SSRFlatUiIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { FlatUiIcon, type SSRFlatUiIconProps };
