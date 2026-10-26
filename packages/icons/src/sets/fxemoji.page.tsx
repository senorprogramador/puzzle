import { ALL_FXEMOJI_ICONS } from "./fxemoji.constants";
import { FxemojiIcon } from "./fxemoji";
type FxemojiIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "fxemoji" as const;

const FxemojiIconPage = ({ filter = "", size = 42, color = "#302f41" }: FxemojiIconPageProps) => {
  const icons = filter === "" ? ALL_FXEMOJI_ICONS.slice(0, 100) : ALL_FXEMOJI_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Fxemoji Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <FxemojiIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { FxemojiIconPage, type FxemojiIconPageProps };
