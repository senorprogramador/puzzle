import { ALL_STASH_ICONS } from "./stash.constants";
import { StashIcon } from "./stash";
type StashIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "stash" as const;

const StashIconPage = ({ filter = "", size = 42, color = "#302f41" }: StashIconPageProps) => {
  const icons = filter === "" ? ALL_STASH_ICONS.slice(0, 100) : ALL_STASH_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Stash Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <StashIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { StashIconPage, type StashIconPageProps };
