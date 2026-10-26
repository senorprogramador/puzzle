import { ALL_MAP_ICONS } from "./map.constants";
import { MapIcon } from "./map";
type MapIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "map" as const;

const MapIconPage = ({ filter = "", size = 42, color = "#302f41" }: MapIconPageProps) => {
  const icons = filter === "" ? ALL_MAP_ICONS.slice(0, 100) : ALL_MAP_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Map Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <MapIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { MapIconPage, type MapIconPageProps };
