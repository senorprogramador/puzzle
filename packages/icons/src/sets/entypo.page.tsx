import { ALL_ENTYPO_ICONS } from "./entypo.constants";
import { EntypoIcon } from "./entypo";
type EntypoIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "entypo" as const;

const EntypoIconPage = ({ filter = "", size = 42, color = "#302f41" }: EntypoIconPageProps) => {
  const icons = filter === "" ? ALL_ENTYPO_ICONS.slice(0, 100) : ALL_ENTYPO_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Entypo Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <EntypoIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { EntypoIconPage, type EntypoIconPageProps };
