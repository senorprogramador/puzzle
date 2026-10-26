import { ALL_BASIL_ICONS } from "./basil.constants";
import { BasilIcon } from "./basil";
type BasilIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "basil" as const;

const BasilIconPage = ({ filter = "", size = 42, color = "#302f41" }: BasilIconPageProps) => {
  const icons = filter === "" ? ALL_BASIL_ICONS.slice(0, 100) : ALL_BASIL_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Basil Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <BasilIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { BasilIconPage, type BasilIconPageProps };
