import { ALL_TWEMOJI_ICONS } from "./twemoji.constants";
import { TwemojiIcon } from "./twemoji";
type TwemojiIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "twemoji" as const;

const TwemojiIconPage = ({ filter = "", size = 42, color = "#302f41" }: TwemojiIconPageProps) => {
  const icons = filter === "" ? ALL_TWEMOJI_ICONS.slice(0, 100) : ALL_TWEMOJI_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Twemoji Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <TwemojiIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { TwemojiIconPage, type TwemojiIconPageProps };
