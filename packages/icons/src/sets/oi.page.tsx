import { ALL_OI_ICONS } from "./oi.constants";
import { OiIcon } from "./oi";
type OiIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "oi" as const;

const OiIconPage = ({ filter = "", size = 42, color = "#302f41" }: OiIconPageProps) => {
  const icons = filter === "" ? ALL_OI_ICONS.slice(0, 100) : ALL_OI_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Oi Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <OiIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { OiIconPage, type OiIconPageProps };
