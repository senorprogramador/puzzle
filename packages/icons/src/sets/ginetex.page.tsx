import { ALL_GINETEX_ICONS } from "./ginetex.constants";
import { GinetexIcon } from "./ginetex";
type GinetexIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "ginetex" as const;

const GinetexIconPage = ({ filter = "", size = 42, color = "#302f41" }: GinetexIconPageProps) => {
  const icons = filter === "" ? ALL_GINETEX_ICONS.slice(0, 100) : ALL_GINETEX_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Ginetex Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <GinetexIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { GinetexIconPage, type GinetexIconPageProps };
