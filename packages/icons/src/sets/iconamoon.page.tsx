import { ALL_ICONAMOON_ICONS } from "./iconamoon.constants";
import { IconamoonIcon } from "./iconamoon";
type IconamoonIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "iconamoon" as const;

const IconamoonIconPage = ({ filter = "", size = 42, color = "#302f41" }: IconamoonIconPageProps) => {
  const icons = filter === "" ? ALL_ICONAMOON_ICONS.slice(0, 100) : ALL_ICONAMOON_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Iconamoon Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <IconamoonIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { IconamoonIconPage, type IconamoonIconPageProps };
