import { Icon, type IconProps } from "../icon";
import type { FxemojiIconName } from "./fxemoji.types.ts";

const prefix = "fxemoji" as const;

type FxemojiIconProps = Omit<IconProps, "name"> & {
  name: FxemojiIconName;
};

const FxemojiIcon = ({ name, ...props }: FxemojiIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { FxemojiIcon, type FxemojiIconProps };
