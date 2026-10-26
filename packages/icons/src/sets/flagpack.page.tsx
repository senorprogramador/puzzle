import { ALL_FLAGPACK_ICONS } from "./flagpack.constants";
import { FlagpackIcon } from "./flagpack";
type FlagpackIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "flagpack" as const;

const FlagpackIconPage = ({ filter = "", size = 42, color = "#302f41" }: FlagpackIconPageProps) => {
  const icons = filter === "" ? ALL_FLAGPACK_ICONS.slice(0, 100) : ALL_FLAGPACK_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Flagpack Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <FlagpackIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { FlagpackIconPage, type FlagpackIconPageProps };
