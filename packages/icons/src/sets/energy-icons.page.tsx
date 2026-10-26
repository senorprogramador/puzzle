import { ALL_ENERGY_ICONS_ICONS } from "./energy-icons.constants";
import { EnergyIconsIcon } from "./energy-icons";
type EnergyIconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "energy-icons" as const;

const EnergyIconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: EnergyIconsIconPageProps) => {
  const icons = filter === "" ? ALL_ENERGY_ICONS_ICONS.slice(0, 100) : ALL_ENERGY_ICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Energy icons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <EnergyIconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { EnergyIconsIconPage, type EnergyIconsIconPageProps };
