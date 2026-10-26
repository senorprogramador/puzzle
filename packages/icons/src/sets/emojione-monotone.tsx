import { Icon, type IconProps } from "../icon";
import type { EmojioneMonotoneIconName } from "./emojione-monotone.types.ts";

const prefix = "emojione-monotone" as const;

type EmojioneMonotoneIconProps = Omit<IconProps, "name"> & {
  name: EmojioneMonotoneIconName;
};

const EmojioneMonotoneIcon = ({ name, ...props }: EmojioneMonotoneIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { EmojioneMonotoneIcon, type EmojioneMonotoneIconProps };
