import { ALL_MDI_ICONS } from "./mdi.constants";
import { MdiIcon } from "./mdi";
type MdiIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "mdi" as const;

const MdiIconPage = ({ filter = "", size = 42, color = "#302f41" }: MdiIconPageProps) => {
  const icons = filter === "" ? ALL_MDI_ICONS.slice(0, 100) : ALL_MDI_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Mdi Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <MdiIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { MdiIconPage, type MdiIconPageProps };
