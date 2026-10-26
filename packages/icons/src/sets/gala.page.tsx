import { ALL_GALA_ICONS } from "./gala.constants";
import { GalaIcon } from "./gala";
type GalaIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "gala" as const;

const GalaIconPage = ({ filter = "", size = 42, color = "#302f41" }: GalaIconPageProps) => {
  const icons = filter === "" ? ALL_GALA_ICONS.slice(0, 100) : ALL_GALA_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Gala Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <GalaIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { GalaIconPage, type GalaIconPageProps };
