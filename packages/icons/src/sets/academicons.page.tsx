import { ALL_ACADEMICONS_ICONS } from "./academicons.constants";
import { AcademiconsIcon } from "./academicons";
type AcademiconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "academicons" as const;

const AcademiconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: AcademiconsIconPageProps) => {
  const icons = filter === "" ? ALL_ACADEMICONS_ICONS.slice(0, 100) : ALL_ACADEMICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Academicons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <AcademiconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { AcademiconsIconPage, type AcademiconsIconPageProps };
