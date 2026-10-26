import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { IwwaIconName } from "./iwwa.types.ts";

const prefix = "iwwa" as const;

type SSRIwwaIconProps = Omit<SSRIconProps, "name"> & {
  name: IwwaIconName;
};

const IwwaIcon = ({ name, ...props }: SSRIwwaIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { IwwaIcon, type SSRIwwaIconProps };
