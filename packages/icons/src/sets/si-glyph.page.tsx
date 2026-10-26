import { ALL_SI_GLYPH_ICONS } from "./si-glyph.constants";
import { SiGlyphIcon } from "./si-glyph";
type SiGlyphIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "si-glyph" as const;

const SiGlyphIconPage = ({ filter = "", size = 42, color = "#302f41" }: SiGlyphIconPageProps) => {
  const icons = filter === "" ? ALL_SI_GLYPH_ICONS.slice(0, 100) : ALL_SI_GLYPH_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Si glyph Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <SiGlyphIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { SiGlyphIconPage, type SiGlyphIconPageProps };
