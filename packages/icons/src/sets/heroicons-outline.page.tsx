import { ALL_HEROICONS_OUTLINE_ICONS } from "./heroicons-outline.constants";
import { HeroiconsOutlineIcon } from "./heroicons-outline";
type HeroiconsOutlineIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "heroicons-outline" as const;

const HeroiconsOutlineIconPage = ({ filter = "", size = 42, color = "#302f41" }: HeroiconsOutlineIconPageProps) => {
  const icons = filter === "" ? ALL_HEROICONS_OUTLINE_ICONS.slice(0, 100) : ALL_HEROICONS_OUTLINE_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Heroicons outline Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <HeroiconsOutlineIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { HeroiconsOutlineIconPage, type HeroiconsOutlineIconPageProps };
