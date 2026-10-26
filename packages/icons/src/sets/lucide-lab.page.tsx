import { ALL_LUCIDE_LAB_ICONS } from "./lucide-lab.constants";
import { LucideLabIcon } from "./lucide-lab";
type LucideLabIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "lucide-lab" as const;

const LucideLabIconPage = ({ filter = "", size = 42, color = "#302f41" }: LucideLabIconPageProps) => {
  const icons = filter === "" ? ALL_LUCIDE_LAB_ICONS.slice(0, 100) : ALL_LUCIDE_LAB_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Lucide lab Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <LucideLabIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { LucideLabIconPage, type LucideLabIconPageProps };
