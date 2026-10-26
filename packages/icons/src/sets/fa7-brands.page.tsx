import { ALL_FA7_BRANDS_ICONS } from "./fa7-brands.constants";
import { Fa7BrandsIcon } from "./fa7-brands";
type Fa7BrandsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "fa7-brands" as const;

const Fa7BrandsIconPage = ({ filter = "", size = 42, color = "#302f41" }: Fa7BrandsIconPageProps) => {
  const icons = filter === "" ? ALL_FA7_BRANDS_ICONS.slice(0, 100) : ALL_FA7_BRANDS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Fa7brands Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <Fa7BrandsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { Fa7BrandsIconPage, type Fa7BrandsIconPageProps };
