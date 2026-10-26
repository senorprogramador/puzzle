import { ALL_AT_ICONS_ICONS } from "./at-icons.constants";
import { AtIconsIcon } from "./at-icons";
type AtIconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "at-icons" as const;

const AtIconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: AtIconsIconPageProps) => {
  const icons = filter === "" ? ALL_AT_ICONS_ICONS.slice(0, 100) : ALL_AT_ICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>At icons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <AtIconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { AtIconsIconPage, type AtIconsIconPageProps };
