import { ALL_WHH_ICONS } from "./whh.constants";
import { WhhIcon } from "./whh";
type WhhIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "whh" as const;

const WhhIconPage = ({ filter = "", size = 42, color = "#302f41" }: WhhIconPageProps) => {
  const icons = filter === "" ? ALL_WHH_ICONS.slice(0, 100) : ALL_WHH_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Whh Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <WhhIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { WhhIconPage, type WhhIconPageProps };
