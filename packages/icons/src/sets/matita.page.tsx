import { ALL_MATITA_ICONS } from "./matita.constants";
import { MatitaIcon } from "./matita";
type MatitaIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "matita" as const;

const MatitaIconPage = ({ filter = "", size = 42, color = "#302f41" }: MatitaIconPageProps) => {
  const icons = filter === "" ? ALL_MATITA_ICONS.slice(0, 100) : ALL_MATITA_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Matita Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <MatitaIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { MatitaIconPage, type MatitaIconPageProps };
