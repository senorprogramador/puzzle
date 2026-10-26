import { ALL_ICONOIR_ICONS } from "./iconoir.constants";
import { IconoirIcon } from "./iconoir";
type IconoirIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "iconoir" as const;

const IconoirIconPage = ({ filter = "", size = 42, color = "#302f41" }: IconoirIconPageProps) => {
  const icons = filter === "" ? ALL_ICONOIR_ICONS.slice(0, 100) : ALL_ICONOIR_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Iconoir Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <IconoirIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { IconoirIconPage, type IconoirIconPageProps };
