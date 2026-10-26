import { ALL_OCTICON_ICONS } from "./octicon.constants";
import { OcticonIcon } from "./octicon";
type OcticonIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "octicon" as const;

const OcticonIconPage = ({ filter = "", size = 42, color = "#302f41" }: OcticonIconPageProps) => {
  const icons = filter === "" ? ALL_OCTICON_ICONS.slice(0, 100) : ALL_OCTICON_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Octicon Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <OcticonIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { OcticonIconPage, type OcticonIconPageProps };
