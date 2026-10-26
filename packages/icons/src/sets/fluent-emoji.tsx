import { Icon, type IconProps } from "../icon";
import type { FluentEmojiIconName } from "./fluent-emoji.types.ts";

const prefix = "fluent-emoji" as const;

type FluentEmojiIconProps = Omit<IconProps, "name"> & {
  name: FluentEmojiIconName;
};

const FluentEmojiIcon = ({ name, ...props }: FluentEmojiIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { FluentEmojiIcon, type FluentEmojiIconProps };
