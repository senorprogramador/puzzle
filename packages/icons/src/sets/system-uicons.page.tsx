import { ALL_SYSTEM_UICONS_ICONS } from "./system-uicons.constants";
import { SystemUiconsIcon } from "./system-uicons";
type SystemUiconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "system-uicons" as const;

const SystemUiconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: SystemUiconsIconPageProps) => {
  const icons = filter === "" ? ALL_SYSTEM_UICONS_ICONS.slice(0, 100) : ALL_SYSTEM_UICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>System uicons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <SystemUiconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { SystemUiconsIconPage, type SystemUiconsIconPageProps };
