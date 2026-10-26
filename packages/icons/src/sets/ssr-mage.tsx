import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { MageIconName } from "./mage.types.ts";

const prefix = "mage" as const;

type SSRMageIconProps = Omit<SSRIconProps, "name"> & {
  name: MageIconName;
};

const MageIcon = ({ name, ...props }: SSRMageIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { MageIcon, type SSRMageIconProps };
