import { ALL_ICONOVEN_ICONS } from "./iconoven.constants";
import { IconovenIcon } from "./iconoven";
type IconovenIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "iconoven" as const;

const IconovenIconPage = ({ filter = "", size = 42, color = "#302f41" }: IconovenIconPageProps) => {
  const icons = filter === "" ? ALL_ICONOVEN_ICONS.slice(0, 100) : ALL_ICONOVEN_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Iconoven Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <IconovenIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { IconovenIconPage, type IconovenIconPageProps };
