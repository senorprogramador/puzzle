import { ALL_UNJS_ICONS } from "./unjs.constants";
import { UnjsIcon } from "./unjs";
type UnjsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "unjs" as const;

const UnjsIconPage = ({ filter = "", size = 42, color = "#302f41" }: UnjsIconPageProps) => {
  const icons = filter === "" ? ALL_UNJS_ICONS.slice(0, 100) : ALL_UNJS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Unjs Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <UnjsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { UnjsIconPage, type UnjsIconPageProps };
