import { ALL_FAMICONS_ICONS } from "./famicons.constants";
import { FamiconsIcon } from "./famicons";
type FamiconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "famicons" as const;

const FamiconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: FamiconsIconPageProps) => {
  const icons = filter === "" ? ALL_FAMICONS_ICONS.slice(0, 100) : ALL_FAMICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Famicons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <FamiconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { FamiconsIconPage, type FamiconsIconPageProps };
