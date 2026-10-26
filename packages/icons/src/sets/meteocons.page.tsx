import { ALL_METEOCONS_ICONS } from "./meteocons.constants";
import { MeteoconsIcon } from "./meteocons";
type MeteoconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "meteocons" as const;

const MeteoconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: MeteoconsIconPageProps) => {
  const icons = filter === "" ? ALL_METEOCONS_ICONS.slice(0, 100) : ALL_METEOCONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Meteocons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <MeteoconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { MeteoconsIconPage, type MeteoconsIconPageProps };
