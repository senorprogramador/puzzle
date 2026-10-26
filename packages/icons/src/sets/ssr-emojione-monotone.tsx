import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { EmojioneMonotoneIconName } from "./emojione-monotone.types.ts";

const prefix = "emojione-monotone" as const;

type SSREmojioneMonotoneIconProps = Omit<SSRIconProps, "name"> & {
  name: EmojioneMonotoneIconName;
};

const EmojioneMonotoneIcon = ({ name, ...props }: SSREmojioneMonotoneIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { EmojioneMonotoneIcon, type SSREmojioneMonotoneIconProps };
