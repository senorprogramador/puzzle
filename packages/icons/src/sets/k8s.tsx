import { Icon, type IconProps } from "../icon";
import type { K8sIconName } from "./k8s.types.ts";

const prefix = "k8s" as const;

type K8sIconProps = Omit<IconProps, "name"> & {
  name: K8sIconName;
};

const K8sIcon = ({ name, ...props }: K8sIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { K8sIcon, type K8sIconProps };
