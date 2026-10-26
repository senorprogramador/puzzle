import { ALL_OUI_ICONS } from "./oui.constants";
import { OuiIcon } from "./oui";
type OuiIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "oui" as const;

const OuiIconPage = ({ filter = "", size = 42, color = "#302f41" }: OuiIconPageProps) => {
  const icons = filter === "" ? ALL_OUI_ICONS.slice(0, 100) : ALL_OUI_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Oui Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <OuiIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { OuiIconPage, type OuiIconPageProps };
