import { Icon, type IconProps } from "../icon";
import type { DeviconPlainIconName } from "./devicon-plain.types.ts";

const prefix = "devicon-plain" as const;

type DeviconPlainIconProps = Omit<IconProps, "name"> & {
  name: DeviconPlainIconName;
};

const DeviconPlainIcon = ({ name, ...props }: DeviconPlainIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { DeviconPlainIcon, type DeviconPlainIconProps };
