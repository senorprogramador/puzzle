import { ALL_GRIDDY_ICONS_ICONS } from "./griddy-icons.constants";
import { GriddyIconsIcon } from "./griddy-icons";
type GriddyIconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "griddy-icons" as const;

const GriddyIconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: GriddyIconsIconPageProps) => {
  const icons = filter === "" ? ALL_GRIDDY_ICONS_ICONS.slice(0, 100) : ALL_GRIDDY_ICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Griddy icons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <GriddyIconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { GriddyIconsIconPage, type GriddyIconsIconPageProps };
