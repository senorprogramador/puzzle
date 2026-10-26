import { ALL_ICON_PARK_OUTLINE_ICONS } from "./icon-park-outline.constants";
import { IconParkOutlineIcon } from "./icon-park-outline";
type IconParkOutlineIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "icon-park-outline" as const;

const IconParkOutlineIconPage = ({ filter = "", size = 42, color = "#302f41" }: IconParkOutlineIconPageProps) => {
  const icons = filter === "" ? ALL_ICON_PARK_OUTLINE_ICONS.slice(0, 100) : ALL_ICON_PARK_OUTLINE_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Icon park outline Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <IconParkOutlineIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { IconParkOutlineIconPage, type IconParkOutlineIconPageProps };
