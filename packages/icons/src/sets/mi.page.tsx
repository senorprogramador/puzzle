import { ALL_MI_ICONS } from "./mi.constants";
import { MiIcon } from "./mi";
type MiIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "mi" as const;

const MiIconPage = ({ filter = "", size = 42, color = "#302f41" }: MiIconPageProps) => {
  const icons = filter === "" ? ALL_MI_ICONS.slice(0, 100) : ALL_MI_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Mi Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <MiIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { MiIconPage, type MiIconPageProps };
