import { ALL_CHARM_ICONS } from "./charm.constants";
import { CharmIcon } from "./charm";
type CharmIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "charm" as const;

const CharmIconPage = ({ filter = "", size = 42, color = "#302f41" }: CharmIconPageProps) => {
  const icons = filter === "" ? ALL_CHARM_ICONS.slice(0, 100) : ALL_CHARM_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Charm Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <CharmIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { CharmIconPage, type CharmIconPageProps };
