import { ALL_LUCIDE_ICONS } from "./lucide.constants";
import { LucideIcon } from "./lucide";
type LucideIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "lucide" as const;

const LucideIconPage = ({ filter = "", size = 42, color = "#302f41" }: LucideIconPageProps) => {
  const icons = filter === "" ? ALL_LUCIDE_ICONS.slice(0, 100) : ALL_LUCIDE_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Lucide Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <LucideIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { LucideIconPage, type LucideIconPageProps };
