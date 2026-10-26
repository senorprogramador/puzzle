import { ALL_FLUENT_EMOJI_ICONS } from "./fluent-emoji.constants";
import { FluentEmojiIcon } from "./fluent-emoji";
type FluentEmojiIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "fluent-emoji" as const;

const FluentEmojiIconPage = ({ filter = "", size = 42, color = "#302f41" }: FluentEmojiIconPageProps) => {
  const icons = filter === "" ? ALL_FLUENT_EMOJI_ICONS.slice(0, 100) : ALL_FLUENT_EMOJI_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Fluent emoji Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <FluentEmojiIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { FluentEmojiIconPage, type FluentEmojiIconPageProps };
