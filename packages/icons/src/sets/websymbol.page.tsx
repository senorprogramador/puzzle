import { ALL_WEBSYMBOL_ICONS } from "./websymbol.constants";
import { WebsymbolIcon } from "./websymbol";
type WebsymbolIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "websymbol" as const;

const WebsymbolIconPage = ({ filter = "", size = 42, color = "#302f41" }: WebsymbolIconPageProps) => {
  const icons = filter === "" ? ALL_WEBSYMBOL_ICONS.slice(0, 100) : ALL_WEBSYMBOL_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Websymbol Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <WebsymbolIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { WebsymbolIconPage, type WebsymbolIconPageProps };
