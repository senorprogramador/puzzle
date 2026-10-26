import { ALL_MATERIAL_SYMBOLS_LIGHT_ICONS } from "./material-symbols-light.constants";
import { MaterialSymbolsLightIcon } from "./material-symbols-light";
type MaterialSymbolsLightIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "material-symbols-light" as const;

const MaterialSymbolsLightIconPage = ({ filter = "", size = 42, color = "#302f41" }: MaterialSymbolsLightIconPageProps) => {
  const icons = filter === "" ? ALL_MATERIAL_SYMBOLS_LIGHT_ICONS.slice(0, 100) : ALL_MATERIAL_SYMBOLS_LIGHT_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Material symbols light Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <MaterialSymbolsLightIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { MaterialSymbolsLightIconPage, type MaterialSymbolsLightIconPageProps };
