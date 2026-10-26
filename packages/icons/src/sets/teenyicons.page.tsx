import { ALL_TEENYICONS_ICONS } from "./teenyicons.constants";
import { TeenyiconsIcon } from "./teenyicons";
type TeenyiconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "teenyicons" as const;

const TeenyiconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: TeenyiconsIconPageProps) => {
  const icons = filter === "" ? ALL_TEENYICONS_ICONS.slice(0, 100) : ALL_TEENYICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Teenyicons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <TeenyiconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { TeenyiconsIconPage, type TeenyiconsIconPageProps };
