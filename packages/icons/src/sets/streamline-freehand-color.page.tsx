import { ALL_STREAMLINE_FREEHAND_COLOR_ICONS } from "./streamline-freehand-color.constants";
import { StreamlineFreehandColorIcon } from "./streamline-freehand-color";
type StreamlineFreehandColorIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "streamline-freehand-color" as const;

const StreamlineFreehandColorIconPage = ({ filter = "", size = 42, color = "#302f41" }: StreamlineFreehandColorIconPageProps) => {
  const icons = filter === "" ? ALL_STREAMLINE_FREEHAND_COLOR_ICONS.slice(0, 100) : ALL_STREAMLINE_FREEHAND_COLOR_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Streamline freehand color Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <StreamlineFreehandColorIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { StreamlineFreehandColorIconPage, type StreamlineFreehandColorIconPageProps };
