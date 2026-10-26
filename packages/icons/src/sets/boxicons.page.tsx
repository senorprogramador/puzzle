import { ALL_BOXICONS_ICONS } from "./boxicons.constants";
import { BoxiconsIcon } from "./boxicons";
type BoxiconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "boxicons" as const;

const BoxiconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: BoxiconsIconPageProps) => {
  const icons = filter === "" ? ALL_BOXICONS_ICONS.slice(0, 100) : ALL_BOXICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Boxicons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <BoxiconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { BoxiconsIconPage, type BoxiconsIconPageProps };
