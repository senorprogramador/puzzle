import { ALL_STREAMLINE_PLUMP_COLOR_ICONS } from "./streamline-plump-color.constants";
import { StreamlinePlumpColorIcon } from "./streamline-plump-color";
type StreamlinePlumpColorIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "streamline-plump-color" as const;

const StreamlinePlumpColorIconPage = ({ filter = "", size = 42, color = "#302f41" }: StreamlinePlumpColorIconPageProps) => {
  const icons = filter === "" ? ALL_STREAMLINE_PLUMP_COLOR_ICONS.slice(0, 100) : ALL_STREAMLINE_PLUMP_COLOR_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Streamline plump color Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <StreamlinePlumpColorIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { StreamlinePlumpColorIconPage, type StreamlinePlumpColorIconPageProps };
