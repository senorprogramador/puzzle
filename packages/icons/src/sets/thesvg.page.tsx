import { ALL_THESVG_ICONS } from "./thesvg.constants";
import { ThesvgIcon } from "./thesvg";
type ThesvgIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "thesvg" as const;

const ThesvgIconPage = ({ filter = "", size = 42, color = "#302f41" }: ThesvgIconPageProps) => {
  const icons = filter === "" ? ALL_THESVG_ICONS.slice(0, 100) : ALL_THESVG_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Thesvg Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <ThesvgIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { ThesvgIconPage, type ThesvgIconPageProps };
