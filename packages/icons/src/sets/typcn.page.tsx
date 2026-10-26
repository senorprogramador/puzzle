import { ALL_TYPCN_ICONS } from "./typcn.constants";
import { TypcnIcon } from "./typcn";
type TypcnIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "typcn" as const;

const TypcnIconPage = ({ filter = "", size = 42, color = "#302f41" }: TypcnIconPageProps) => {
  const icons = filter === "" ? ALL_TYPCN_ICONS.slice(0, 100) : ALL_TYPCN_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Typcn Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <TypcnIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { TypcnIconPage, type TypcnIconPageProps };
