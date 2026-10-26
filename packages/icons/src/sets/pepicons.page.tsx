import { ALL_PEPICONS_ICONS } from "./pepicons.constants";
import { PepiconsIcon } from "./pepicons";
type PepiconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "pepicons" as const;

const PepiconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: PepiconsIconPageProps) => {
  const icons = filter === "" ? ALL_PEPICONS_ICONS.slice(0, 100) : ALL_PEPICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Pepicons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <PepiconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { PepiconsIconPage, type PepiconsIconPageProps };
