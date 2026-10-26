import { ALL_SUBWAY_ICONS } from "./subway.constants";
import { SubwayIcon } from "./subway";
type SubwayIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "subway" as const;

const SubwayIconPage = ({ filter = "", size = 42, color = "#302f41" }: SubwayIconPageProps) => {
  const icons = filter === "" ? ALL_SUBWAY_ICONS.slice(0, 100) : ALL_SUBWAY_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Subway Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <SubwayIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { SubwayIconPage, type SubwayIconPageProps };
