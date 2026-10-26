import { ALL_MDI_LIGHT_ICONS } from "./mdi-light.constants";
import { MdiLightIcon } from "./mdi-light";
type MdiLightIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "mdi-light" as const;

const MdiLightIconPage = ({ filter = "", size = 42, color = "#302f41" }: MdiLightIconPageProps) => {
  const icons = filter === "" ? ALL_MDI_LIGHT_ICONS.slice(0, 100) : ALL_MDI_LIGHT_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Mdi light Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <MdiLightIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { MdiLightIconPage, type MdiLightIconPageProps };
