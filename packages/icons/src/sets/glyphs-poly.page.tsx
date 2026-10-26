import { ALL_GLYPHS_POLY_ICONS } from "./glyphs-poly.constants";
import { GlyphsPolyIcon } from "./glyphs-poly";
type GlyphsPolyIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "glyphs-poly" as const;

const GlyphsPolyIconPage = ({ filter = "", size = 42, color = "#302f41" }: GlyphsPolyIconPageProps) => {
  const icons = filter === "" ? ALL_GLYPHS_POLY_ICONS.slice(0, 100) : ALL_GLYPHS_POLY_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Glyphs poly Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <GlyphsPolyIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { GlyphsPolyIconPage, type GlyphsPolyIconPageProps };
