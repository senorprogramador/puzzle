import { ALL_FA_SOLID_ICONS } from "./fa-solid.constants";
import { FaSolidIcon } from "./fa-solid";
type FaSolidIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "fa-solid" as const;

const FaSolidIconPage = ({ filter = "", size = 42, color = "#302f41" }: FaSolidIconPageProps) => {
  const icons = filter === "" ? ALL_FA_SOLID_ICONS.slice(0, 100) : ALL_FA_SOLID_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Fa solid Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <FaSolidIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { FaSolidIconPage, type FaSolidIconPageProps };
