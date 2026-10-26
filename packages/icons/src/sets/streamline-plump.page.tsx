import { ALL_STREAMLINE_PLUMP_ICONS } from "./streamline-plump.constants";
import { StreamlinePlumpIcon } from "./streamline-plump";
type StreamlinePlumpIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "streamline-plump" as const;

const StreamlinePlumpIconPage = ({ filter = "", size = 42, color = "#302f41" }: StreamlinePlumpIconPageProps) => {
  const icons = filter === "" ? ALL_STREAMLINE_PLUMP_ICONS.slice(0, 100) : ALL_STREAMLINE_PLUMP_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Streamline plump Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <StreamlinePlumpIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { StreamlinePlumpIconPage, type StreamlinePlumpIconPageProps };
