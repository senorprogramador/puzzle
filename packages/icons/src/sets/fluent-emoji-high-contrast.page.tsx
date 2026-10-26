import { ALL_FLUENT_EMOJI_HIGH_CONTRAST_ICONS } from "./fluent-emoji-high-contrast.constants";
import { FluentEmojiHighContrastIcon } from "./fluent-emoji-high-contrast";
type FluentEmojiHighContrastIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "fluent-emoji-high-contrast" as const;

const FluentEmojiHighContrastIconPage = ({ filter = "", size = 42, color = "#302f41" }: FluentEmojiHighContrastIconPageProps) => {
  const icons = filter === "" ? ALL_FLUENT_EMOJI_HIGH_CONTRAST_ICONS.slice(0, 100) : ALL_FLUENT_EMOJI_HIGH_CONTRAST_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Fluent emoji high contrast Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <FluentEmojiHighContrastIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { FluentEmojiHighContrastIconPage, type FluentEmojiHighContrastIconPageProps };
