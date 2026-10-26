import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { UitIconName } from "./uit.types.ts";

const prefix = "uit" as const;

type SSRUitIconProps = Omit<SSRIconProps, "name"> & {
  name: UitIconName;
};

const UitIcon = ({ name, ...props }: SSRUitIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { UitIcon, type SSRUitIconProps };
