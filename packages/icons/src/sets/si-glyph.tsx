import { Icon, type IconProps } from "../icon";
import type { SiGlyphIconName } from "./si-glyph.types.ts";

const prefix = "si-glyph" as const;

type SiGlyphIconProps = Omit<IconProps, "name"> & {
  name: SiGlyphIconName;
};

const SiGlyphIcon = ({ name, ...props }: SiGlyphIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { SiGlyphIcon, type SiGlyphIconProps };
