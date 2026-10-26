import { ALL_PS_ICONS } from "./ps.constants";
import { PsIcon } from "./ps";
type PsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "ps" as const;

const PsIconPage = ({ filter = "", size = 42, color = "#302f41" }: PsIconPageProps) => {
  const icons = filter === "" ? ALL_PS_ICONS.slice(0, 100) : ALL_PS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Ps Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <PsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { PsIconPage, type PsIconPageProps };
