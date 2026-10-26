import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { WpfIconName } from "./wpf.types.ts";

const prefix = "wpf" as const;

type SSRWpfIconProps = Omit<SSRIconProps, "name"> & {
  name: WpfIconName;
};

const WpfIcon = ({ name, ...props }: SSRWpfIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { WpfIcon, type SSRWpfIconProps };
