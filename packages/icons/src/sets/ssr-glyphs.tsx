import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { GlyphsIconName } from "./glyphs.types.ts";

const prefix = "glyphs" as const;

type SSRGlyphsIconProps = Omit<SSRIconProps, "name"> & {
  name: GlyphsIconName;
};

const GlyphsIcon = ({ name, ...props }: SSRGlyphsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { GlyphsIcon, type SSRGlyphsIconProps };
