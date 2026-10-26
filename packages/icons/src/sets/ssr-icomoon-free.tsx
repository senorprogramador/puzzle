import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { IcomoonFreeIconName } from "./icomoon-free.types.ts";

const prefix = "icomoon-free" as const;

type SSRIcomoonFreeIconProps = Omit<SSRIconProps, "name"> & {
  name: IcomoonFreeIconName;
};

const IcomoonFreeIcon = ({ name, ...props }: SSRIcomoonFreeIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { IcomoonFreeIcon, type SSRIcomoonFreeIconProps };
