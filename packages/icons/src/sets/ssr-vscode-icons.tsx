import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { VscodeIconsIconName } from "./vscode-icons.types.ts";

const prefix = "vscode-icons" as const;

type SSRVscodeIconsIconProps = Omit<SSRIconProps, "name"> & {
  name: VscodeIconsIconName;
};

const VscodeIconsIcon = ({ name, ...props }: SSRVscodeIconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { VscodeIconsIcon, type SSRVscodeIconsIconProps };
