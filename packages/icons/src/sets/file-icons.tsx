import { Icon, type IconProps } from "../icon";
import type { FileIconsIconName } from "./file-icons.types.ts";

const prefix = "file-icons" as const;

type FileIconsIconProps = Omit<IconProps, "name"> & {
  name: FileIconsIconName;
};

const FileIconsIcon = ({ name, ...props }: FileIconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { FileIconsIcon, type FileIconsIconProps };
