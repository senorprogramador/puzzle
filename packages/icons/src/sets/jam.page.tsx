import { ALL_JAM_ICONS } from "./jam.constants";
import { JamIcon } from "./jam";
type JamIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "jam" as const;

const JamIconPage = ({ filter = "", size = 42, color = "#302f41" }: JamIconPageProps) => {
  const icons = filter === "" ? ALL_JAM_ICONS.slice(0, 100) : ALL_JAM_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Jam Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <JamIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { JamIconPage, type JamIconPageProps };
