import { Icon, type IconProps } from "../icon";
import type { FlowbiteIconName } from "./flowbite.types.ts";

const prefix = "flowbite" as const;

type FlowbiteIconProps = Omit<IconProps, "name"> & {
  name: FlowbiteIconName;
};

const FlowbiteIcon = ({ name, ...props }: FlowbiteIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { FlowbiteIcon, type FlowbiteIconProps };
