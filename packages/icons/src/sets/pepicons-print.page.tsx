import { ALL_PEPICONS_PRINT_ICONS } from "./pepicons-print.constants";
import { PepiconsPrintIcon } from "./pepicons-print";
type PepiconsPrintIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "pepicons-print" as const;

const PepiconsPrintIconPage = ({ filter = "", size = 42, color = "#302f41" }: PepiconsPrintIconPageProps) => {
  const icons = filter === "" ? ALL_PEPICONS_PRINT_ICONS.slice(0, 100) : ALL_PEPICONS_PRINT_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Pepicons print Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <PepiconsPrintIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { PepiconsPrintIconPage, type PepiconsPrintIconPageProps };
