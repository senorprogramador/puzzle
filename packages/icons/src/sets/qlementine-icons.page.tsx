import { ALL_QLEMENTINE_ICONS_ICONS } from "./qlementine-icons.constants";
import { QlementineIconsIcon } from "./qlementine-icons";
type QlementineIconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "qlementine-icons" as const;

const QlementineIconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: QlementineIconsIconPageProps) => {
  const icons = filter === "" ? ALL_QLEMENTINE_ICONS_ICONS.slice(0, 100) : ALL_QLEMENTINE_ICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Qlementine icons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <QlementineIconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { QlementineIconsIconPage, type QlementineIconsIconPageProps };
