import { ALL_FAD_ICONS } from "./fad.constants";
import { FadIcon } from "./fad";
type FadIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "fad" as const;

const FadIconPage = ({ filter = "", size = 42, color = "#302f41" }: FadIconPageProps) => {
  const icons = filter === "" ? ALL_FAD_ICONS.slice(0, 100) : ALL_FAD_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Fad Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <FadIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { FadIconPage, type FadIconPageProps };
