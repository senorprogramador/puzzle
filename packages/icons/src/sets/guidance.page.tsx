import { ALL_GUIDANCE_ICONS } from "./guidance.constants";
import { GuidanceIcon } from "./guidance";
type GuidanceIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "guidance" as const;

const GuidanceIconPage = ({ filter = "", size = 42, color = "#302f41" }: GuidanceIconPageProps) => {
  const icons = filter === "" ? ALL_GUIDANCE_ICONS.slice(0, 100) : ALL_GUIDANCE_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Guidance Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <GuidanceIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { GuidanceIconPage, type GuidanceIconPageProps };
