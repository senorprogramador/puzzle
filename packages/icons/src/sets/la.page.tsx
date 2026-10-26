import { ALL_LA_ICONS } from "./la.constants";
import { LaIcon } from "./la";
type LaIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "la" as const;

const LaIconPage = ({ filter = "", size = 42, color = "#302f41" }: LaIconPageProps) => {
  const icons = filter === "" ? ALL_LA_ICONS.slice(0, 100) : ALL_LA_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>La Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <LaIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { LaIconPage, type LaIconPageProps };
