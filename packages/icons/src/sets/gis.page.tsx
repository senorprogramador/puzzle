import { ALL_GIS_ICONS } from "./gis.constants";
import { GisIcon } from "./gis";
type GisIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "gis" as const;

const GisIconPage = ({ filter = "", size = 42, color = "#302f41" }: GisIconPageProps) => {
  const icons = filter === "" ? ALL_GIS_ICONS.slice(0, 100) : ALL_GIS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Gis Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <GisIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { GisIconPage, type GisIconPageProps };
