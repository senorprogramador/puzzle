import { ALL_STREAMLINE_ULTIMATE_COLOR_ICONS } from "./streamline-ultimate-color.constants";
import { StreamlineUltimateColorIcon } from "./streamline-ultimate-color";
type StreamlineUltimateColorIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "streamline-ultimate-color" as const;

const StreamlineUltimateColorIconPage = ({ filter = "", size = 42, color = "#302f41" }: StreamlineUltimateColorIconPageProps) => {
  const icons = filter === "" ? ALL_STREAMLINE_ULTIMATE_COLOR_ICONS.slice(0, 100) : ALL_STREAMLINE_ULTIMATE_COLOR_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Streamline ultimate color Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <StreamlineUltimateColorIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { StreamlineUltimateColorIconPage, type StreamlineUltimateColorIconPageProps };
