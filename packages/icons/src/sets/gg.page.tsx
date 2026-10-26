import { ALL_GG_ICONS } from "./gg.constants";
import { GgIcon } from "./gg";
type GgIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "gg" as const;

const GgIconPage = ({ filter = "", size = 42, color = "#302f41" }: GgIconPageProps) => {
  const icons = filter === "" ? ALL_GG_ICONS.slice(0, 100) : ALL_GG_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Gg Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <GgIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { GgIconPage, type GgIconPageProps };
