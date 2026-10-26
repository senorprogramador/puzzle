import { ALL_MAGE_ICONS } from "./mage.constants";
import { MageIcon } from "./mage";
type MageIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "mage" as const;

const MageIconPage = ({ filter = "", size = 42, color = "#302f41" }: MageIconPageProps) => {
  const icons = filter === "" ? ALL_MAGE_ICONS.slice(0, 100) : ALL_MAGE_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Mage Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <MageIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { MageIconPage, type MageIconPageProps };
