import { ALL_FLAT_UI_ICONS } from "./flat-ui.constants";
import { FlatUiIcon } from "./flat-ui";
type FlatUiIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "flat-ui" as const;

const FlatUiIconPage = ({ filter = "", size = 42, color = "#302f41" }: FlatUiIconPageProps) => {
  const icons = filter === "" ? ALL_FLAT_UI_ICONS.slice(0, 100) : ALL_FLAT_UI_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Flat ui Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <FlatUiIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { FlatUiIconPage, type FlatUiIconPageProps };
