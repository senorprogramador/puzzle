import { ALL_CIF_ICONS } from "./cif.constants";
import { CifIcon } from "./cif";
type CifIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "cif" as const;

const CifIconPage = ({ filter = "", size = 42, color = "#302f41" }: CifIconPageProps) => {
  const icons = filter === "" ? ALL_CIF_ICONS.slice(0, 100) : ALL_CIF_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Cif Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <CifIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { CifIconPage, type CifIconPageProps };
