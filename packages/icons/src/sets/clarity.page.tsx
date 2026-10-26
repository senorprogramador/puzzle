import { ALL_CLARITY_ICONS } from "./clarity.constants";
import { ClarityIcon } from "./clarity";
type ClarityIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "clarity" as const;

const ClarityIconPage = ({ filter = "", size = 42, color = "#302f41" }: ClarityIconPageProps) => {
  const icons = filter === "" ? ALL_CLARITY_ICONS.slice(0, 100) : ALL_CLARITY_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Clarity Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <ClarityIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { ClarityIconPage, type ClarityIconPageProps };
