import { ALL_TOPCOAT_ICONS } from "./topcoat.constants";
import { TopcoatIcon } from "./topcoat";
type TopcoatIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "topcoat" as const;

const TopcoatIconPage = ({ filter = "", size = 42, color = "#302f41" }: TopcoatIconPageProps) => {
  const icons = filter === "" ? ALL_TOPCOAT_ICONS.slice(0, 100) : ALL_TOPCOAT_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Topcoat Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <TopcoatIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { TopcoatIconPage, type TopcoatIconPageProps };
