import { ALL_FA6_SOLID_ICONS } from "./fa6-solid.constants";
import { Fa6SolidIcon } from "./fa6-solid";
type Fa6SolidIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "fa6-solid" as const;

const Fa6SolidIconPage = ({ filter = "", size = 42, color = "#302f41" }: Fa6SolidIconPageProps) => {
  const icons = filter === "" ? ALL_FA6_SOLID_ICONS.slice(0, 100) : ALL_FA6_SOLID_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Fa6solid Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <Fa6SolidIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { Fa6SolidIconPage, type Fa6SolidIconPageProps };
