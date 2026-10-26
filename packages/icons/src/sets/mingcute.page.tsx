import { ALL_MINGCUTE_ICONS } from "./mingcute.constants";
import { MingcuteIcon } from "./mingcute";
type MingcuteIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "mingcute" as const;

const MingcuteIconPage = ({ filter = "", size = 42, color = "#302f41" }: MingcuteIconPageProps) => {
  const icons = filter === "" ? ALL_MINGCUTE_ICONS.slice(0, 100) : ALL_MINGCUTE_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Mingcute Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <MingcuteIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { MingcuteIconPage, type MingcuteIconPageProps };
