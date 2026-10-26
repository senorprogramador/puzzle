import { ALL_UIS_ICONS } from "./uis.constants";
import { UisIcon } from "./uis";
type UisIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "uis" as const;

const UisIconPage = ({ filter = "", size = 42, color = "#302f41" }: UisIconPageProps) => {
  const icons = filter === "" ? ALL_UIS_ICONS.slice(0, 100) : ALL_UIS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Uis Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <UisIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { UisIconPage, type UisIconPageProps };
