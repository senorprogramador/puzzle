import { ALL_STREAMLINE_CYBER_ICONS } from "./streamline-cyber.constants";
import { StreamlineCyberIcon } from "./streamline-cyber";
type StreamlineCyberIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "streamline-cyber" as const;

const StreamlineCyberIconPage = ({ filter = "", size = 42, color = "#302f41" }: StreamlineCyberIconPageProps) => {
  const icons = filter === "" ? ALL_STREAMLINE_CYBER_ICONS.slice(0, 100) : ALL_STREAMLINE_CYBER_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Streamline cyber Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <StreamlineCyberIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { StreamlineCyberIconPage, type StreamlineCyberIconPageProps };
