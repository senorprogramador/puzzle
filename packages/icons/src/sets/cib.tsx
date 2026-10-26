import { Icon, type IconProps } from "../icon";
import type { CibIconName } from "./cib.types.ts";

const prefix = "cib" as const;

type CibIconProps = Omit<IconProps, "name"> & {
  name: CibIconName;
};

const CibIcon = ({ name, ...props }: CibIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { CibIcon, type CibIconProps };
