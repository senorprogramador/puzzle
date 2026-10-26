import { ALL_ZONDICONS_ICONS } from "./zondicons.constants";
import { ZondiconsIcon } from "./zondicons";
type ZondiconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "zondicons" as const;

const ZondiconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: ZondiconsIconPageProps) => {
  const icons = filter === "" ? ALL_ZONDICONS_ICONS.slice(0, 100) : ALL_ZONDICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Zondicons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <ZondiconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { ZondiconsIconPage, type ZondiconsIconPageProps };
