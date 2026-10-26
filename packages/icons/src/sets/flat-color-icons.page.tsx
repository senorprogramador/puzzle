import { ALL_FLAT_COLOR_ICONS_ICONS } from "./flat-color-icons.constants";
import { FlatColorIconsIcon } from "./flat-color-icons";
type FlatColorIconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "flat-color-icons" as const;

const FlatColorIconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: FlatColorIconsIconPageProps) => {
  const icons = filter === "" ? ALL_FLAT_COLOR_ICONS_ICONS.slice(0, 100) : ALL_FLAT_COLOR_ICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Flat color icons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <FlatColorIconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { FlatColorIconsIconPage, type FlatColorIconsIconPageProps };
