import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { NotoIconName } from "./noto.types.ts";

const prefix = "noto" as const;

type SSRNotoIconProps = Omit<SSRIconProps, "name"> & {
  name: NotoIconName;
};

const NotoIcon = ({ name, ...props }: SSRNotoIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { NotoIcon, type SSRNotoIconProps };
