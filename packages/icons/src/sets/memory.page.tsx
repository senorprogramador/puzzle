import { ALL_MEMORY_ICONS } from "./memory.constants";
import { MemoryIcon } from "./memory";
type MemoryIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "memory" as const;

const MemoryIconPage = ({ filter = "", size = 42, color = "#302f41" }: MemoryIconPageProps) => {
  const icons = filter === "" ? ALL_MEMORY_ICONS.slice(0, 100) : ALL_MEMORY_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Memory Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <MemoryIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { MemoryIconPage, type MemoryIconPageProps };
