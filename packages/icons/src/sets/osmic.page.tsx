import { ALL_OSMIC_ICONS } from "./osmic.constants";
import { OsmicIcon } from "./osmic";
type OsmicIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "osmic" as const;

const OsmicIconPage = ({ filter = "", size = 42, color = "#302f41" }: OsmicIconPageProps) => {
  const icons = filter === "" ? ALL_OSMIC_ICONS.slice(0, 100) : ALL_OSMIC_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Osmic Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <OsmicIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { OsmicIconPage, type OsmicIconPageProps };
