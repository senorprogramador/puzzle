import { Icon, type IconProps } from "../icon";
import type { TwemojiIconName } from "./twemoji.types.ts";

const prefix = "twemoji" as const;

type TwemojiIconProps = Omit<IconProps, "name"> & {
  name: TwemojiIconName;
};

const TwemojiIcon = ({ name, ...props }: TwemojiIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { TwemojiIcon, type TwemojiIconProps };
