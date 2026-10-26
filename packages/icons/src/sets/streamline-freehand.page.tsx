import { ALL_STREAMLINE_FREEHAND_ICONS } from "./streamline-freehand.constants";
import { StreamlineFreehandIcon } from "./streamline-freehand";
type StreamlineFreehandIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "streamline-freehand" as const;

const StreamlineFreehandIconPage = ({ filter = "", size = 42, color = "#302f41" }: StreamlineFreehandIconPageProps) => {
  const icons = filter === "" ? ALL_STREAMLINE_FREEHAND_ICONS.slice(0, 100) : ALL_STREAMLINE_FREEHAND_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Streamline freehand Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <StreamlineFreehandIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { StreamlineFreehandIconPage, type StreamlineFreehandIconPageProps };
