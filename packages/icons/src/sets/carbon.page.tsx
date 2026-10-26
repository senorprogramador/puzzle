import { ALL_CARBON_ICONS } from "./carbon.constants";
import { CarbonIcon } from "./carbon";
type CarbonIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "carbon" as const;

const CarbonIconPage = ({ filter = "", size = 42, color = "#302f41" }: CarbonIconPageProps) => {
  const icons = filter === "" ? ALL_CARBON_ICONS.slice(0, 100) : ALL_CARBON_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Carbon Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <CarbonIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { CarbonIconPage, type CarbonIconPageProps };
