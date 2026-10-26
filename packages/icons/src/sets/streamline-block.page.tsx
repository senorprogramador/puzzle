import { ALL_STREAMLINE_BLOCK_ICONS } from "./streamline-block.constants";
import { StreamlineBlockIcon } from "./streamline-block";
type StreamlineBlockIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "streamline-block" as const;

const StreamlineBlockIconPage = ({ filter = "", size = 42, color = "#302f41" }: StreamlineBlockIconPageProps) => {
  const icons = filter === "" ? ALL_STREAMLINE_BLOCK_ICONS.slice(0, 100) : ALL_STREAMLINE_BLOCK_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Streamline block Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <StreamlineBlockIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { StreamlineBlockIconPage, type StreamlineBlockIconPageProps };
