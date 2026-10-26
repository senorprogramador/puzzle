import { Icon, type IconProps } from "../icon";
import type { LineMdIconName } from "./line-md.types.ts";

const prefix = "line-md" as const;

type LineMdIconProps = Omit<IconProps, "name"> & {
  name: LineMdIconName;
};

const LineMdIcon = ({ name, ...props }: LineMdIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { LineMdIcon, type LineMdIconProps };
