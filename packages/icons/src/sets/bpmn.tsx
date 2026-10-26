import { Icon, type IconProps } from "../icon";
import type { BpmnIconName } from "./bpmn.types.ts";

const prefix = "bpmn" as const;

type BpmnIconProps = Omit<IconProps, "name"> & {
  name: BpmnIconName;
};

const BpmnIcon = ({ name, ...props }: BpmnIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { BpmnIcon, type BpmnIconProps };
