import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { EmojioneV1IconName } from "./emojione-v1.types.ts";

const prefix = "emojione-v1" as const;

type SSREmojioneV1IconProps = Omit<SSRIconProps, "name"> & {
  name: EmojioneV1IconName;
};

const EmojioneV1Icon = ({ name, ...props }: SSREmojioneV1IconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { EmojioneV1Icon, type SSREmojioneV1IconProps };
