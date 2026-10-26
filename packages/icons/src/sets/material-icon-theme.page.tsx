import { ALL_MATERIAL_ICON_THEME_ICONS } from "./material-icon-theme.constants";
import { MaterialIconThemeIcon } from "./material-icon-theme";
type MaterialIconThemeIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "material-icon-theme" as const;

const MaterialIconThemeIconPage = ({ filter = "", size = 42, color = "#302f41" }: MaterialIconThemeIconPageProps) => {
  const icons = filter === "" ? ALL_MATERIAL_ICON_THEME_ICONS.slice(0, 100) : ALL_MATERIAL_ICON_THEME_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Material icon theme Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <MaterialIconThemeIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { MaterialIconThemeIconPage, type MaterialIconThemeIconPageProps };
