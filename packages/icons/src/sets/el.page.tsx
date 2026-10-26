import { ALL_EL_ICONS } from "./el.constants";
import { ElIcon } from "./el";
type ElIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "el" as const;

const ElIconPage = ({ filter = "", size = 42, color = "#302f41" }: ElIconPageProps) => {
  const icons = filter === "" ? ALL_EL_ICONS.slice(0, 100) : ALL_EL_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>El Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <ElIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { ElIconPage, type ElIconPageProps };
