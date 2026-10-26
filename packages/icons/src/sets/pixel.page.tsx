import { ALL_PIXEL_ICONS } from "./pixel.constants";
import { PixelIcon } from "./pixel";
type PixelIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "pixel" as const;

const PixelIconPage = ({ filter = "", size = 42, color = "#302f41" }: PixelIconPageProps) => {
  const icons = filter === "" ? ALL_PIXEL_ICONS.slice(0, 100) : ALL_PIXEL_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Pixel Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <PixelIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { PixelIconPage, type PixelIconPageProps };
