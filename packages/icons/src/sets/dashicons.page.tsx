import { ALL_DASHICONS_ICONS } from "./dashicons.constants";
import { DashiconsIcon } from "./dashicons";
type DashiconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "dashicons" as const;

const DashiconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: DashiconsIconPageProps) => {
  const icons = filter === "" ? ALL_DASHICONS_ICONS.slice(0, 100) : ALL_DASHICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Dashicons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <DashiconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { DashiconsIconPage, type DashiconsIconPageProps };
