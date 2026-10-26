import { ALL_FA6_BRANDS_ICONS } from "./fa6-brands.constants";
import { Fa6BrandsIcon } from "./fa6-brands";
type Fa6BrandsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "fa6-brands" as const;

const Fa6BrandsIconPage = ({ filter = "", size = 42, color = "#302f41" }: Fa6BrandsIconPageProps) => {
  const icons = filter === "" ? ALL_FA6_BRANDS_ICONS.slice(0, 100) : ALL_FA6_BRANDS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Fa6brands Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <Fa6BrandsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { Fa6BrandsIconPage, type Fa6BrandsIconPageProps };
