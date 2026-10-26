import { ALL_STREAMLINE_LOGOS_ICONS } from "./streamline-logos.constants";
import { StreamlineLogosIcon } from "./streamline-logos";
type StreamlineLogosIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "streamline-logos" as const;

const StreamlineLogosIconPage = ({ filter = "", size = 42, color = "#302f41" }: StreamlineLogosIconPageProps) => {
  const icons = filter === "" ? ALL_STREAMLINE_LOGOS_ICONS.slice(0, 100) : ALL_STREAMLINE_LOGOS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Streamline logos Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <StreamlineLogosIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { StreamlineLogosIconPage, type StreamlineLogosIconPageProps };
