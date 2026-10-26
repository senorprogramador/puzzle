import { ALL_ICON_PARK_ICONS } from "./icon-park.constants";
import { IconParkIcon } from "./icon-park";
type IconParkIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "icon-park" as const;

const IconParkIconPage = ({ filter = "", size = 42, color = "#302f41" }: IconParkIconPageProps) => {
  const icons = filter === "" ? ALL_ICON_PARK_ICONS.slice(0, 100) : ALL_ICON_PARK_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Icon park Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <IconParkIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { IconParkIconPage, type IconParkIconPageProps };
