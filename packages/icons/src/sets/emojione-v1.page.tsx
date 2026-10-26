import { ALL_EMOJIONE_V1_ICONS } from "./emojione-v1.constants";
import { EmojioneV1Icon } from "./emojione-v1";
type EmojioneV1IconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "emojione-v1" as const;

const EmojioneV1IconPage = ({ filter = "", size = 42, color = "#302f41" }: EmojioneV1IconPageProps) => {
  const icons = filter === "" ? ALL_EMOJIONE_V1_ICONS.slice(0, 100) : ALL_EMOJIONE_V1_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Emojione v1 Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <EmojioneV1Icon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { EmojioneV1IconPage, type EmojioneV1IconPageProps };
