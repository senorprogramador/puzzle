import { ALL_LSICON_ICONS } from "./lsicon.constants";
import { LsiconIcon } from "./lsicon";
type LsiconIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "lsicon" as const;

const LsiconIconPage = ({ filter = "", size = 42, color = "#302f41" }: LsiconIconPageProps) => {
  const icons = filter === "" ? ALL_LSICON_ICONS.slice(0, 100) : ALL_LSICON_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Lsicon Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <LsiconIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { LsiconIconPage, type LsiconIconPageProps };
