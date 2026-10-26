import { ALL_GAME_ICONS_ICONS } from "./game-icons.constants";
import { GameIconsIcon } from "./game-icons";
type GameIconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "game-icons" as const;

const GameIconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: GameIconsIconPageProps) => {
  const icons = filter === "" ? ALL_GAME_ICONS_ICONS.slice(0, 100) : ALL_GAME_ICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Game icons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <GameIconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { GameIconsIconPage, type GameIconsIconPageProps };
