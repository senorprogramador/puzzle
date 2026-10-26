import { ALL_BI_ICONS } from "./bi.constants";
import { BiIcon } from "./bi";
type BiIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "bi" as const;

const BiIconPage = ({ filter = "", size = 42, color = "#302f41" }: BiIconPageProps) => {
  const icons = filter === "" ? ALL_BI_ICONS.slice(0, 100) : ALL_BI_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Bi Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <BiIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { BiIconPage, type BiIconPageProps };
