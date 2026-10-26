import { ALL_FE_ICONS } from "./fe.constants";
import { FeIcon } from "./fe";
type FeIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "fe" as const;

const FeIconPage = ({ filter = "", size = 42, color = "#302f41" }: FeIconPageProps) => {
  const icons = filter === "" ? ALL_FE_ICONS.slice(0, 100) : ALL_FE_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Fe Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <FeIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { FeIconPage, type FeIconPageProps };
