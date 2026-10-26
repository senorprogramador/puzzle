import { ALL_LUCIDE_EXTENDED_ICONS } from "./lucide-extended.constants";
import { LucideExtendedIcon } from "./lucide-extended";
type LucideExtendedIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "lucide-extended" as const;

const LucideExtendedIconPage = ({ filter = "", size = 42, color = "#302f41" }: LucideExtendedIconPageProps) => {
  const icons = filter === "" ? ALL_LUCIDE_EXTENDED_ICONS.slice(0, 100) : ALL_LUCIDE_EXTENDED_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Lucide extended Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <LucideExtendedIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { LucideExtendedIconPage, type LucideExtendedIconPageProps };
