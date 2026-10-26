import { ALL_FLUENT_ICONS } from "./fluent.constants";
import { FluentIcon } from "./fluent";
type FluentIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "fluent" as const;

const FluentIconPage = ({ filter = "", size = 42, color = "#302f41" }: FluentIconPageProps) => {
  const icons = filter === "" ? ALL_FLUENT_ICONS.slice(0, 100) : ALL_FLUENT_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Fluent Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <FluentIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { FluentIconPage, type FluentIconPageProps };
