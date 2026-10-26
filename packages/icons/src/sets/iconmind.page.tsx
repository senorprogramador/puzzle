import { ALL_ICONMIND_ICONS } from "./iconmind.constants";
import { IconmindIcon } from "./iconmind";
type IconmindIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "iconmind" as const;

const IconmindIconPage = ({ filter = "", size = 42, color = "#302f41" }: IconmindIconPageProps) => {
  const icons = filter === "" ? ALL_ICONMIND_ICONS.slice(0, 100) : ALL_ICONMIND_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Iconmind Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <IconmindIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { IconmindIconPage, type IconmindIconPageProps };
