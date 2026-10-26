import { ALL_DINKIE_ICONS_ICONS } from "./dinkie-icons.constants";
import { DinkieIconsIcon } from "./dinkie-icons";
type DinkieIconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "dinkie-icons" as const;

const DinkieIconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: DinkieIconsIconPageProps) => {
  const icons = filter === "" ? ALL_DINKIE_ICONS_ICONS.slice(0, 100) : ALL_DINKIE_ICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Dinkie icons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <DinkieIconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { DinkieIconsIconPage, type DinkieIconsIconPageProps };
