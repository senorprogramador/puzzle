import { ALL_STREAMLINE_ICONS } from "./streamline.constants";
import { StreamlineIcon } from "./streamline";
type StreamlineIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "streamline" as const;

const StreamlineIconPage = ({ filter = "", size = 42, color = "#302f41" }: StreamlineIconPageProps) => {
  const icons = filter === "" ? ALL_STREAMLINE_ICONS.slice(0, 100) : ALL_STREAMLINE_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Streamline Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <StreamlineIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { StreamlineIconPage, type StreamlineIconPageProps };
