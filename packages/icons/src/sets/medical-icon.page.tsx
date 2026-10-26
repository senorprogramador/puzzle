import { ALL_MEDICAL_ICON_ICONS } from "./medical-icon.constants";
import { MedicalIconIcon } from "./medical-icon";
type MedicalIconIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "medical-icon" as const;

const MedicalIconIconPage = ({ filter = "", size = 42, color = "#302f41" }: MedicalIconIconPageProps) => {
  const icons = filter === "" ? ALL_MEDICAL_ICON_ICONS.slice(0, 100) : ALL_MEDICAL_ICON_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Medical icon Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <MedicalIconIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { MedicalIconIconPage, type MedicalIconIconPageProps };
