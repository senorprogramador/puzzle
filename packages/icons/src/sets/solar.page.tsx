import { ALL_SOLAR_ICONS } from "./solar.constants";
import { SolarIcon } from "./solar";
type SolarIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "solar" as const;

const SolarIconPage = ({ filter = "", size = 42, color = "#302f41" }: SolarIconPageProps) => {
  const icons = filter === "" ? ALL_SOLAR_ICONS.slice(0, 100) : ALL_SOLAR_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Solar Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <SolarIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { SolarIconPage, type SolarIconPageProps };
