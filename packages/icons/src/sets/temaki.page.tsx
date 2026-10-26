import { ALL_TEMAKI_ICONS } from "./temaki.constants";
import { TemakiIcon } from "./temaki";
type TemakiIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "temaki" as const;

const TemakiIconPage = ({ filter = "", size = 42, color = "#302f41" }: TemakiIconPageProps) => {
  const icons = filter === "" ? ALL_TEMAKI_ICONS.slice(0, 100) : ALL_TEMAKI_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Temaki Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <TemakiIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { TemakiIconPage, type TemakiIconPageProps };
