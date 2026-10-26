import { ALL_BX_ICONS } from "./bx.constants";
import { BxIcon } from "./bx";
type BxIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "bx" as const;

const BxIconPage = ({ filter = "", size = 42, color = "#302f41" }: BxIconPageProps) => {
  const icons = filter === "" ? ALL_BX_ICONS.slice(0, 100) : ALL_BX_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Bx Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <BxIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { BxIconPage, type BxIconPageProps };
