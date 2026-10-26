import { ALL_FONTISTO_ICONS } from "./fontisto.constants";
import { FontistoIcon } from "./fontisto";
type FontistoIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "fontisto" as const;

const FontistoIconPage = ({ filter = "", size = 42, color = "#302f41" }: FontistoIconPageProps) => {
  const icons = filter === "" ? ALL_FONTISTO_ICONS.slice(0, 100) : ALL_FONTISTO_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Fontisto Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <FontistoIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { FontistoIconPage, type FontistoIconPageProps };
