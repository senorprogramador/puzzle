import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { FxemojiIconName } from "./fxemoji.types.ts";

const prefix = "fxemoji" as const;

type SSRFxemojiIconProps = Omit<SSRIconProps, "name"> & {
  name: FxemojiIconName;
};

const FxemojiIcon = ({ name, ...props }: SSRFxemojiIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { FxemojiIcon, type SSRFxemojiIconProps };
