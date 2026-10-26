import { ALL_PROICONS_ICONS } from "./proicons.constants";
import { ProiconsIcon } from "./proicons";
type ProiconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "proicons" as const;

const ProiconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: ProiconsIconPageProps) => {
  const icons = filter === "" ? ALL_PROICONS_ICONS.slice(0, 100) : ALL_PROICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Proicons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <ProiconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { ProiconsIconPage, type ProiconsIconPageProps };
