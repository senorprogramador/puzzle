import { ALL_TDESIGN_ICONS } from "./tdesign.constants";
import { TdesignIcon } from "./tdesign";
type TdesignIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "tdesign" as const;

const TdesignIconPage = ({ filter = "", size = 42, color = "#302f41" }: TdesignIconPageProps) => {
  const icons = filter === "" ? ALL_TDESIGN_ICONS.slice(0, 100) : ALL_TDESIGN_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Tdesign Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <TdesignIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { TdesignIconPage, type TdesignIconPageProps };
