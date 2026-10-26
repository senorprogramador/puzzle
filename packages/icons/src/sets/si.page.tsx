import { ALL_SI_ICONS } from "./si.constants";
import { SiIcon } from "./si";
type SiIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "si" as const;

const SiIconPage = ({ filter = "", size = 42, color = "#302f41" }: SiIconPageProps) => {
  const icons = filter === "" ? ALL_SI_ICONS.slice(0, 100) : ALL_SI_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Si Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <SiIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { SiIconPage, type SiIconPageProps };
