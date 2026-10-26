import { ALL_STREAMLINE_ULTIMATE_ICONS } from "./streamline-ultimate.constants";
import { StreamlineUltimateIcon } from "./streamline-ultimate";
type StreamlineUltimateIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "streamline-ultimate" as const;

const StreamlineUltimateIconPage = ({ filter = "", size = 42, color = "#302f41" }: StreamlineUltimateIconPageProps) => {
  const icons = filter === "" ? ALL_STREAMLINE_ULTIMATE_ICONS.slice(0, 100) : ALL_STREAMLINE_ULTIMATE_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Streamline ultimate Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <StreamlineUltimateIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { StreamlineUltimateIconPage, type StreamlineUltimateIconPageProps };
