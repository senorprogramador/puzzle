import { ALL_FA_BRANDS_ICONS } from "./fa-brands.constants";
import { FaBrandsIcon } from "./fa-brands";
type FaBrandsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "fa-brands" as const;

const FaBrandsIconPage = ({ filter = "", size = 42, color = "#302f41" }: FaBrandsIconPageProps) => {
  const icons = filter === "" ? ALL_FA_BRANDS_ICONS.slice(0, 100) : ALL_FA_BRANDS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Fa brands Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <FaBrandsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { FaBrandsIconPage, type FaBrandsIconPageProps };
