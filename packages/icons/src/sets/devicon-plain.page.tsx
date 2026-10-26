import { ALL_DEVICON_PLAIN_ICONS } from "./devicon-plain.constants";
import { DeviconPlainIcon } from "./devicon-plain";
type DeviconPlainIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "devicon-plain" as const;

const DeviconPlainIconPage = ({ filter = "", size = 42, color = "#302f41" }: DeviconPlainIconPageProps) => {
  const icons = filter === "" ? ALL_DEVICON_PLAIN_ICONS.slice(0, 100) : ALL_DEVICON_PLAIN_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Devicon plain Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <DeviconPlainIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { DeviconPlainIconPage, type DeviconPlainIconPageProps };
