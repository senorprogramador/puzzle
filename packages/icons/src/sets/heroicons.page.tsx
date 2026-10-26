import { ALL_HEROICONS_ICONS } from "./heroicons.constants";
import { HeroiconsIcon } from "./heroicons";
type HeroiconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "heroicons" as const;

const HeroiconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: HeroiconsIconPageProps) => {
  const icons = filter === "" ? ALL_HEROICONS_ICONS.slice(0, 100) : ALL_HEROICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Heroicons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <HeroiconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { HeroiconsIconPage, type HeroiconsIconPageProps };
