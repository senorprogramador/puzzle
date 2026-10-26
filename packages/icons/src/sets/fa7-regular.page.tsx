import { ALL_FA7_REGULAR_ICONS } from "./fa7-regular.constants";
import { Fa7RegularIcon } from "./fa7-regular";
type Fa7RegularIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "fa7-regular" as const;

const Fa7RegularIconPage = ({ filter = "", size = 42, color = "#302f41" }: Fa7RegularIconPageProps) => {
  const icons = filter === "" ? ALL_FA7_REGULAR_ICONS.slice(0, 100) : ALL_FA7_REGULAR_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Fa7regular Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <Fa7RegularIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { Fa7RegularIconPage, type Fa7RegularIconPageProps };
