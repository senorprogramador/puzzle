import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { NimbusIconName } from "./nimbus.types.ts";

const prefix = "nimbus" as const;

type SSRNimbusIconProps = Omit<SSRIconProps, "name"> & {
  name: NimbusIconName;
};

const NimbusIcon = ({ name, ...props }: SSRNimbusIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { NimbusIcon, type SSRNimbusIconProps };
