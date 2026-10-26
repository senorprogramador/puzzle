import { Icon, type IconProps } from "../icon";
import type { GlyphsPolyIconName } from "./glyphs-poly.types.ts";

const prefix = "glyphs-poly" as const;

type GlyphsPolyIconProps = Omit<IconProps, "name"> & {
  name: GlyphsPolyIconName;
};

const GlyphsPolyIcon = ({ name, ...props }: GlyphsPolyIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { GlyphsPolyIcon, type GlyphsPolyIconProps };
