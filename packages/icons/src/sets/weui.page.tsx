import { ALL_WEUI_ICONS } from "./weui.constants";
import { WeuiIcon } from "./weui";
type WeuiIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "weui" as const;

const WeuiIconPage = ({ filter = "", size = 42, color = "#302f41" }: WeuiIconPageProps) => {
  const icons = filter === "" ? ALL_WEUI_ICONS.slice(0, 100) : ALL_WEUI_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Weui Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <WeuiIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { WeuiIconPage, type WeuiIconPageProps };
