import { ALL_ZMDI_ICONS } from "./zmdi.constants";
import { ZmdiIcon } from "./zmdi";
type ZmdiIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "zmdi" as const;

const ZmdiIconPage = ({ filter = "", size = 42, color = "#302f41" }: ZmdiIconPageProps) => {
  const icons = filter === "" ? ALL_ZMDI_ICONS.slice(0, 100) : ALL_ZMDI_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Zmdi Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <ZmdiIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { ZmdiIconPage, type ZmdiIconPageProps };
