import { ALL_TABLER_ICONS } from "./tabler.constants";
import { TablerIcon } from "./tabler";
type TablerIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "tabler" as const;

const TablerIconPage = ({ filter = "", size = 42, color = "#302f41" }: TablerIconPageProps) => {
  const icons = filter === "" ? ALL_TABLER_ICONS.slice(0, 100) : ALL_TABLER_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Tabler Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <TablerIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { TablerIconPage, type TablerIconPageProps };
