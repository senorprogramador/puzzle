import { Icon, type IconProps } from "../icon";
import type { VscodeIconsIconName } from "./vscode-icons.types.ts";

const prefix = "vscode-icons" as const;

type VscodeIconsIconProps = Omit<IconProps, "name"> & {
  name: VscodeIconsIconName;
};

const VscodeIconsIcon = ({ name, ...props }: VscodeIconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { VscodeIconsIcon, type VscodeIconsIconProps };
