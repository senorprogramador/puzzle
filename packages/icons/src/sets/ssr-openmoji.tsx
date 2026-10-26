import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { OpenmojiIconName } from "./openmoji.types.ts";

const prefix = "openmoji" as const;

type SSROpenmojiIconProps = Omit<SSRIconProps, "name"> & {
  name: OpenmojiIconName;
};

const OpenmojiIcon = ({ name, ...props }: SSROpenmojiIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { OpenmojiIcon, type SSROpenmojiIconProps };
