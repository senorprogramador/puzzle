import { Icon, type IconProps } from "../icon";
import type { VadivamIconName } from "./vadivam.types.ts";

const prefix = "vadivam" as const;

type VadivamIconProps = Omit<IconProps, "name"> & {
  name: VadivamIconName;
};

const VadivamIcon = ({ name, ...props }: VadivamIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { VadivamIcon, type VadivamIconProps };
