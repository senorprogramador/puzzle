import { ALL_HEALTHICONS_ICONS } from "./healthicons.constants";
import { HealthiconsIcon } from "./healthicons";
type HealthiconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "healthicons" as const;

const HealthiconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: HealthiconsIconPageProps) => {
  const icons = filter === "" ? ALL_HEALTHICONS_ICONS.slice(0, 100) : ALL_HEALTHICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Healthicons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <HealthiconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { HealthiconsIconPage, type HealthiconsIconPageProps };
