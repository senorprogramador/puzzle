import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { FluentEmojiIconName } from "./fluent-emoji.types.ts";

const prefix = "fluent-emoji" as const;

type SSRFluentEmojiIconProps = Omit<SSRIconProps, "name"> & {
  name: FluentEmojiIconName;
};

const FluentEmojiIcon = ({ name, ...props }: SSRFluentEmojiIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { FluentEmojiIcon, type SSRFluentEmojiIconProps };
