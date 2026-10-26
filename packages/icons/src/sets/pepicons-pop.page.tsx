import { ALL_PEPICONS_POP_ICONS } from "./pepicons-pop.constants";
import { PepiconsPopIcon } from "./pepicons-pop";
type PepiconsPopIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "pepicons-pop" as const;

const PepiconsPopIconPage = ({ filter = "", size = 42, color = "#302f41" }: PepiconsPopIconPageProps) => {
  const icons = filter === "" ? ALL_PEPICONS_POP_ICONS.slice(0, 100) : ALL_PEPICONS_POP_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Pepicons pop Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <PepiconsPopIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { PepiconsPopIconPage, type PepiconsPopIconPageProps };
