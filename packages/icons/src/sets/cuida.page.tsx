import { ALL_CUIDA_ICONS } from "./cuida.constants";
import { CuidaIcon } from "./cuida";
type CuidaIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "cuida" as const;

const CuidaIconPage = ({ filter = "", size = 42, color = "#302f41" }: CuidaIconPageProps) => {
  const icons = filter === "" ? ALL_CUIDA_ICONS.slice(0, 100) : ALL_CUIDA_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Cuida Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <CuidaIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { CuidaIconPage, type CuidaIconPageProps };
