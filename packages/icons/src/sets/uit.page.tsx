import { ALL_UIT_ICONS } from "./uit.constants";
import { UitIcon } from "./uit";
type UitIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "uit" as const;

const UitIconPage = ({ filter = "", size = 42, color = "#302f41" }: UitIconPageProps) => {
  const icons = filter === "" ? ALL_UIT_ICONS.slice(0, 100) : ALL_UIT_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Uit Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <UitIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { UitIconPage, type UitIconPageProps };
