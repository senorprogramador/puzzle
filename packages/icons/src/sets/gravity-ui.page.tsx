import { ALL_GRAVITY_UI_ICONS } from "./gravity-ui.constants";
import { GravityUiIcon } from "./gravity-ui";
type GravityUiIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "gravity-ui" as const;

const GravityUiIconPage = ({ filter = "", size = 42, color = "#302f41" }: GravityUiIconPageProps) => {
  const icons = filter === "" ? ALL_GRAVITY_UI_ICONS.slice(0, 100) : ALL_GRAVITY_UI_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Gravity ui Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <GravityUiIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { GravityUiIconPage, type GravityUiIconPageProps };
