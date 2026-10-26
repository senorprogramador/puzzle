import { ALL_CI_ICONS } from "./ci.constants";
import { CiIcon } from "./ci";
type CiIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "ci" as const;

const CiIconPage = ({ filter = "", size = 42, color = "#302f41" }: CiIconPageProps) => {
  const icons = filter === "" ? ALL_CI_ICONS.slice(0, 100) : ALL_CI_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Ci Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <CiIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { CiIconPage, type CiIconPageProps };
