import { ALL_STREAMLINE_FLEX_COLOR_ICONS } from "./streamline-flex-color.constants";
import { StreamlineFlexColorIcon } from "./streamline-flex-color";
type StreamlineFlexColorIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "streamline-flex-color" as const;

const StreamlineFlexColorIconPage = ({ filter = "", size = 42, color = "#302f41" }: StreamlineFlexColorIconPageProps) => {
  const icons = filter === "" ? ALL_STREAMLINE_FLEX_COLOR_ICONS.slice(0, 100) : ALL_STREAMLINE_FLEX_COLOR_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Streamline flex color Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <StreamlineFlexColorIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { StreamlineFlexColorIconPage, type StreamlineFlexColorIconPageProps };
