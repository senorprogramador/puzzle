import { ALL_GCP_ICONS } from "./gcp.constants";
import { GcpIcon } from "./gcp";
type GcpIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "gcp" as const;

const GcpIconPage = ({ filter = "", size = 42, color = "#302f41" }: GcpIconPageProps) => {
  const icons = filter === "" ? ALL_GCP_ICONS.slice(0, 100) : ALL_GCP_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Gcp Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <GcpIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { GcpIconPage, type GcpIconPageProps };
