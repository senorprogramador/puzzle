import { ALL_GEO_ICONS } from "./geo.constants";
import { GeoIcon } from "./geo";
type GeoIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "geo" as const;

const GeoIconPage = ({ filter = "", size = 42, color = "#302f41" }: GeoIconPageProps) => {
  const icons = filter === "" ? ALL_GEO_ICONS.slice(0, 100) : ALL_GEO_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Geo Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <GeoIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { GeoIconPage, type GeoIconPageProps };
