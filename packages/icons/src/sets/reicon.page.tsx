import { ALL_REICON_ICONS } from "./reicon.constants";
import { ReiconIcon } from "./reicon";
type ReiconIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "reicon" as const;

const ReiconIconPage = ({ filter = "", size = 42, color = "#302f41" }: ReiconIconPageProps) => {
  const icons = filter === "" ? ALL_REICON_ICONS.slice(0, 100) : ALL_REICON_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Reicon Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <ReiconIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { ReiconIconPage, type ReiconIconPageProps };
