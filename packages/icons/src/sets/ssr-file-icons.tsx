import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { FileIconsIconName } from "./file-icons.types.ts";

const prefix = "file-icons" as const;

type SSRFileIconsIconProps = Omit<SSRIconProps, "name"> & {
  name: FileIconsIconName;
};

const FileIconsIcon = ({ name, ...props }: SSRFileIconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { FileIconsIcon, type SSRFileIconsIconProps };
