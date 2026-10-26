import { ALL_FEATHER_ICONS } from "./feather.constants";
import { FeatherIcon } from "./feather";
type FeatherIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "feather" as const;

const FeatherIconPage = ({ filter = "", size = 42, color = "#302f41" }: FeatherIconPageProps) => {
  const icons = filter === "" ? ALL_FEATHER_ICONS.slice(0, 100) : ALL_FEATHER_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Feather Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <FeatherIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { FeatherIconPage, type FeatherIconPageProps };
