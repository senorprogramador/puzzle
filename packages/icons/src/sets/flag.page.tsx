import { ALL_FLAG_ICONS } from "./flag.constants";
import { FlagIcon } from "./flag";
type FlagIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "flag" as const;

const FlagIconPage = ({ filter = "", size = 42, color = "#302f41" }: FlagIconPageProps) => {
  const icons = filter === "" ? ALL_FLAG_ICONS.slice(0, 100) : ALL_FLAG_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Flag Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <FlagIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { FlagIconPage, type FlagIconPageProps };
