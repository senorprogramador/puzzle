import { ALL_CODICON_ICONS } from "./codicon.constants";
import { CodiconIcon } from "./codicon";
type CodiconIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "codicon" as const;

const CodiconIconPage = ({ filter = "", size = 42, color = "#302f41" }: CodiconIconPageProps) => {
  const icons = filter === "" ? ALL_CODICON_ICONS.slice(0, 100) : ALL_CODICON_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Codicon Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <CodiconIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { CodiconIconPage, type CodiconIconPageProps };
