import { ALL_ICON_PARK_SOLID_ICONS } from "./icon-park-solid.constants";
import { IconParkSolidIcon } from "./icon-park-solid";
type IconParkSolidIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "icon-park-solid" as const;

const IconParkSolidIconPage = ({ filter = "", size = 42, color = "#302f41" }: IconParkSolidIconPageProps) => {
  const icons = filter === "" ? ALL_ICON_PARK_SOLID_ICONS.slice(0, 100) : ALL_ICON_PARK_SOLID_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Icon park solid Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <IconParkSolidIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { IconParkSolidIconPage, type IconParkSolidIconPageProps };
