import { ALL_FLUENT_COLOR_ICONS } from "./fluent-color.constants";
import { FluentColorIcon } from "./fluent-color";
type FluentColorIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "fluent-color" as const;

const FluentColorIconPage = ({ filter = "", size = 42, color = "#302f41" }: FluentColorIconPageProps) => {
  const icons = filter === "" ? ALL_FLUENT_COLOR_ICONS.slice(0, 100) : ALL_FLUENT_COLOR_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Fluent color Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <FluentColorIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { FluentColorIconPage, type FluentColorIconPageProps };
