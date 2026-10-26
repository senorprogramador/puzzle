import { ALL_SIMPLE_LINE_ICONS_ICONS } from "./simple-line-icons.constants";
import { SimpleLineIconsIcon } from "./simple-line-icons";
type SimpleLineIconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "simple-line-icons" as const;

const SimpleLineIconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: SimpleLineIconsIconPageProps) => {
  const icons = filter === "" ? ALL_SIMPLE_LINE_ICONS_ICONS.slice(0, 100) : ALL_SIMPLE_LINE_ICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Simple line icons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <SimpleLineIconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { SimpleLineIconsIconPage, type SimpleLineIconsIconPageProps };
