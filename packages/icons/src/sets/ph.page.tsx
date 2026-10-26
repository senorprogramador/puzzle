import { ALL_PH_ICONS } from "./ph.constants";
import { PhIcon } from "./ph";
type PhIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "ph" as const;

const PhIconPage = ({ filter = "", size = 42, color = "#302f41" }: PhIconPageProps) => {
  const icons = filter === "" ? ALL_PH_ICONS.slice(0, 100) : ALL_PH_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Ph Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <PhIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { PhIconPage, type PhIconPageProps };
