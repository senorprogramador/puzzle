import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { BpmnIconName } from "./bpmn.types.ts";

const prefix = "bpmn" as const;

type SSRBpmnIconProps = Omit<SSRIconProps, "name"> & {
  name: BpmnIconName;
};

const BpmnIcon = ({ name, ...props }: SSRBpmnIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { BpmnIcon, type SSRBpmnIconProps };
