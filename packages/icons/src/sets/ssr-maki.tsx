import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { MakiIconName } from "./maki.types.ts";

const prefix = "maki" as const;

type SSRMakiIconProps = Omit<SSRIconProps, "name"> & {
  name: MakiIconName;
};

const MakiIcon = ({ name, ...props }: SSRMakiIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { MakiIcon, type SSRMakiIconProps };
