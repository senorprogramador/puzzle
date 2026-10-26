import { ALL_GROMMET_ICONS_ICONS } from "./grommet-icons.constants";
import { GrommetIconsIcon } from "./grommet-icons";
type GrommetIconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "grommet-icons" as const;

const GrommetIconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: GrommetIconsIconPageProps) => {
  const icons = filter === "" ? ALL_GROMMET_ICONS_ICONS.slice(0, 100) : ALL_GROMMET_ICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Grommet icons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <GrommetIconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { GrommetIconsIconPage, type GrommetIconsIconPageProps };
