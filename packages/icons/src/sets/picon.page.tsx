import { ALL_PICON_ICONS } from "./picon.constants";
import { PiconIcon } from "./picon";
type PiconIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "picon" as const;

const PiconIconPage = ({ filter = "", size = 42, color = "#302f41" }: PiconIconPageProps) => {
  const icons = filter === "" ? ALL_PICON_ICONS.slice(0, 100) : ALL_PICON_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Picon Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <PiconIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { PiconIconPage, type PiconIconPageProps };
