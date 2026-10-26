import { ALL_RI_ICONS } from "./ri.constants";
import { RiIcon } from "./ri";
type RiIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "ri" as const;

const RiIconPage = ({ filter = "", size = 42, color = "#302f41" }: RiIconPageProps) => {
  const icons = filter === "" ? ALL_RI_ICONS.slice(0, 100) : ALL_RI_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Ri Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <RiIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { RiIconPage, type RiIconPageProps };
