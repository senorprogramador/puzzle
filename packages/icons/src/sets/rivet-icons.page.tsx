import { ALL_RIVET_ICONS_ICONS } from "./rivet-icons.constants";
import { RivetIconsIcon } from "./rivet-icons";
type RivetIconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "rivet-icons" as const;

const RivetIconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: RivetIconsIconPageProps) => {
  const icons = filter === "" ? ALL_RIVET_ICONS_ICONS.slice(0, 100) : ALL_RIVET_ICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Rivet icons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <RivetIconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { RivetIconsIconPage, type RivetIconsIconPageProps };
