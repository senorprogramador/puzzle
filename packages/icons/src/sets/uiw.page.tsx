import { ALL_UIW_ICONS } from "./uiw.constants";
import { UiwIcon } from "./uiw";
type UiwIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "uiw" as const;

const UiwIconPage = ({ filter = "", size = 42, color = "#302f41" }: UiwIconPageProps) => {
  const icons = filter === "" ? ALL_UIW_ICONS.slice(0, 100) : ALL_UIW_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Uiw Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <UiwIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { UiwIconPage, type UiwIconPageProps };
