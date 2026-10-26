import { ALL_THESVG_COLOR_ICONS } from "./thesvg-color.constants";
import { ThesvgColorIcon } from "./thesvg-color";
type ThesvgColorIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "thesvg-color" as const;

const ThesvgColorIconPage = ({ filter = "", size = 42, color = "#302f41" }: ThesvgColorIconPageProps) => {
  const icons = filter === "" ? ALL_THESVG_COLOR_ICONS.slice(0, 100) : ALL_THESVG_COLOR_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Thesvg color Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <ThesvgColorIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { ThesvgColorIconPage, type ThesvgColorIconPageProps };
