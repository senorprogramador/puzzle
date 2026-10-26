import { ALL_GLYPHS_ICONS } from "./glyphs.constants";
import { GlyphsIcon } from "./glyphs";
type GlyphsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "glyphs" as const;

const GlyphsIconPage = ({ filter = "", size = 42, color = "#302f41" }: GlyphsIconPageProps) => {
  const icons = filter === "" ? ALL_GLYPHS_ICONS.slice(0, 100) : ALL_GLYPHS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Glyphs Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <GlyphsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { GlyphsIconPage, type GlyphsIconPageProps };
