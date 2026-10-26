import { Icon, type IconProps } from "../icon";
import type { WebsymbolIconName } from "./websymbol.types.ts";

const prefix = "websymbol" as const;

type WebsymbolIconProps = Omit<IconProps, "name"> & {
  name: WebsymbolIconName;
};

const WebsymbolIcon = ({ name, ...props }: WebsymbolIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { WebsymbolIcon, type WebsymbolIconProps };
