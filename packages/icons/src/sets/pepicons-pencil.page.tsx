import { ALL_PEPICONS_PENCIL_ICONS } from "./pepicons-pencil.constants";
import { PepiconsPencilIcon } from "./pepicons-pencil";
type PepiconsPencilIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "pepicons-pencil" as const;

const PepiconsPencilIconPage = ({ filter = "", size = 42, color = "#302f41" }: PepiconsPencilIconPageProps) => {
  const icons = filter === "" ? ALL_PEPICONS_PENCIL_ICONS.slice(0, 100) : ALL_PEPICONS_PENCIL_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Pepicons pencil Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <PepiconsPencilIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { PepiconsPencilIconPage, type PepiconsPencilIconPageProps };
