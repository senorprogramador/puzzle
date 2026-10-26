import { ALL_LOGOS_ICONS } from "./logos.constants";
import { LogosIcon } from "./logos";
type LogosIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "logos" as const;

const LogosIconPage = ({ filter = "", size = 42, color = "#302f41" }: LogosIconPageProps) => {
  const icons = filter === "" ? ALL_LOGOS_ICONS.slice(0, 100) : ALL_LOGOS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Logos Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <LogosIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { LogosIconPage, type LogosIconPageProps };
