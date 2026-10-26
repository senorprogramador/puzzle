import { ALL_STREAMLINE_SHARP_ICONS } from "./streamline-sharp.constants";
import { StreamlineSharpIcon } from "./streamline-sharp";
type StreamlineSharpIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "streamline-sharp" as const;

const StreamlineSharpIconPage = ({ filter = "", size = 42, color = "#302f41" }: StreamlineSharpIconPageProps) => {
  const icons = filter === "" ? ALL_STREAMLINE_SHARP_ICONS.slice(0, 100) : ALL_STREAMLINE_SHARP_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Streamline sharp Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <StreamlineSharpIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { StreamlineSharpIconPage, type StreamlineSharpIconPageProps };
