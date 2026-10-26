import { ALL_OOUI_ICONS } from "./ooui.constants";
import { OouiIcon } from "./ooui";
type OouiIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "ooui" as const;

const OouiIconPage = ({ filter = "", size = 42, color = "#302f41" }: OouiIconPageProps) => {
  const icons = filter === "" ? ALL_OOUI_ICONS.slice(0, 100) : ALL_OOUI_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Ooui Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <OouiIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { OouiIconPage, type OouiIconPageProps };
