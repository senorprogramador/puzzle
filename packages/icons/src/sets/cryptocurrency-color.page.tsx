import { ALL_CRYPTOCURRENCY_COLOR_ICONS } from "./cryptocurrency-color.constants";
import { CryptocurrencyColorIcon } from "./cryptocurrency-color";
type CryptocurrencyColorIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "cryptocurrency-color" as const;

const CryptocurrencyColorIconPage = ({ filter = "", size = 42, color = "#302f41" }: CryptocurrencyColorIconPageProps) => {
  const icons = filter === "" ? ALL_CRYPTOCURRENCY_COLOR_ICONS.slice(0, 100) : ALL_CRYPTOCURRENCY_COLOR_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Cryptocurrency color Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <CryptocurrencyColorIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { CryptocurrencyColorIconPage, type CryptocurrencyColorIconPageProps };
