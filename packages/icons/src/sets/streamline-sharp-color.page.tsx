import { ALL_STREAMLINE_SHARP_COLOR_ICONS } from "./streamline-sharp-color.constants";
import { StreamlineSharpColorIcon } from "./streamline-sharp-color";
type StreamlineSharpColorIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "streamline-sharp-color" as const;

const StreamlineSharpColorIconPage = ({ filter = "", size = 42, color = "#302f41" }: StreamlineSharpColorIconPageProps) => {
  const icons = filter === "" ? ALL_STREAMLINE_SHARP_COLOR_ICONS.slice(0, 100) : ALL_STREAMLINE_SHARP_COLOR_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Streamline sharp color Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <StreamlineSharpColorIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { StreamlineSharpColorIconPage, type StreamlineSharpColorIconPageProps };
