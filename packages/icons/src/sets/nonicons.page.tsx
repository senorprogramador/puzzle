import { ALL_NONICONS_ICONS } from "./nonicons.constants";
import { NoniconsIcon } from "./nonicons";
type NoniconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "nonicons" as const;

const NoniconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: NoniconsIconPageProps) => {
  const icons = filter === "" ? ALL_NONICONS_ICONS.slice(0, 100) : ALL_NONICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Nonicons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <NoniconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { NoniconsIconPage, type NoniconsIconPageProps };
