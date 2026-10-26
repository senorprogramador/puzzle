import { ALL_MATERIAL_SYMBOLS_ICONS } from "./material-symbols.constants";
import { MaterialSymbolsIcon } from "./material-symbols";
type MaterialSymbolsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "material-symbols" as const;

const MaterialSymbolsIconPage = ({ filter = "", size = 42, color = "#302f41" }: MaterialSymbolsIconPageProps) => {
  const icons = filter === "" ? ALL_MATERIAL_SYMBOLS_ICONS.slice(0, 100) : ALL_MATERIAL_SYMBOLS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Material symbols Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <MaterialSymbolsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { MaterialSymbolsIconPage, type MaterialSymbolsIconPageProps };
