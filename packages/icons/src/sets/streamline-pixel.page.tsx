import { ALL_STREAMLINE_PIXEL_ICONS } from "./streamline-pixel.constants";
import { StreamlinePixelIcon } from "./streamline-pixel";
type StreamlinePixelIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "streamline-pixel" as const;

const StreamlinePixelIconPage = ({ filter = "", size = 42, color = "#302f41" }: StreamlinePixelIconPageProps) => {
  const icons = filter === "" ? ALL_STREAMLINE_PIXEL_ICONS.slice(0, 100) : ALL_STREAMLINE_PIXEL_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Streamline pixel Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <StreamlinePixelIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { StreamlinePixelIconPage, type StreamlinePixelIconPageProps };
