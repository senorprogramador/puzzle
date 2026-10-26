import { ALL_HUGEICONS_ICONS } from "./hugeicons.constants";
import { HugeiconsIcon } from "./hugeicons";
type HugeiconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "hugeicons" as const;

const HugeiconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: HugeiconsIconPageProps) => {
  const icons = filter === "" ? ALL_HUGEICONS_ICONS.slice(0, 100) : ALL_HUGEICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Hugeicons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <HugeiconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { HugeiconsIconPage, type HugeiconsIconPageProps };
