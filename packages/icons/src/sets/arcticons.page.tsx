import { ALL_ARCTICONS_ICONS } from "./arcticons.constants";
import { ArcticonsIcon } from "./arcticons";
type ArcticonsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "arcticons" as const;

const ArcticonsIconPage = ({ filter = "", size = 42, color = "#302f41" }: ArcticonsIconPageProps) => {
  const icons = filter === "" ? ALL_ARCTICONS_ICONS.slice(0, 100) : ALL_ARCTICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Arcticons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <ArcticonsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { ArcticonsIconPage, type ArcticonsIconPageProps };
