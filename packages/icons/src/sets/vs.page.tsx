import { ALL_VS_ICONS } from "./vs.constants";
import { VsIcon } from "./vs";
type VsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "vs" as const;

const VsIconPage = ({ filter = "", size = 42, color = "#302f41" }: VsIconPageProps) => {
  const icons = filter === "" ? ALL_VS_ICONS.slice(0, 100) : ALL_VS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Vs Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <VsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { VsIconPage, type VsIconPageProps };
