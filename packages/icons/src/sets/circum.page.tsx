import { ALL_CIRCUM_ICONS } from "./circum.constants";
import { CircumIcon } from "./circum";
type CircumIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "circum" as const;

const CircumIconPage = ({ filter = "", size = 42, color = "#302f41" }: CircumIconPageProps) => {
  const icons = filter === "" ? ALL_CIRCUM_ICONS.slice(0, 100) : ALL_CIRCUM_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Circum Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <CircumIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { CircumIconPage, type CircumIconPageProps };
