import { ALL_STREAMLINE_KAMELEON_COLOR_ICONS } from "./streamline-kameleon-color.constants";
import { StreamlineKameleonColorIcon } from "./streamline-kameleon-color";
type StreamlineKameleonColorIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "streamline-kameleon-color" as const;

const StreamlineKameleonColorIconPage = ({ filter = "", size = 42, color = "#302f41" }: StreamlineKameleonColorIconPageProps) => {
  const icons = filter === "" ? ALL_STREAMLINE_KAMELEON_COLOR_ICONS.slice(0, 100) : ALL_STREAMLINE_KAMELEON_COLOR_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Streamline kameleon color Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <StreamlineKameleonColorIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { StreamlineKameleonColorIconPage, type StreamlineKameleonColorIconPageProps };
