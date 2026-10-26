import { ALL_HEROICONS_SOLID_ICONS } from "./heroicons-solid.constants";
import { HeroiconsSolidIcon } from "./heroicons-solid";
type HeroiconsSolidIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "heroicons-solid" as const;

const HeroiconsSolidIconPage = ({ filter = "", size = 42, color = "#302f41" }: HeroiconsSolidIconPageProps) => {
  const icons = filter === "" ? ALL_HEROICONS_SOLID_ICONS.slice(0, 100) : ALL_HEROICONS_SOLID_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Heroicons solid Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <HeroiconsSolidIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { HeroiconsSolidIconPage, type HeroiconsSolidIconPageProps };
