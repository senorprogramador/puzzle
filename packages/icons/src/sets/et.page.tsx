import { ALL_ET_ICONS } from "./et.constants";
import { EtIcon } from "./et";
type EtIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "et" as const;

const EtIconPage = ({ filter = "", size = 42, color = "#302f41" }: EtIconPageProps) => {
  const icons = filter === "" ? ALL_ET_ICONS.slice(0, 100) : ALL_ET_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Et Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <EtIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { EtIconPage, type EtIconPageProps };
