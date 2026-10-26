import { ALL_ICON_PARK_TWOTONE_ICONS } from "./icon-park-twotone.constants";
import { IconParkTwotoneIcon } from "./icon-park-twotone";
type IconParkTwotoneIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "icon-park-twotone" as const;

const IconParkTwotoneIconPage = ({ filter = "", size = 42, color = "#302f41" }: IconParkTwotoneIconPageProps) => {
  const icons = filter === "" ? ALL_ICON_PARK_TWOTONE_ICONS.slice(0, 100) : ALL_ICON_PARK_TWOTONE_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Icon park twotone Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <IconParkTwotoneIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { IconParkTwotoneIconPage, type IconParkTwotoneIconPageProps };
