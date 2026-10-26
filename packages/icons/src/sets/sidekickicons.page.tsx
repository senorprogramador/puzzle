import { ALL_SIDEKICKICONS_ICONS } from "./sidekickicons.constants";
import { SidekickiconsIcon } from "./sidekickicons";
type SidekickiconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "sidekickicons" as const;

const SidekickiconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: SidekickiconsIconPageProps) => {
  const icons = filter === "" ? ALL_SIDEKICKICONS_ICONS.slice(0, 100) : ALL_SIDEKICKICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Sidekickicons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <SidekickiconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { SidekickiconsIconPage, type SidekickiconsIconPageProps };
