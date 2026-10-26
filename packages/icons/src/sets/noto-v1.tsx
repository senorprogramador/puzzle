import { Icon, type IconProps } from "../icon";
import type { NotoV1IconName } from "./noto-v1.types.ts";

const prefix = "noto-v1" as const;

type NotoV1IconProps = Omit<IconProps, "name"> & {
  name: NotoV1IconName;
};

const NotoV1Icon = ({ name, ...props }: NotoV1IconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { NotoV1Icon, type NotoV1IconProps };
