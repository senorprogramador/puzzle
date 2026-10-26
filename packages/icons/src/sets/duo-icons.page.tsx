import { ALL_DUO_ICONS_ICONS } from "./duo-icons.constants";
import { DuoIconsIcon } from "./duo-icons";
type DuoIconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "duo-icons" as const;

const DuoIconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: DuoIconsIconPageProps) => {
  const icons = filter === "" ? ALL_DUO_ICONS_ICONS.slice(0, 100) : ALL_DUO_ICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Duo icons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <DuoIconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { DuoIconsIconPage, type DuoIconsIconPageProps };
