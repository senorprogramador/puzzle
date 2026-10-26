import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { K8sIconName } from "./k8s.types.ts";

const prefix = "k8s" as const;

type SSRK8sIconProps = Omit<SSRIconProps, "name"> & {
  name: K8sIconName;
};

const K8sIcon = ({ name, ...props }: SSRK8sIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { K8sIcon, type SSRK8sIconProps };
