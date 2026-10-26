import { ALL_CATPPUCCIN_ICONS } from "./catppuccin.constants";
import { CatppuccinIcon } from "./catppuccin";
type CatppuccinIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "catppuccin" as const;

const CatppuccinIconPage = ({ filter = "", size = 42, color = "#302f41" }: CatppuccinIconPageProps) => {
  const icons = filter === "" ? ALL_CATPPUCCIN_ICONS.slice(0, 100) : ALL_CATPPUCCIN_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Catppuccin Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <CatppuccinIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { CatppuccinIconPage, type CatppuccinIconPageProps };
