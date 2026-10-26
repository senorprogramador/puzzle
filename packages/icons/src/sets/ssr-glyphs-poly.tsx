import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { GlyphsPolyIconName } from "./glyphs-poly.types.ts";

const prefix = "glyphs-poly" as const;

type SSRGlyphsPolyIconProps = Omit<SSRIconProps, "name"> & {
  name: GlyphsPolyIconName;
};

const GlyphsPolyIcon = ({ name, ...props }: SSRGlyphsPolyIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { GlyphsPolyIcon, type SSRGlyphsPolyIconProps };
