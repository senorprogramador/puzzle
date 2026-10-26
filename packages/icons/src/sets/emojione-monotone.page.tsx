import { ALL_EMOJIONE_MONOTONE_ICONS } from "./emojione-monotone.constants";
import { EmojioneMonotoneIcon } from "./emojione-monotone";
type EmojioneMonotoneIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "emojione-monotone" as const;

const EmojioneMonotoneIconPage = ({ filter = "", size = 42, color = "#302f41" }: EmojioneMonotoneIconPageProps) => {
  const icons = filter === "" ? ALL_EMOJIONE_MONOTONE_ICONS.slice(0, 100) : ALL_EMOJIONE_MONOTONE_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Emojione monotone Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <EmojioneMonotoneIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { EmojioneMonotoneIconPage, type EmojioneMonotoneIconPageProps };
