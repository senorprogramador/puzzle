import { ALL_F7_ICONS } from "./f7.constants";
import { F7Icon } from "./f7";
type F7IconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "f7" as const;

const F7IconPage = ({ filter = "", size = 42, color = "#302f41" }: F7IconPageProps) => {
  const icons = filter === "" ? ALL_F7_ICONS.slice(0, 100) : ALL_F7_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>F7 Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <F7Icon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { F7IconPage, type F7IconPageProps };
