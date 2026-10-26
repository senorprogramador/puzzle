import { ALL_UIL_ICONS } from "./uil.constants";
import { UilIcon } from "./uil";
type UilIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "uil" as const;

const UilIconPage = ({ filter = "", size = 42, color = "#302f41" }: UilIconPageProps) => {
  const icons = filter === "" ? ALL_UIL_ICONS.slice(0, 100) : ALL_UIL_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Uil Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <UilIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { UilIconPage, type UilIconPageProps };
