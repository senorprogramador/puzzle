import { ALL_MAKI_ICONS } from "./maki.constants";
import { MakiIcon } from "./maki";
type MakiIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "maki" as const;

const MakiIconPage = ({ filter = "", size = 42, color = "#302f41" }: MakiIconPageProps) => {
  const icons = filter === "" ? ALL_MAKI_ICONS.slice(0, 100) : ALL_MAKI_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Maki Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <MakiIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { MakiIconPage, type MakiIconPageProps };
