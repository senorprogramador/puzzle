import { ALL_LS_ICONS } from "./ls.constants";
import { LsIcon } from "./ls";
type LsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "ls" as const;

const LsIconPage = ({ filter = "", size = 42, color = "#302f41" }: LsIconPageProps) => {
  const icons = filter === "" ? ALL_LS_ICONS.slice(0, 100) : ALL_LS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Ls Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <LsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { LsIconPage, type LsIconPageProps };
