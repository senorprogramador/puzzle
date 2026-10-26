import { ALL_FA7_SOLID_ICONS } from "./fa7-solid.constants";
import { Fa7SolidIcon } from "./fa7-solid";
type Fa7SolidIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "fa7-solid" as const;

const Fa7SolidIconPage = ({ filter = "", size = 42, color = "#302f41" }: Fa7SolidIconPageProps) => {
  const icons = filter === "" ? ALL_FA7_SOLID_ICONS.slice(0, 100) : ALL_FA7_SOLID_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Fa7solid Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <Fa7SolidIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { Fa7SolidIconPage, type Fa7SolidIconPageProps };
