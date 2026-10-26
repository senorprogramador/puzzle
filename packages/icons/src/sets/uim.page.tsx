import { ALL_UIM_ICONS } from "./uim.constants";
import { UimIcon } from "./uim";
type UimIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "uim" as const;

const UimIconPage = ({ filter = "", size = 42, color = "#302f41" }: UimIconPageProps) => {
  const icons = filter === "" ? ALL_UIM_ICONS.slice(0, 100) : ALL_UIM_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Uim Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <UimIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { UimIconPage, type UimIconPageProps };
