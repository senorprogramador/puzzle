import { Icon, type IconProps } from "../icon";
import type { FluentEmojiHighContrastIconName } from "./fluent-emoji-high-contrast.types.ts";

const prefix = "fluent-emoji-high-contrast" as const;

type FluentEmojiHighContrastIconProps = Omit<IconProps, "name"> & {
  name: FluentEmojiHighContrastIconName;
};

const FluentEmojiHighContrastIcon = ({ name, ...props }: FluentEmojiHighContrastIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { FluentEmojiHighContrastIcon, type FluentEmojiHighContrastIconProps };
