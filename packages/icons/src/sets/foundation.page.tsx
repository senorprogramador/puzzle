import { ALL_FOUNDATION_ICONS } from "./foundation.constants";
import { FoundationIcon } from "./foundation";
type FoundationIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "foundation" as const;

const FoundationIconPage = ({ filter = "", size = 42, color = "#302f41" }: FoundationIconPageProps) => {
  const icons = filter === "" ? ALL_FOUNDATION_ICONS.slice(0, 100) : ALL_FOUNDATION_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Foundation Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <FoundationIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { FoundationIconPage, type FoundationIconPageProps };
