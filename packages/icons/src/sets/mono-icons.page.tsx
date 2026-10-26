import { ALL_MONO_ICONS_ICONS } from "./mono-icons.constants";
import { MonoIconsIcon } from "./mono-icons";
type MonoIconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "mono-icons" as const;

const MonoIconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: MonoIconsIconPageProps) => {
  const icons = filter === "" ? ALL_MONO_ICONS_ICONS.slice(0, 100) : ALL_MONO_ICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Mono icons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <MonoIconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { MonoIconsIconPage, type MonoIconsIconPageProps };
