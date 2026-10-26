import { ALL_STREAMLINE_FLEX_ICONS } from "./streamline-flex.constants";
import { StreamlineFlexIcon } from "./streamline-flex";
type StreamlineFlexIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "streamline-flex" as const;

const StreamlineFlexIconPage = ({ filter = "", size = 42, color = "#302f41" }: StreamlineFlexIconPageProps) => {
  const icons = filter === "" ? ALL_STREAMLINE_FLEX_ICONS.slice(0, 100) : ALL_STREAMLINE_FLEX_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Streamline flex Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <StreamlineFlexIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { StreamlineFlexIconPage, type StreamlineFlexIconPageProps };
