import { ALL_FLUENT_EMOJI_FLAT_ICONS } from "./fluent-emoji-flat.constants";
import { FluentEmojiFlatIcon } from "./fluent-emoji-flat";
type FluentEmojiFlatIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "fluent-emoji-flat" as const;

const FluentEmojiFlatIconPage = ({ filter = "", size = 42, color = "#302f41" }: FluentEmojiFlatIconPageProps) => {
  const icons = filter === "" ? ALL_FLUENT_EMOJI_FLAT_ICONS.slice(0, 100) : ALL_FLUENT_EMOJI_FLAT_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Fluent emoji flat Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <FluentEmojiFlatIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { FluentEmojiFlatIconPage, type FluentEmojiFlatIconPageProps };
