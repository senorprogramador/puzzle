import { ALL_METEOR_ICONS_ICONS } from "./meteor-icons.constants";
import { MeteorIconsIcon } from "./meteor-icons";
type MeteorIconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "meteor-icons" as const;

const MeteorIconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: MeteorIconsIconPageProps) => {
  const icons = filter === "" ? ALL_METEOR_ICONS_ICONS.slice(0, 100) : ALL_METEOR_ICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Meteor icons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <MeteorIconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { MeteorIconsIconPage, type MeteorIconsIconPageProps };
