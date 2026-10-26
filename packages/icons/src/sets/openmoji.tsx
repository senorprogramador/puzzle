import { Icon, type IconProps } from "../icon";
import type { OpenmojiIconName } from "./openmoji.types.ts";

const prefix = "openmoji" as const;

type OpenmojiIconProps = Omit<IconProps, "name"> & {
  name: OpenmojiIconName;
};

const OpenmojiIcon = ({ name, ...props }: OpenmojiIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { OpenmojiIcon, type OpenmojiIconProps };
