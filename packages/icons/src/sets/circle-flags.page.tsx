import { ALL_CIRCLE_FLAGS_ICONS } from "./circle-flags.constants";
import { CircleFlagsIcon } from "./circle-flags";
type CircleFlagsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "circle-flags" as const;

const CircleFlagsIconPage = ({ filter = "", size = 42, color = "#302f41" }: CircleFlagsIconPageProps) => {
  const icons = filter === "" ? ALL_CIRCLE_FLAGS_ICONS.slice(0, 100) : ALL_CIRCLE_FLAGS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Circle flags Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <CircleFlagsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { CircleFlagsIconPage, type CircleFlagsIconPageProps };
