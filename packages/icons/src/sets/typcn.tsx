import { Icon, type IconProps } from "../icon";
import type { TypcnIconName } from "./typcn.types.ts";

const prefix = "typcn" as const;

type TypcnIconProps = Omit<IconProps, "name"> & {
  name: TypcnIconName;
};

const TypcnIcon = ({ name, ...props }: TypcnIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { TypcnIcon, type TypcnIconProps };
