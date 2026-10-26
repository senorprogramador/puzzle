import { Icon, type IconProps } from "../icon";
import type { EmojioneIconName } from "./emojione.types.ts";

const prefix = "emojione" as const;

type EmojioneIconProps = Omit<IconProps, "name"> & {
  name: EmojioneIconName;
};

const EmojioneIcon = ({ name, ...props }: EmojioneIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { EmojioneIcon, type EmojioneIconProps };
