import { Icon, type IconProps } from "../icon";
import type { WordpressIconName } from "./wordpress.types.ts";

const prefix = "wordpress" as const;

type WordpressIconProps = Omit<IconProps, "name"> & {
  name: WordpressIconName;
};

const WordpressIcon = ({ name, ...props }: WordpressIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { WordpressIcon, type WordpressIconProps };
