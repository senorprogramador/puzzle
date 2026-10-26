import { ALL_ROENTGEN_ICONS } from "./roentgen.constants";
import { RoentgenIcon } from "./roentgen";
type RoentgenIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "roentgen" as const;

const RoentgenIconPage = ({ filter = "", size = 42, color = "#302f41" }: RoentgenIconPageProps) => {
  const icons = filter === "" ? ALL_ROENTGEN_ICONS.slice(0, 100) : ALL_ROENTGEN_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Roentgen Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <RoentgenIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { RoentgenIconPage, type RoentgenIconPageProps };
