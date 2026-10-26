import { ALL_DEVICON_ICONS } from "./devicon.constants";
import { DeviconIcon } from "./devicon";
type DeviconIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "devicon" as const;

const DeviconIconPage = ({ filter = "", size = 42, color = "#302f41" }: DeviconIconPageProps) => {
  const icons = filter === "" ? ALL_DEVICON_ICONS.slice(0, 100) : ALL_DEVICON_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Devicon Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <DeviconIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { DeviconIconPage, type DeviconIconPageProps };
