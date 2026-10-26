import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { FlowbiteIconName } from "./flowbite.types.ts";

const prefix = "flowbite" as const;

type SSRFlowbiteIconProps = Omit<SSRIconProps, "name"> & {
  name: FlowbiteIconName;
};

const FlowbiteIcon = ({ name, ...props }: SSRFlowbiteIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { FlowbiteIcon, type SSRFlowbiteIconProps };
