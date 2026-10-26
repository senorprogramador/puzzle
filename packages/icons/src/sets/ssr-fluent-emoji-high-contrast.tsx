import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { FluentEmojiHighContrastIconName } from "./fluent-emoji-high-contrast.types.ts";

const prefix = "fluent-emoji-high-contrast" as const;

type SSRFluentEmojiHighContrastIconProps = Omit<SSRIconProps, "name"> & {
  name: FluentEmojiHighContrastIconName;
};

const FluentEmojiHighContrastIcon = ({ name, ...props }: SSRFluentEmojiHighContrastIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { FluentEmojiHighContrastIcon, type SSRFluentEmojiHighContrastIconProps };
