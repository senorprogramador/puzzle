import { ALL_PAJAMAS_ICONS } from "./pajamas.constants";
import { PajamasIcon } from "./pajamas";
type PajamasIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "pajamas" as const;

const PajamasIconPage = ({ filter = "", size = 42, color = "#302f41" }: PajamasIconPageProps) => {
  const icons = filter === "" ? ALL_PAJAMAS_ICONS.slice(0, 100) : ALL_PAJAMAS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Pajamas Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <PajamasIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { PajamasIconPage, type PajamasIconPageProps };
