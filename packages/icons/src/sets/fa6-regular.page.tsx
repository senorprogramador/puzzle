import { ALL_FA6_REGULAR_ICONS } from "./fa6-regular.constants";
import { Fa6RegularIcon } from "./fa6-regular";
type Fa6RegularIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "fa6-regular" as const;

const Fa6RegularIconPage = ({ filter = "", size = 42, color = "#302f41" }: Fa6RegularIconPageProps) => {
  const icons = filter === "" ? ALL_FA6_REGULAR_ICONS.slice(0, 100) : ALL_FA6_REGULAR_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Fa6regular Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <Fa6RegularIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { Fa6RegularIconPage, type Fa6RegularIconPageProps };
