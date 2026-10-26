import { ALL_FA_ICONS } from "./fa.constants";
import { FaIcon } from "./fa";
type FaIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "fa" as const;

const FaIconPage = ({ filter = "", size = 42, color = "#302f41" }: FaIconPageProps) => {
  const icons = filter === "" ? ALL_FA_ICONS.slice(0, 100) : ALL_FA_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Fa Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <FaIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { FaIconPage, type FaIconPageProps };
