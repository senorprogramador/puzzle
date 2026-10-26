import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { DinkieIconsIconName } from "./dinkie-icons.types.ts";

const prefix = "dinkie-icons" as const;

type SSRDinkieIconsIconProps = Omit<SSRIconProps, "name"> & {
  name: DinkieIconsIconName;
};

const DinkieIconsIcon = ({ name, ...props }: SSRDinkieIconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { DinkieIconsIcon, type SSRDinkieIconsIconProps };
