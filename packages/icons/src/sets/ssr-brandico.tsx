import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { BrandicoIconName } from "./brandico.types.ts";

const prefix = "brandico" as const;

type SSRBrandicoIconProps = Omit<SSRIconProps, "name"> & {
  name: BrandicoIconName;
};

const BrandicoIcon = ({ name, ...props }: SSRBrandicoIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { BrandicoIcon, type SSRBrandicoIconProps };
