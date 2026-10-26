import { ALL_GRIDICONS_ICONS } from "./gridicons.constants";
import { GridiconsIcon } from "./gridicons";
type GridiconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "gridicons" as const;

const GridiconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: GridiconsIconPageProps) => {
  const icons = filter === "" ? ALL_GRIDICONS_ICONS.slice(0, 100) : ALL_GRIDICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Gridicons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <GridiconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { GridiconsIconPage, type GridiconsIconPageProps };
