import { ALL_TOKEN_BRANDED_ICONS } from "./token-branded.constants";
import { TokenBrandedIcon } from "./token-branded";
type TokenBrandedIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "token-branded" as const;

const TokenBrandedIconPage = ({ filter = "", size = 42, color = "#302f41" }: TokenBrandedIconPageProps) => {
  const icons = filter === "" ? ALL_TOKEN_BRANDED_ICONS.slice(0, 100) : ALL_TOKEN_BRANDED_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Token branded Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <TokenBrandedIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { TokenBrandedIconPage, type TokenBrandedIconPageProps };
