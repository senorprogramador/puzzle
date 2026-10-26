import { ALL_STREAMLINE_CYBER_COLOR_ICONS } from "./streamline-cyber-color.constants";
import { StreamlineCyberColorIcon } from "./streamline-cyber-color";
type StreamlineCyberColorIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "streamline-cyber-color" as const;

const StreamlineCyberColorIconPage = ({ filter = "", size = 42, color = "#302f41" }: StreamlineCyberColorIconPageProps) => {
  const icons = filter === "" ? ALL_STREAMLINE_CYBER_COLOR_ICONS.slice(0, 100) : ALL_STREAMLINE_CYBER_COLOR_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Streamline cyber color Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <StreamlineCyberColorIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { StreamlineCyberColorIconPage, type StreamlineCyberColorIconPageProps };
