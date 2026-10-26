import { ALL_HUMBLEICONS_ICONS } from "./humbleicons.constants";
import { HumbleiconsIcon } from "./humbleicons";
type HumbleiconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "humbleicons" as const;

const HumbleiconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: HumbleiconsIconPageProps) => {
  const icons = filter === "" ? ALL_HUMBLEICONS_ICONS.slice(0, 100) : ALL_HUMBLEICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Humbleicons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <HumbleiconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { HumbleiconsIconPage, type HumbleiconsIconPageProps };
