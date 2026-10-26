import { ALL_EMOJIONE_ICONS } from "./emojione.constants";
import { EmojioneIcon } from "./emojione";
type EmojioneIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "emojione" as const;

const EmojioneIconPage = ({ filter = "", size = 42, color = "#302f41" }: EmojioneIconPageProps) => {
  const icons = filter === "" ? ALL_EMOJIONE_ICONS.slice(0, 100) : ALL_EMOJIONE_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Emojione Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <EmojioneIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { EmojioneIconPage, type EmojioneIconPageProps };
