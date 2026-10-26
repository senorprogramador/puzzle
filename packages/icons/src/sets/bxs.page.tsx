import { ALL_BXS_ICONS } from "./bxs.constants";
import { BxsIcon } from "./bxs";
type BxsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "bxs" as const;

const BxsIconPage = ({ filter = "", size = 42, color = "#302f41" }: BxsIconPageProps) => {
  const icons = filter === "" ? ALL_BXS_ICONS.slice(0, 100) : ALL_BXS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Bxs Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <BxsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { BxsIconPage, type BxsIconPageProps };
