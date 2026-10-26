import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { SiGlyphIconName } from "./si-glyph.types.ts";

const prefix = "si-glyph" as const;

type SSRSiGlyphIconProps = Omit<SSRIconProps, "name"> & {
  name: SiGlyphIconName;
};

const SiGlyphIcon = ({ name, ...props }: SSRSiGlyphIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { SiGlyphIcon, type SSRSiGlyphIconProps };
