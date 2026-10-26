import { ALL_ICONS8_ICONS } from "./icons8.constants";
import { Icons8Icon } from "./icons8";
type Icons8IconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "icons8" as const;

const Icons8IconPage = ({ filter = "", size = 42, color = "#302f41" }: Icons8IconPageProps) => {
  const icons = filter === "" ? ALL_ICONS8_ICONS.slice(0, 100) : ALL_ICONS8_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Icons8 Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <Icons8Icon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { Icons8IconPage, type Icons8IconPageProps };
