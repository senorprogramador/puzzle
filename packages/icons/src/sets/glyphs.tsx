import { Icon, type IconProps } from "../icon";
import type { GlyphsIconName } from "./glyphs.types.ts";

const prefix = "glyphs" as const;

type GlyphsIconProps = Omit<IconProps, "name"> & {
  name: GlyphsIconName;
};

const GlyphsIcon = ({ name, ...props }: GlyphsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { GlyphsIcon, type GlyphsIconProps };
