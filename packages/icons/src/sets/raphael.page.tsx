import { ALL_RAPHAEL_ICONS } from "./raphael.constants";
import { RaphaelIcon } from "./raphael";
type RaphaelIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "raphael" as const;

const RaphaelIconPage = ({ filter = "", size = 42, color = "#302f41" }: RaphaelIconPageProps) => {
  const icons = filter === "" ? ALL_RAPHAEL_ICONS.slice(0, 100) : ALL_RAPHAEL_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Raphael Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <RaphaelIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { RaphaelIconPage, type RaphaelIconPageProps };
