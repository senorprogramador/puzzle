import { ALL_PINHEAD_ICONS } from "./pinhead.constants";
import { PinheadIcon } from "./pinhead";
type PinheadIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "pinhead" as const;

const PinheadIconPage = ({ filter = "", size = 42, color = "#302f41" }: PinheadIconPageProps) => {
  const icons = filter === "" ? ALL_PINHEAD_ICONS.slice(0, 100) : ALL_PINHEAD_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Pinhead Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <PinheadIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { PinheadIconPage, type PinheadIconPageProps };
