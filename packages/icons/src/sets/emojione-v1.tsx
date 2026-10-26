import { Icon, type IconProps } from "../icon";
import type { EmojioneV1IconName } from "./emojione-v1.types.ts";

const prefix = "emojione-v1" as const;

type EmojioneV1IconProps = Omit<IconProps, "name"> & {
  name: EmojioneV1IconName;
};

const EmojioneV1Icon = ({ name, ...props }: EmojioneV1IconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { EmojioneV1Icon, type EmojioneV1IconProps };
