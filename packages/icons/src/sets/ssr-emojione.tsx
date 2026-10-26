import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { EmojioneIconName } from "./emojione.types.ts";

const prefix = "emojione" as const;

type SSREmojioneIconProps = Omit<SSRIconProps, "name"> & {
  name: EmojioneIconName;
};

const EmojioneIcon = ({ name, ...props }: SSREmojioneIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { EmojioneIcon, type SSREmojioneIconProps };
