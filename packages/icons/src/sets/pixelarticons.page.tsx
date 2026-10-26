import { ALL_PIXELARTICONS_ICONS } from "./pixelarticons.constants";
import { PixelarticonsIcon } from "./pixelarticons";
type PixelarticonsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "pixelarticons" as const;

const PixelarticonsIconPage = ({ filter = "", size = 42, color = "#302f41" }: PixelarticonsIconPageProps) => {
  const icons = filter === "" ? ALL_PIXELARTICONS_ICONS.slice(0, 100) : ALL_PIXELARTICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Pixelarticons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <PixelarticonsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { PixelarticonsIconPage, type PixelarticonsIconPageProps };
