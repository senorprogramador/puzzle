import { ALL_LETS_ICONS_ICONS } from "./lets-icons.constants";
import { LetsIconsIcon } from "./lets-icons";
type LetsIconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "lets-icons" as const;

const LetsIconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: LetsIconsIconPageProps) => {
  const icons = filter === "" ? ALL_LETS_ICONS_ICONS.slice(0, 100) : ALL_LETS_ICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Lets icons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <LetsIconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { LetsIconsIconPage, type LetsIconsIconPageProps };
