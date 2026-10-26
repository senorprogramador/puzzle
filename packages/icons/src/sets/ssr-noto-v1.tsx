import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { NotoV1IconName } from "./noto-v1.types.ts";

const prefix = "noto-v1" as const;

type SSRNotoV1IconProps = Omit<SSRIconProps, "name"> & {
  name: NotoV1IconName;
};

const NotoV1Icon = ({ name, ...props }: SSRNotoV1IconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { NotoV1Icon, type SSRNotoV1IconProps };
