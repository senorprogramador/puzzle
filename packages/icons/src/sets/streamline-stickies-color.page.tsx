import { ALL_STREAMLINE_STICKIES_COLOR_ICONS } from "./streamline-stickies-color.constants";
import { StreamlineStickiesColorIcon } from "./streamline-stickies-color";
type StreamlineStickiesColorIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "streamline-stickies-color" as const;

const StreamlineStickiesColorIconPage = ({ filter = "", size = 42, color = "#302f41" }: StreamlineStickiesColorIconPageProps) => {
  const icons = filter === "" ? ALL_STREAMLINE_STICKIES_COLOR_ICONS.slice(0, 100) : ALL_STREAMLINE_STICKIES_COLOR_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Streamline stickies color Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <StreamlineStickiesColorIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { StreamlineStickiesColorIconPage, type StreamlineStickiesColorIconPageProps };
