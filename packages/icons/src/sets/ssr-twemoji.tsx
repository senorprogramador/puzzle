import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { TwemojiIconName } from "./twemoji.types.ts";

const prefix = "twemoji" as const;

type SSRTwemojiIconProps = Omit<SSRIconProps, "name"> & {
  name: TwemojiIconName;
};

const TwemojiIcon = ({ name, ...props }: SSRTwemojiIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { TwemojiIcon, type SSRTwemojiIconProps };
