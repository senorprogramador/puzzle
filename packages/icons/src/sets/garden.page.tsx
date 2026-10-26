import { ALL_GARDEN_ICONS } from "./garden.constants";
import { GardenIcon } from "./garden";
type GardenIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "garden" as const;

const GardenIconPage = ({ filter = "", size = 42, color = "#302f41" }: GardenIconPageProps) => {
  const icons = filter === "" ? ALL_GARDEN_ICONS.slice(0, 100) : ALL_GARDEN_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Garden Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <GardenIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { GardenIconPage, type GardenIconPageProps };
