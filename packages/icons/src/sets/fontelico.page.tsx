import { ALL_FONTELICO_ICONS } from "./fontelico.constants";
import { FontelicoIcon } from "./fontelico";
type FontelicoIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "fontelico" as const;

const FontelicoIconPage = ({ filter = "", size = 42, color = "#302f41" }: FontelicoIconPageProps) => {
  const icons = filter === "" ? ALL_FONTELICO_ICONS.slice(0, 100) : ALL_FONTELICO_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Fontelico Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <FontelicoIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { FontelicoIconPage, type FontelicoIconPageProps };
