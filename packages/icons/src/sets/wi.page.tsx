import { ALL_WI_ICONS } from "./wi.constants";
import { WiIcon } from "./wi";
type WiIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "wi" as const;

const WiIconPage = ({ filter = "", size = 42, color = "#302f41" }: WiIconPageProps) => {
  const icons = filter === "" ? ALL_WI_ICONS.slice(0, 100) : ALL_WI_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Wi Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <WiIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { WiIconPage, type WiIconPageProps };
